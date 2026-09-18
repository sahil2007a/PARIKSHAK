import { AuditLog } from '../models/AuditLog';
import { AuditAction } from '@parishak/shared';
import { AuthRequest } from './auth';
import { logger } from '../utils/logger';

export const logAudit = async (
  req: AuthRequest,
  action: AuditAction,
  entity: string,
  entityId: string,
  details: Record<string, unknown> = {}
) => {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    await AuditLog.create({
      userId: req.user?._id,
      userWorkerId: req.user?.workerId,
      userRole: req.user?.role,
      action,
      entity,
      entityId,
      details,
      ipAddress,
      userAgent
    });
  } catch (err) {
    logger.error('Failed to write audit log', err);
  }
};
