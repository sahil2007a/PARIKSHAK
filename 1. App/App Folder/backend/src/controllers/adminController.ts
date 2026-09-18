import { Response, NextFunction } from 'express';
import QRCode from 'qrcode';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import { TrainingModule } from '../models/TrainingModule';
import { Lesson } from '../models/Lesson';
import { Assessment } from '../models/Assessment';
import { AssessmentAttempt } from '../models/AssessmentAttempt';
import { Certificate } from '../models/Certificate';
import { AuditLog } from '../models/AuditLog';
import { logAudit } from '../middleware/auditLogger';
import { AppError } from '../utils/appError';
import {
  AUDIT_ACTIONS,
  CERTIFICATE_STATUS,
  USER_ROLES,
  USER_STATUS
} from '@parishak/shared';

export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const totalWorkers = await User.countDocuments({ role: USER_ROLES.WORKER });
    const activeWorkers = await User.countDocuments({
      role: USER_ROLES.WORKER,
      status: USER_STATUS.ACTIVE
    });
    const pendingApprovalsCount = await User.countDocuments({
      role: USER_ROLES.WORKER,
      status: USER_STATUS.PENDING
    });

    const totalCertificates = await Certificate.countDocuments({
      status: CERTIFICATE_STATUS.VALID
    });

    const now = new Date();
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const expiringCertificates = await Certificate.countDocuments({
      status: CERTIFICATE_STATUS.VALID,
      expiryDate: { $gte: now, $lte: thirtyDaysFromNow }
    });

    const expiredCertificates = await Certificate.countDocuments({
      $or: [{ status: CERTIFICATE_STATUS.EXPIRED }, { expiryDate: { $lt: now } }]
    });

    const totalModules = await TrainingModule.countDocuments({ isPublished: true });

    // Certified unique workers
    const certifiedWorkerIds = await Certificate.distinct('userId', {
      status: CERTIFICATE_STATUS.VALID
    });

    const compliancePercentage =
      totalWorkers > 0 ? Math.round((certifiedWorkerIds.length / totalWorkers) * 100) : 0;

    // Aggregate real monthly attempts and certificates
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const attemptsByMonth = await AssessmentAttempt.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          completions: { $sum: 1 }
        }
      }
    ]);

    const certsByMonth = await Certificate.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          certifications: { $sum: 1 }
        }
      }
    ]);

    const monthlyActivity: Array<{ month: string; completions: number; certifications: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const mIdx = d.getMonth() + 1;
      const y = d.getFullYear();
      const mName = monthNames[d.getMonth()];

      const matchAtt = attemptsByMonth.find((a) => a._id.month === mIdx && a._id.year === y);
      const matchCert = certsByMonth.find((c) => c._id.month === mIdx && c._id.year === y);

      monthlyActivity.push({
        month: mName,
        completions: matchAtt ? matchAtt.completions : 0,
        certifications: matchCert ? matchCert.certifications : 0
      });
    }

    // Module popularity & completion breakdown
    const modules = await TrainingModule.find({ isPublished: true }).select('moduleNumber title');
    const moduleStats = await Promise.all(
      modules.map(async (m) => {
        const attempts = await AssessmentAttempt.countDocuments({ moduleId: m._id });
        const passes = await AssessmentAttempt.countDocuments({ moduleId: m._id, passed: true });
        const certs = await Certificate.countDocuments({ moduleId: m._id, status: CERTIFICATE_STATUS.VALID });
        return {
          id: m.id,
          moduleNumber: m.moduleNumber,
          title: typeof m.title === 'string' ? m.title : m.title.en,
          attempts,
          passes,
          certifications: certs,
          passRate: attempts > 0 ? Math.round((passes / attempts) * 100) : 0
        };
      })
    );

    // Compute real AR drill statistics from MongoDB AssessmentAttempt collection
    const arAttempts = await AssessmentAttempt.find({
      $or: [
        { 'arTelemetry.arModeCompleted': true },
        { 'arTelemetry.totalDurationSeconds': { $gt: 0 } }
      ]
    });

    const totalArAttempts = arAttempts.length;
    let arPassRate = 0;
    let arAverageTimeSeconds = 0;
    const topSpatialViolations: Array<{ violation: string; count: number; severity: string }> = [];

    if (totalArAttempts > 0) {
      const arPasses = arAttempts.filter((a) => a.passed).length;
      arPassRate = Math.round((arPasses / totalArAttempts) * 100);
      const totalSeconds = arAttempts.reduce((acc, curr) => acc + (curr.arTelemetry?.totalDurationSeconds || 0), 0);
      arAverageTimeSeconds = Math.round(totalSeconds / totalArAttempts);

      const totalUnsafeViolations = arAttempts.reduce(
        (acc, curr) => acc + (curr.arTelemetry?.unsafeActionsTriggered || 0),
        0
      );
      if (totalUnsafeViolations > 0) {
        topSpatialViolations.push({
          violation: 'Spatial safety violations intercepted in AR session',
          count: totalUnsafeViolations,
          severity: 'HIGH'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Admin dashboard statistics retrieved',
      data: {
        stats: {
          totalWorkers,
          activeWorkers,
          pendingApprovalsCount,
          totalCertificates,
          certifiedWorkersCount: certifiedWorkerIds.length,
          compliancePercentage,
          expiringCertificates,
          expiredCertificates,
          totalModules,
          monthlyActivity,
          moduleStats,
          arDrillStats: {
            arModulesActive: 2,
            totalArAttempts,
            arPassRate,
            arAverageTimeSeconds,
            topSpatialViolations
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, sector, status, organizationId } = req.query;

    const filter: Record<string, unknown> = { role: USER_ROLES.WORKER };

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filter.$or = [
        { fullName: searchRegex },
        { workerId: searchRegex },
        { phone: searchRegex },
        { email: searchRegex }
      ];
    }

    if (sector && sector !== 'ALL') {
      filter.sector = sector;
    }
    if (status && status !== 'ALL') {
      filter.status = status;
    }
    if (organizationId) {
      filter.organizationId = organizationId;
    }

    const workers = await User.find(filter)
      .populate('organizationId')
      .sort({ createdAt: -1 });

    const totalModules = await TrainingModule.countDocuments({ isPublished: true });

    const results = await Promise.all(
      workers.map(async (w) => {
        const org = w.organizationId as any;

        const passedAttempts = await AssessmentAttempt.find({
          userId: w._id,
          passed: true
        }).sort({ createdAt: -1 });

        const uniquePassedModules = new Set(passedAttempts.map((a) => a.moduleId.toString()));
        const trainingProgress =
          totalModules > 0 ? Math.round((uniquePassedModules.size / totalModules) * 100) : 0;

        const latestAttempt = await AssessmentAttempt.findOne({ userId: w._id }).sort({ createdAt: -1 });

        const activeCert = await Certificate.findOne({
          userId: w._id,
          status: CERTIFICATE_STATUS.VALID
        });

        return {
          id: w.id,
          workerId: w.workerId,
          fullName: w.fullName,
          phone: w.phone,
          email: w.email,
          organizationName: org ? org.name : 'N/A',
          sector: w.sector,
          jobRole: w.jobRole,
          experienceYears: w.experienceYears,
          preferredLanguage: w.preferredLanguage,
          status: w.status,
          trainingProgress,
          completedModulesCount: uniquePassedModules.size,
          latestScore: latestAttempt ? latestAttempt.percentage : null,
          certificateStatus: activeCert ? 'CERTIFIED' : 'PENDING',
          lastActive: w.lastLoginAt ? w.lastLoginAt.toISOString() : w.createdAt.toISOString(),
          createdAt: w.createdAt.toISOString()
        };
      })
    );

    res.status(200).json({
      success: true,
      message: 'Workers directory retrieved',
      data: { workers: results }
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkerById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const worker = await User.findById(id).populate('organizationId');
    if (!worker) throw new AppError('Worker not found', 404);

    const attempts = await AssessmentAttempt.find({ userId: worker._id })
      .populate('moduleId')
      .sort({ createdAt: -1 });

    const certificates = await Certificate.find({ userId: worker._id }).sort({ createdAt: -1 });

    const org = worker.organizationId as any;

    res.status(200).json({
      success: true,
      message: 'Worker details retrieved',
      data: {
        worker: {
          id: worker.id,
          workerId: worker.workerId,
          fullName: worker.fullName,
          phone: worker.phone,
          email: worker.email,
          organizationId: org ? org.id : '',
          organizationName: org ? org.name : '',
          sector: worker.sector,
          jobRole: worker.jobRole,
          experienceYears: worker.experienceYears,
          preferredLanguage: worker.preferredLanguage,
          role: worker.role,
          status: worker.status,
          avatarUrl: worker.avatarUrl,
          createdAt: worker.createdAt.toISOString(),
          attempts: attempts.map((a) => ({
            id: a.id,
            moduleTitle: a.moduleId ? (a.moduleId as any).title : 'Unknown Module',
            score: a.percentage,
            passed: a.passed,
            competency: a.competency,
            timeSpentSeconds: a.timeSpentTotalSeconds,
            date: a.createdAt.toISOString()
          })),
          certificates: certificates.map((c) => ({
            id: c.id,
            certificateId: c.certificateId,
            moduleTitle: c.moduleTitle,
            score: c.score,
            status: c.status,
            issueDate: c.issueDate.toISOString(),
            expiryDate: c.expiryDate ? c.expiryDate.toISOString() : undefined,
            verificationUrl: c.verificationUrl
          }))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkerStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const worker = await User.findById(id);
    if (!worker) throw new AppError('Worker not found', 404);

    const oldStatus = worker.status;
    worker.status = status;
    if (status === USER_STATUS.SUSPENDED) {
      worker.refreshTokenVersion += 1; // invalidate active sessions
    }
    await worker.save();

    await logAudit(
      req,
      AUDIT_ACTIONS.USER_STATUS_CHANGE,
      'User',
      worker.id,
      { oldStatus, newStatus: status, workerId: worker.workerId }
    );

    res.status(200).json({
      success: true,
      message: `Worker status updated to ${status}`,
      data: { worker }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCertificates = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, status, moduleId } = req.query;

    const filter: Record<string, unknown> = {};
    if (status && status !== 'ALL') {
      filter.status = status;
    }
    if (moduleId && moduleId !== 'ALL') {
      filter.moduleId = moduleId;
    }
    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      filter.$or = [
        { certificateId: searchRegex },
        { workerName: searchRegex },
        { workerId: searchRegex },
        { organizationName: searchRegex }
      ];
    }

    const certificates = await Certificate.find(filter).sort({ createdAt: -1 });

    const total = await Certificate.countDocuments();
    const valid = await Certificate.countDocuments({ status: CERTIFICATE_STATUS.VALID });
    const revoked = await Certificate.countDocuments({ status: CERTIFICATE_STATUS.REVOKED });

    res.status(200).json({
      success: true,
      message: 'Certificates list retrieved',
      data: {
        stats: {
          total,
          valid,
          revoked
        },
        certificates: await Promise.all(
          certificates.map(async (c) => {
            let qrDataUrl = '';
            try {
              qrDataUrl = await QRCode.toDataURL(c.verificationUrl);
            } catch {}

            return {
              id: c.id,
              certificateId: c.certificateId,
              verificationToken: c.verificationToken,
              workerName: c.workerName,
              workerId: c.workerId,
              organizationName: c.organizationName,
              moduleId: c.moduleId,
              moduleTitle: c.moduleTitle,
              score: c.score,
              issueDate: c.issueDate.toISOString(),
              expiryDate: c.expiryDate ? c.expiryDate.toISOString() : undefined,
              status: c.status,
              adminVerified: c.adminVerified ?? true,
              verificationUrl: c.verificationUrl,
              qrCodeDataUrl: qrDataUrl,
              revocationReason: c.revocationReason,
              revokedAt: c.revokedAt ? c.revokedAt.toISOString() : undefined
            };
          })
        )
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminCertificateById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const cert = await Certificate.findById(id);
    if (!cert) throw new AppError('Certificate not found', 404);

    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(cert.verificationUrl);
    } catch {}

    res.status(200).json({
      success: true,
      message: 'Certificate details retrieved',
      data: {
        certificate: {
          id: cert.id,
          certificateId: cert.certificateId,
          verificationToken: cert.verificationToken,
          workerName: cert.workerName,
          workerId: cert.workerId,
          organizationName: cert.organizationName,
          moduleId: cert.moduleId,
          assessmentAttemptId: cert.assessmentAttemptId,
          moduleTitle: cert.moduleTitle,
          score: cert.score,
          issueDate: cert.issueDate.toISOString(),
          expiryDate: cert.expiryDate ? cert.expiryDate.toISOString() : undefined,
          status: cert.status,
          adminVerified: cert.adminVerified ?? true,
          verificationUrl: cert.verificationUrl,
          qrCodeDataUrl: qrDataUrl,
          revocationReason: cert.revocationReason,
          revokedAt: cert.revokedAt ? cert.revokedAt.toISOString() : undefined
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyCertificateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const cert = await Certificate.findById(id);
    if (!cert) throw new AppError('Certificate not found', 404);

    cert.adminVerified = true;
    cert.verificationTimestamp = new Date();
    if (cert.status === CERTIFICATE_STATUS.REVOKED) {
      cert.status = CERTIFICATE_STATUS.VALID;
      cert.revocationReason = undefined;
    }
    await cert.save();

    await logAudit(
      req,
      AUDIT_ACTIONS.CERTIFICATE_GENERATE,
      'Certificate',
      cert.id,
      { certificateId: cert.certificateId, action: 'ADMIN_VERIFIED' }
    );

    res.status(200).json({
      success: true,
      message: `Certificate ${cert.certificateId} has been verified and marked active`,
      data: { certificate: cert }
    });
  } catch (error) {
    next(error);
  }
};

export const revokeCertificate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const cert = await Certificate.findById(id);
    if (!cert) throw new AppError('Certificate not found', 404);

    if (cert.status === CERTIFICATE_STATUS.REVOKED) {
      throw new AppError('Certificate is already revoked', 400);
    }

    cert.status = CERTIFICATE_STATUS.REVOKED;
    cert.revocationReason = reason;
    cert.revokedAt = new Date();
    cert.revokedBy = req.user?._id;
    await cert.save();

    await logAudit(
      req,
      AUDIT_ACTIONS.CERTIFICATE_REVOKE,
      'Certificate',
      cert.id,
      { certificateId: cert.certificateId, reason }
    );

    res.status(200).json({
      success: true,
      message: `Certificate ${cert.certificateId} has been revoked`,
      data: { certificate: cert }
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { action, limit } = req.query;
    const filter: Record<string, unknown> = {};

    if (action && action !== 'ALL') {
      filter.action = action;
    }

    const maxLimit = Math.min(100, parseInt(String(limit || '50'), 10));
    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(maxLimit);

    res.status(200).json({
      success: true,
      message: 'Audit logs retrieved',
      data: {
        logs: logs.map((l) => ({
          id: l.id,
          userId: l.userId,
          userWorkerId: l.userWorkerId,
          userRole: l.userRole,
          action: l.action,
          entity: l.entity,
          entityId: l.entityId,
          details: l.details,
          ipAddress: l.ipAddress,
          createdAt: l.createdAt.toISOString()
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};
