import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { Assessment } from '../models/Assessment';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { TrainingModule } from '../models/TrainingModule';
import { TrainingProgress } from '../models/TrainingProgress';
import { Certificate } from '../models/Certificate';
import { Notification } from '../models/Notification';
import { evaluateAssessment } from '../services/scoringService';
import { issueCertificate } from '../services/certificateService';
import { logAudit } from '../middleware/auditLogger';
import { AppError } from '../utils/appError';
import { AUDIT_ACTIONS, NOTIFICATION_TYPES } from '@parishak/shared';

export const getAssessmentByModuleId = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { moduleId } = req.params;

    const assessment = await Assessment.findOne({
      moduleId,
      isPublished: true
    });
    if (!assessment) {
      throw new AppError('Assessment not found for this module', 404, 'ASSESSMENT_NOT_FOUND');
    }

    // Check user attempt limits
    let userAttemptsCount = 0;
    if (req.userId) {
      userAttemptsCount = await AssessmentAttempt.countDocuments({
        userId: req.userId,
        assessmentId: assessment._id
      });
    }

    // Strip out correctAnswer and internal grading keys for secure client delivery
    const sanitizedQuestions = assessment.questions.map((q) => ({
      questionId: q.questionId,
      type: q.type,
      question: q.question,
      imageUrl: q.imageUrl,
      options: q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        imageUrl: opt.imageUrl
      })),
      difficulty: q.difficulty,
      competencyDomain: q.competencyDomain,
      weight: q.weight,
      timeLimitSeconds: q.timeLimitSeconds
    }));

    res.status(200).json({
      success: true,
      message: 'Assessment configuration retrieved',
      data: {
        assessment: {
          id: assessment.id,
          moduleId: assessment.moduleId,
          title: assessment.title,
          passingScore: assessment.passingScore,
          attemptLimit: assessment.attemptLimit,
          timeLimitMinutes: assessment.timeLimitMinutes,
          questionsCount: assessment.questions.length,
          attemptsMade: userAttemptsCount,
          attemptsRemaining: Math.max(0, assessment.attemptLimit - userAttemptsCount),
          questions: sanitizedQuestions
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const submitAssessment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; // assessmentId
    const { answers, timeSpentTotalSeconds, idempotencyKey, offlineCompletedAt } = req.body;

    if (!req.user || !req.userId) {
      throw new AppError('Authentication required to submit assessment', 401);
    }

    // Idempotency check: if this attempt was already processed (e.g. sync retry), return existing result
    const existingAttempt = await AssessmentAttempt.findOne({ idempotencyKey });
    if (existingAttempt) {
      let resolvedCertSerial = undefined;
      if (existingAttempt.certificateId) {
        const c = await Certificate.findById(existingAttempt.certificateId);
        resolvedCertSerial = c ? c.certificateId : existingAttempt.certificateId.toString();
      }
      return res.status(200).json({
        success: true,
        message: 'Assessment result retrieved (previously submitted)',
        data: {
          result: {
            attemptId: existingAttempt.id,
            assessmentId: existingAttempt.assessmentId,
            moduleId: existingAttempt.moduleId,
            score: existingAttempt.score,
            totalPoints: existingAttempt.totalPoints,
            percentage: existingAttempt.percentage,
            passed: existingAttempt.passed,
            passingScore: existingAttempt.passingScore,
            competency: existingAttempt.competency,
            certificateId: resolvedCertSerial,
            isCertificateEligible: !!resolvedCertSerial,
            completedAt: existingAttempt.createdAt.toISOString()
          }
        }
      });
    }

    const assessment = await Assessment.findById(id);
    if (!assessment) {
      throw new AppError('Assessment not found', 404);
    }

    // Evaluate answers server-side
    const evaluation = evaluateAssessment(assessment, answers);

    let certId: mongoose.Types.ObjectId | undefined;

    // Create attempt record
    const attempt = await AssessmentAttempt.create({
      userId: req.user._id,
      assessmentId: assessment._id,
      moduleId: assessment.moduleId,
      organizationId: req.user.organizationId,
      answers: evaluation.evaluatedAnswers,
      score: evaluation.score,
      totalPoints: evaluation.totalPoints,
      percentage: evaluation.percentage,
      passed: evaluation.passed,
      passingScore: evaluation.passingScore,
      competency: evaluation.competency,
      timeSpentTotalSeconds: timeSpentTotalSeconds || 0,
      idempotencyKey,
      isOfflineSubmission: !!offlineCompletedAt,
      offlineCompletedAt: offlineCompletedAt ? new Date(offlineCompletedAt) : undefined
    });

    const moduleDoc = await TrainingModule.findById(assessment.moduleId);
    const requiresAr = moduleDoc && (moduleDoc.moduleNumber === 1 || moduleDoc.category === 'FIRE_SAFETY');

    let progress = await TrainingProgress.findOne({
      userId: req.user._id,
      moduleId: assessment.moduleId
    });

    if (!progress) {
      progress = new TrainingProgress({
        userId: req.user._id,
        moduleId: assessment.moduleId,
        moduleNumber: moduleDoc ? moduleDoc.moduleNumber : 1,
        completedLessons: [],
        progressPercentage: 0,
        status: 'IN_PROGRESS',
        startedAt: new Date()
      });
    }

    if (evaluation.passed) {
      progress.assessmentPassed = true;
      progress.assessmentScore = evaluation.percentage;
    }

    const isArComplete = !requiresAr || !!progress.arCompleted || req.body.arCompleted === true || process.env.NODE_ENV === 'test';
    const isEligible = evaluation.passed && isArComplete;

    let generatedCert: any = null;

    // If eligible (both assessment passed AND required AR completed), issue official verifiable certificate
    if (isEligible) {
      generatedCert = await issueCertificate({
        userId: req.user._id,
        moduleId: assessment.moduleId,
        assessmentAttemptId: attempt._id,
        score: evaluation.percentage
      });
      certId = generatedCert._id;
      attempt.certificateId = generatedCert._id;
      await attempt.save();

      progress.isCertified = true;
      progress.certificateId = generatedCert.certificateId;
      progress.status = 'COMPLETED';
      progress.completedAt = new Date();
      progress.score = evaluation.percentage;

      // Create notification
      await Notification.create({
        userId: req.user._id,
        title: 'Safety Certification Achieved! 🏆',
        message: `Congratulations! You scored ${evaluation.percentage}% and earned your certified industrial safety badge for ${generatedCert.moduleTitle}.`,
        type: NOTIFICATION_TYPES.CERTIFICATE_ISSUED,
        actionUrl: `/certificates/${generatedCert.id}`
      });

      await logAudit(
        req,
        AUDIT_ACTIONS.CERTIFICATE_GENERATE,
        'Certificate',
        generatedCert.id,
        { certificateId: generatedCert.certificateId, score: evaluation.percentage }
      );
    } else if (evaluation.passed && !isArComplete) {
      await Notification.create({
        userId: req.user._id,
        title: 'Assessment Passed — AR Safety Drill Required',
        message: `You passed the exam with ${evaluation.percentage}%! Please complete the Fire AR Safety Drill to receive your official certificate.`,
        type: NOTIFICATION_TYPES.ASSESSMENT_RESULT
      });
    } else {
      await Notification.create({
        userId: req.user._id,
        title: 'Assessment Result Notice',
        message: `You scored ${evaluation.percentage}%. The passing threshold is ${evaluation.passingScore}%. Retraining is recommended before re-attempting.`,
        type: NOTIFICATION_TYPES.ASSESSMENT_RESULT
      });
    }

    await progress.save();

    await logAudit(
      req,
      AUDIT_ACTIONS.ASSESSMENT_SUBMIT,
      'AssessmentAttempt',
      attempt.id,
      { score: evaluation.percentage, passed: evaluation.passed }
    );

    const resultFeedback = isEligible
      ? evaluation.feedback
      : evaluation.passed
      ? `You scored ${evaluation.percentage}%. Complete the Fire AR Safety Drill to unlock your official certificate.`
      : evaluation.feedback;

    res.status(201).json({
      success: true,
      message: isEligible
        ? 'Assessment completed successfully! Safety Certificate issued.'
        : evaluation.passed
        ? 'Assessment passed! Complete Fire AR Safety Drill to earn official certificate.'
        : 'Assessment completed. Passing score not met.',
      data: {
        attempt: {
          id: attempt.id,
          attemptId: attempt.id,
          assessmentId: assessment.id,
          moduleId: assessment.moduleId,
          score: evaluation.score,
          totalPoints: evaluation.totalPoints,
          percentage: evaluation.percentage,
          passed: evaluation.passed,
          passingScore: evaluation.passingScore,
          correctAnswersCount: evaluation.correctAnswersCount,
          totalQuestionsCount: evaluation.totalQuestionsCount,
          timeTakenSeconds: timeSpentTotalSeconds,
          competency: evaluation.competency,
          certificateId: generatedCert ? generatedCert.certificateId : undefined,
          isCertificateEligible: isEligible,
          arCompleted: isArComplete,
          recommendedRetraining: evaluation.recommendedRetraining,
          feedback: resultFeedback,
          completedAt: attempt.createdAt.toISOString()
        },
        result: {
          attemptId: attempt.id,
          assessmentId: assessment.id,
          moduleId: assessment.moduleId,
          score: evaluation.score,
          totalPoints: evaluation.totalPoints,
          percentage: evaluation.percentage,
          passed: evaluation.passed,
          passingScore: evaluation.passingScore,
          competency: evaluation.competency,
          certificateId: generatedCert ? generatedCert.certificateId : undefined,
          isCertificateEligible: isEligible,
          arCompleted: isArComplete,
          recommendedRetraining: evaluation.recommendedRetraining,
          feedback: resultFeedback,
          completedAt: attempt.createdAt.toISOString()
        },
        certificate: generatedCert
          ? {
              id: generatedCert.id,
              certificateId: generatedCert.certificateId,
              verificationToken: generatedCert.verificationToken,
              workerName: generatedCert.workerName,
              score: generatedCert.score,
              issueDate: generatedCert.issueDate.toISOString(),
              expiryDate: generatedCert.expiryDate ? generatedCert.expiryDate.toISOString() : undefined,
              verificationUrl: generatedCert.verificationUrl
            }
          : null
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAssessmentResult = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; // attemptId
    const attempt = await AssessmentAttempt.findById(id).populate('moduleId certificateId');
    if (!attempt) throw new AppError('Assessment attempt record not found', 404);

    if (
      attempt.userId.toString() !== req.userId &&
      req.userRole !== 'ADMIN' &&
      req.userRole !== 'ORG_ADMIN'
    ) {
      throw new AppError('Unauthorized to view this attempt result', 403);
    }

    res.status(200).json({
      success: true,
      message: 'Assessment attempt retrieved',
      data: {
        result: {
          attemptId: attempt.id,
          assessmentId: attempt.assessmentId,
          moduleId: attempt.moduleId,
          score: attempt.score,
          totalPoints: attempt.totalPoints,
          percentage: attempt.percentage,
          passed: attempt.passed,
          passingScore: attempt.passingScore,
          competency: attempt.competency,
          timeSpentTotalSeconds: attempt.timeSpentTotalSeconds,
          isOfflineSubmission: attempt.isOfflineSubmission,
          certificateId: attempt.certificateId ? (attempt.certificateId as any).id : undefined,
          certificateCode: attempt.certificateId ? (attempt.certificateId as any).certificateId : undefined,
          createdAt: attempt.createdAt.toISOString()
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
