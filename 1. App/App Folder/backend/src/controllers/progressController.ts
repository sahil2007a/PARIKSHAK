import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { TrainingModule } from '../models/TrainingModule';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { Assessment } from '../models/Assessment';
import { Certificate } from '../models/Certificate';
import { TrainingProgress } from '../models/TrainingProgress';
import { evaluateAssessment } from '../services/scoringService';
import { issueCertificate } from '../services/certificateService';
import { logAudit } from '../middleware/auditLogger';
import { AUDIT_ACTIONS, CERTIFICATE_STATUS, CompetencyBreakdown } from '@parishak/shared';
import { AppError } from '../utils/appError';

export const getUserProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

    const totalModules = await TrainingModule.countDocuments({ isPublished: true });

    // Passed assessment attempts
    const passedAttempts = await AssessmentAttempt.find({
      userId: req.userId,
      passed: true
    }).populate('moduleId');

    const uniquePassedModuleIds = new Set(
      passedAttempts.map((a) => a.moduleId._id.toString())
    );

    const validCertificates = await Certificate.find({
      userId: req.userId,
      status: CERTIFICATE_STATUS.VALID
    }).populate('moduleId');

    const completedCount = uniquePassedModuleIds.size;
    const progressPercentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

    // Calculate aggregated competency scores across all recent attempts
    const allAttempts = await AssessmentAttempt.find({ userId: req.userId }).sort({ createdAt: -1 });

    let knowledgeSum = 0;
    let recognitionSum = 0;
    let decisionMakingSum = 0;
    let procedureSum = 0;
    let safetyComplianceSum = 0;
    let count = allAttempts.length;

    if (count > 0) {
      allAttempts.forEach((att) => {
        knowledgeSum += att.competency.knowledge || 0;
        recognitionSum += att.competency.recognition || 0;
        decisionMakingSum += att.competency.decisionMaking || 0;
        procedureSum += att.competency.procedure || 0;
        safetyComplianceSum += att.competency.safetyCompliance || 0;
      });
    }

    const competency: CompetencyBreakdown = {
      knowledge: count > 0 ? Math.round(knowledgeSum / count) : 0,
      recognition: count > 0 ? Math.round(recognitionSum / count) : 0,
      decisionMaking: count > 0 ? Math.round(decisionMakingSum / count) : 0,
      procedure: count > 0 ? Math.round(procedureSum / count) : 0,
      safetyCompliance: count > 0 ? Math.round(safetyComplianceSum / count) : 0,
      overall:
        count > 0
          ? Math.round(
              (knowledgeSum + recognitionSum + decisionMakingSum + procedureSum + safetyComplianceSum) /
                (count * 5)
            )
          : 0
    };

    // User module progresses
    const moduleProgresses = await TrainingProgress.find({ userId: req.userId }).populate('moduleId');

    res.status(200).json({
      success: true,
      message: 'User training progress retrieved',
      data: {
        progress: {
          overallPercentage: progressPercentage,
          completedModulesCount: completedCount,
          totalModulesCount: totalModules,
          certifiedModulesCount: validCertificates.length,
          competency,
          moduleProgresses,
          recentAttempts: allAttempts.slice(0, 5).map((a) => ({
            id: a.id,
            moduleId: a.moduleId,
            score: a.percentage,
            passed: a.passed,
            date: a.createdAt.toISOString()
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateModuleLessonProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

    const { moduleId, lessonId, isCompleted } = req.body;
    if (!moduleId || !lessonId) {
      throw new AppError('moduleId and lessonId are required', 400, 'VALIDATION_ERROR');
    }

    const mod = await TrainingModule.findById(moduleId);
    if (!mod) {
      throw new AppError('Training module not found', 404, 'RESOURCE_NOT_FOUND');
    }

    let progress = await TrainingProgress.findOne({
      userId: req.userId,
      moduleId: mod._id
    });

    if (!progress) {
      progress = new TrainingProgress({
        userId: req.userId,
        moduleId: mod._id,
        moduleNumber: mod.moduleNumber,
        completedLessons: [],
        progressPercentage: 0,
        status: 'IN_PROGRESS',
        startedAt: new Date()
      });
    }

    if (isCompleted && !progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    progress.lastLessonId = lessonId;

    // Calculate percentage based on total lessons count
    const totalLessons = mod.lessonsCount || 3;
    progress.progressPercentage = Math.min(
      100,
      Math.round((progress.completedLessons.length / totalLessons) * 100)
    );

    if (progress.progressPercentage >= 100) {
      progress.status = 'COMPLETED';
      progress.completedAt = new Date();
    } else {
      progress.status = 'IN_PROGRESS';
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Lesson progress updated successfully',
      data: { progress }
    });
  } catch (error) {
    next(error);
  }
};

export const syncOfflineProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.userId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

    const { items } = req.body; // array of PendingSyncItem
    const processedIds: string[] = [];
    const certificatesEarned: any[] = [];

    for (const item of items || []) {
      if (item.type === 'ASSESSMENT_ATTEMPT') {
        const payload = item.payload;
        const { assessmentId, moduleId, answers, timeSpentTotalSeconds, idempotencyKey, offlineCompletedAt } = payload;

        // Check if already processed
        const existing = await AssessmentAttempt.findOne({ idempotencyKey });
        if (existing) {
          processedIds.push(item.id);
          continue;
        }

        const assessment = await Assessment.findById(assessmentId);
        if (!assessment) continue;

        const evaluation = evaluateAssessment(assessment, answers || []);

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
          isOfflineSubmission: true,
          offlineCompletedAt: offlineCompletedAt ? new Date(offlineCompletedAt) : new Date(item.createdAt)
        });

        if (evaluation.passed) {
          const cert = await issueCertificate({
            userId: req.user._id,
            moduleId: assessment.moduleId,
            assessmentAttemptId: attempt._id,
            score: evaluation.percentage
          });
          attempt.certificateId = cert._id;
          await attempt.save();
          certificatesEarned.push(cert);
        }

        processedIds.push(item.id);
      } else if (item.type === 'PROFILE_UPDATE') {
        const { fullName, phone, jobRole, experienceYears, preferredLanguage } = item.payload as any;
        const user = await User.findById(req.userId);
        if (user) {
          if (fullName) user.fullName = String(fullName).trim();
          if (phone) user.phone = String(phone).trim();
          if (jobRole) user.jobRole = String(jobRole).trim();
          if (experienceYears !== undefined) user.experienceYears = Number(experienceYears);
          if (preferredLanguage) user.preferredLanguage = preferredLanguage;
          user.lastActiveAt = new Date();
          await user.save();
        }
        processedIds.push(item.id);
      } else if (item.type === 'AR_DRILL_TELEMETRY') {
        const payload = item.payload as any;
        const { moduleId, totalDurationSeconds, unsafeActionsTriggered, isCompletedSuccessfully } = payload;
        let modId = mongoose.isValidObjectId(moduleId) ? moduleId : null;
        if (!modId) {
          const modNum = parseInt(String(moduleId), 10);
          if (!isNaN(modNum)) {
            const foundMod = await TrainingModule.findOne({ moduleNumber: modNum });
            if (foundMod) modId = foundMod._id;
          }
          if (!modId) {
            const fallbackMod = await TrainingModule.findOne();
            if (fallbackMod) modId = fallbackMod._id;
          }
        }
        if (modId) {
          const assessment = await Assessment.findOne({ moduleId: modId });
          if (assessment) {
            await AssessmentAttempt.create({
              userId: req.user._id,
              assessmentId: assessment._id,
              moduleId: modId,
              organizationId: req.user.organizationId,
              answers: [],
              score: isCompletedSuccessfully ? 85 : 50,
              totalPoints: 100,
              percentage: isCompletedSuccessfully ? 85 : 50,
              passed: !!isCompletedSuccessfully,
              passingScore: 75,
              competency: {
                knowledge: 85,
                recognition: 85,
                decisionMaking: 80,
                procedure: 90,
                safetyCompliance: 85,
                overall: 85
              },
              timeSpentTotalSeconds: totalDurationSeconds || 60,
              idempotencyKey: item.idempotencyKey || `ar-${Date.now()}-${Math.random()}`,
              isOfflineSubmission: true,
              arTelemetry: {
                arModeCompleted: !!isCompletedSuccessfully,
                totalDurationSeconds: totalDurationSeconds || 0,
                unsafeActionsTriggered: unsafeActionsTriggered || 0
              }
            });
          }
        }
        processedIds.push(item.id);
      } else if (item.type === 'LESSON_PROGRESS') {
        const { moduleId, lessonId, isCompleted } = item.payload as any;
        if (moduleId && lessonId && mongoose.isValidObjectId(moduleId)) {
          let progress = await TrainingProgress.findOne({ userId: req.userId, moduleId });
          if (!progress) {
            progress = new TrainingProgress({
              userId: req.userId,
              moduleId,
              moduleNumber: 1,
              completedLessons: [],
              progressPercentage: 0,
              status: 'IN_PROGRESS',
              startedAt: new Date()
            });
          }
          if (isCompleted && !progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            progress.progressPercentage = Math.min(100, progress.completedLessons.length * 33);
            if (progress.progressPercentage >= 100) {
              progress.status = 'COMPLETED';
              progress.completedAt = new Date();
            }
            await progress.save();
          }
        }
        processedIds.push(item.id);
      } else {
        processedIds.push(item.id);
      }
    }

    await logAudit(
      req,
      AUDIT_ACTIONS.SYNC_EXECUTED,
      'SyncQueue',
      req.userId,
      { processedCount: processedIds.length, certsEarned: certificatesEarned.length }
    );

    res.status(200).json({
      success: true,
      message: `Offline sync completed. ${processedIds.length} items processed.`,
      data: {
        syncedCount: processedIds.length,
        processedIds,
        certificatesEarned: certificatesEarned.map((c) => ({
          id: c.id,
          certificateId: c.certificateId,
          moduleTitle: c.moduleTitle,
          score: c.score,
          issueDate: c.issueDate.toISOString(),
          expiryDate: c.expiryDate ? c.expiryDate.toISOString() : undefined,
          verificationUrl: c.verificationUrl
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get module-specific vocational progress for the authenticated worker
 */
export const getVocationalProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

    const { moduleId } = req.params;
    let targetModuleId: any = null;
    let moduleNumber = 1;

    if (mongoose.isValidObjectId(moduleId)) {
      const mod = await TrainingModule.findById(moduleId);
      if (mod) {
        targetModuleId = mod._id;
        moduleNumber = mod.moduleNumber;
      }
    } else {
      const modNum = parseInt(moduleId, 10) || 1;
      const mod = await TrainingModule.findOne({ moduleNumber: modNum });
      if (mod) {
        targetModuleId = mod._id;
        moduleNumber = mod.moduleNumber;
      }
    }

    let progress = null;
    if (targetModuleId) {
      progress = await TrainingProgress.findOne({
        userId: req.userId,
        moduleId: targetModuleId
      });
    }

    const completedVideos = progress?.completedVideos || [];
    const completedChapters = progress?.completedChapters || [];
    const completedAssessments = progress?.completedAssessments || [];
    const completedArChapters = progress?.completedArChapters || [];

    const isEligible =
      completedVideos.length >= 5 &&
      completedChapters.length >= 4 &&
      completedAssessments.length >= 4;

    // Calculate normalized progress percentage:
    // Videos: 25%, Chapters: 25%, AR: 25%, Assessments: 25%
    const videoPct = Math.min(25, Math.round((completedVideos.length / 8) * 25));
    const chapterPct = Math.min(25, Math.round((completedChapters.length / 5) * 25));
    const arPct = Math.min(25, Math.round((completedArChapters.length / 5) * 25));
    const assessPct = Math.min(25, Math.round((completedAssessments.length / 5) * 25));
    const calculatedPercentage = Math.min(100, videoPct + chapterPct + arPct + assessPct);

    res.status(200).json({
      success: true,
      message: 'Vocational progress retrieved',
      data: {
        moduleId,
        moduleNumber,
        completedVideos,
        completedChapters,
        completedAssessments,
        completedArChapters,
        isCertificateEligible: isEligible,
        isCertified: progress?.isCertified || false,
        certificateId: progress?.certificateId || null,
        progressPercentage: progress?.isCertified ? 100 : calculatedPercentage
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update module vocational progress components
 */
export const updateVocationalProgress = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

    const { moduleId } = req.params;
    const {
      completedVideos,
      completedChapters,
      completedAssessments,
      completedArChapters
    } = req.body;

    let targetModule = null;
    if (mongoose.isValidObjectId(moduleId)) {
      targetModule = await TrainingModule.findById(moduleId);
    }
    if (!targetModule) {
      const modNum = parseInt(moduleId, 10) || 1;
      targetModule = await TrainingModule.findOne({ moduleNumber: modNum });
    }

    if (!targetModule) {
      throw new AppError('Training module not found', 404, 'RESOURCE_NOT_FOUND');
    }

    let progress = await TrainingProgress.findOne({
      userId: req.userId,
      moduleId: targetModule._id
    });

    if (!progress) {
      progress = new TrainingProgress({
        userId: req.userId,
        moduleId: targetModule._id,
        moduleNumber: targetModule.moduleNumber,
        completedLessons: [],
        completedVideos: [],
        completedChapters: [],
        completedAssessments: [],
        completedArChapters: [],
        progressPercentage: 0,
        status: 'IN_PROGRESS',
        startedAt: new Date()
      });
    }

    if (Array.isArray(completedVideos)) {
      progress.completedVideos = Array.from(new Set([...(progress.completedVideos || []), ...completedVideos]));
    }
    if (Array.isArray(completedChapters)) {
      progress.completedChapters = Array.from(new Set([...(progress.completedChapters || []), ...completedChapters]));
    }
    if (Array.isArray(completedAssessments)) {
      progress.completedAssessments = Array.from(new Set([...(progress.completedAssessments || []), ...completedAssessments]));
    }
    if (Array.isArray(completedArChapters)) {
      progress.completedArChapters = Array.from(new Set([...(progress.completedArChapters || []), ...completedArChapters]));
    }

    const vCount = progress.completedVideos?.length || 0;
    const cCount = progress.completedChapters?.length || 0;
    const aCount = progress.completedAssessments?.length || 0;
    const arCount = progress.completedArChapters?.length || 0;

    const isEligible = vCount >= 5 && cCount >= 4 && aCount >= 4;

    const videoPct = Math.min(25, Math.round((vCount / 8) * 25));
    const chapterPct = Math.min(25, Math.round((cCount / 5) * 25));
    const arPct = Math.min(25, Math.round((arCount / 5) * 25));
    const assessPct = Math.min(25, Math.round((aCount / 5) * 25));
    progress.progressPercentage = Math.min(100, videoPct + chapterPct + arPct + assessPct);

    if (progress.progressPercentage >= 100) {
      progress.status = 'COMPLETED';
    } else {
      progress.status = 'IN_PROGRESS';
    }

    await progress.save();

    res.status(200).json({
      success: true,
      message: 'Vocational progress updated successfully',
      data: {
        moduleId,
        completedVideos: progress.completedVideos,
        completedChapters: progress.completedChapters,
        completedAssessments: progress.completedAssessments,
        completedArChapters: progress.completedArChapters,
        isCertificateEligible: isEligible,
        isCertified: progress.isCertified || false,
        certificateId: progress.certificateId || null,
        progressPercentage: progress.progressPercentage
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Claim official certificate once 5/8 videos, 4/5 chapters, and 4/5 assessments are met
 */
export const claimVocationalCertificate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user || !req.userId) throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');

    const { moduleId } = req.params;
    let targetModule = null;
    if (mongoose.isValidObjectId(moduleId)) {
      targetModule = await TrainingModule.findById(moduleId);
    }
    if (!targetModule) {
      const modNum = parseInt(moduleId, 10) || 1;
      targetModule = await TrainingModule.findOne({ moduleNumber: modNum });
    }
    if (!targetModule) {
      throw new AppError('Module not found', 404, 'RESOURCE_NOT_FOUND');
    }

    let progress = await TrainingProgress.findOne({
      userId: req.userId,
      moduleId: targetModule._id
    });

    const vCount = progress?.completedVideos?.length || 0;
    const cCount = progress?.completedChapters?.length || 0;
    const aCount = progress?.completedAssessments?.length || 0;

    if (vCount < 5 || cCount < 4 || aCount < 4) {
      throw new AppError(
        `Certificate requirements not met: Need 5 videos (current: ${vCount}), 4 chapters (current: ${cCount}), 4 assessments (current: ${aCount})`,
        400,
        'REQUIREMENTS_NOT_MET'
      );
    }

    // Check if certificate already exists
    let existingCert = await Certificate.findOne({
      userId: req.userId,
      moduleId: targetModule._id,
      status: CERTIFICATE_STATUS.VALID
    });

    if (existingCert) {
      if (progress) {
        progress.isCertified = true;
        progress.certificateId = existingCert.certificateId;
        await progress.save();
      }
      return res.status(200).json({
        success: true,
        message: 'Existing certificate retrieved',
        data: { certificate: existingCert }
      });
    }

    // Create or find an attempt
    let attempt = await AssessmentAttempt.findOne({
      userId: req.userId,
      moduleId: targetModule._id
    }).sort({ createdAt: -1 });

    if (!attempt) {
      attempt = await AssessmentAttempt.create({
        userId: req.user._id,
        moduleId: targetModule._id,
        organizationId: req.user.organizationId,
        score: 95,
        totalPoints: 100,
        percentage: 95,
        passed: true,
        passingScore: 75,
        competency: {
          knowledge: 95,
          recognition: 95,
          decisionMaking: 90,
          procedure: 95,
          safetyCompliance: 95,
          overall: 95
        },
        timeSpentTotalSeconds: 300,
        idempotencyKey: `voc-claim-${req.userId}-${targetModule._id}-${Date.now()}`
      });
    }

    // Issue verifiable certificate using existing service
    const certificate = await issueCertificate({
      userId: req.user._id as mongoose.Types.ObjectId,
      moduleId: targetModule._id as mongoose.Types.ObjectId,
      assessmentAttemptId: attempt._id as mongoose.Types.ObjectId,
      score: 95
    });

    attempt.certificateId = certificate._id;
    await attempt.save();

    if (!progress) {
      progress = new TrainingProgress({
        userId: req.userId,
        moduleId: targetModule._id,
        moduleNumber: targetModule.moduleNumber,
        completedLessons: [],
        completedVideos: [],
        completedChapters: [],
        completedAssessments: [],
        completedArChapters: [],
        status: 'COMPLETED',
        startedAt: new Date()
      });
    }

    progress.isCertified = true;
    progress.certificateId = certificate.certificateId;
    progress.progressPercentage = 100;
    progress.status = 'COMPLETED';
    progress.completedAt = new Date();
    await progress.save();

    res.status(201).json({
      success: true,
      message: 'Verified safety credential issued successfully',
      data: { certificate }
    });
  } catch (error) {
    next(error);
  }
};

