import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TrainingModule } from '../models/TrainingModule';
import { Lesson } from '../models/Lesson';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { Certificate } from '../models/Certificate';
import { AppError } from '../utils/appError';
import { CERTIFICATE_STATUS } from '@parishak/shared';

export const getModules = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { category, sector } = req.query;
    const filter: Record<string, unknown> = { isPublished: true };

    if (category && category !== 'ALL') {
      filter.category = category;
    }
    if (sector && sector !== 'ALL') {
      filter.sector = { $in: [sector, 'GENERAL'] };
    }

    const modules = await TrainingModule.find(filter).sort({ moduleNumber: 1 });

    // Fetch user progress and certificates if authenticated
    let completedModules = new Set<string>();
    let certifiedModules = new Set<string>();

    if (req.userId) {
      const attempts = await AssessmentAttempt.find({
        userId: req.userId,
        passed: true
      }).select('moduleId');
      completedModules = new Set(attempts.map((a) => a.moduleId.toString()));

      const certs = await Certificate.find({
        userId: req.userId,
        status: CERTIFICATE_STATUS.VALID
      }).select('moduleId');
      certifiedModules = new Set(certs.map((c) => c.moduleId.toString()));
    }

    const result = modules.map((m) => {
      const isCompleted = completedModules.has(m._id.toString());
      const isCertified = certifiedModules.has(m._id.toString());
      return {
        id: m.id,
        moduleNumber: m.moduleNumber,
        title: m.title,
        description: m.description,
        sector: m.sector,
        category: m.category,
        estimatedDurationMinutes: m.estimatedDurationMinutes,
        difficulty: m.difficulty,
        iconName: m.iconName,
        thumbnailUrl: m.thumbnailUrl,
        lessonsCount: m.lessonsCount,
        passingScore: m.passingScore,
        progressPercentage: isCertified ? 100 : isCompleted ? 80 : 0,
        isCertified
      };
    });

    res.status(200).json({
      success: true,
      message: 'Training modules retrieved',
      data: { modules: result }
    });
  } catch (error) {
    next(error);
  }
};

export const getModuleById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const moduleDoc = await TrainingModule.findById(id);
    if (!moduleDoc) throw new AppError('Training module not found', 404);

    const lessons = await Lesson.find({ moduleId: moduleDoc._id }).sort({ order: 1 });

    let isCompleted = false;
    let isCertified = false;

    if (req.userId) {
      const attempt = await AssessmentAttempt.findOne({
        userId: req.userId,
        moduleId: moduleDoc._id,
        passed: true
      });
      isCompleted = !!attempt;

      const cert = await Certificate.findOne({
        userId: req.userId,
        moduleId: moduleDoc._id,
        status: CERTIFICATE_STATUS.VALID
      });
      isCertified = !!cert;
    }

    res.status(200).json({
      success: true,
      message: 'Training module detail retrieved',
      data: {
        module: {
          id: moduleDoc.id,
          moduleNumber: moduleDoc.moduleNumber,
          title: moduleDoc.title,
          description: moduleDoc.description,
          sector: moduleDoc.sector,
          category: moduleDoc.category,
          estimatedDurationMinutes: moduleDoc.estimatedDurationMinutes,
          difficulty: moduleDoc.difficulty,
          iconName: moduleDoc.iconName,
          thumbnailUrl: moduleDoc.thumbnailUrl,
          passingScore: moduleDoc.passingScore,
          lessonsCount: lessons.length,
          isCompleted,
          isCertified,
          lessons: lessons.map((l) => ({
            id: l.id,
            moduleId: l.moduleId,
            order: l.order,
            title: l.title,
            description: l.description,
            durationMinutes: l.durationMinutes,
            keySafetyPoints: l.keySafetyPoints,
            contentBlocks: l.contentBlocks,
            checklist: l.checklist
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getModuleLessons = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const lessons = await Lesson.find({ moduleId: id }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      message: 'Lessons retrieved',
      data: {
        lessons: lessons.map((l) => ({
          id: l.id,
          moduleId: l.moduleId,
          order: l.order,
          title: l.title,
          description: l.description,
          durationMinutes: l.durationMinutes,
          keySafetyPoints: l.keySafetyPoints,
          contentBlocks: l.contentBlocks,
          checklist: l.checklist
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
