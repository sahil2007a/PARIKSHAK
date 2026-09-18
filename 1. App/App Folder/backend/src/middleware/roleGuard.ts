import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AppError } from '../utils/appError';
import { UserRole } from '@parishak/shared';

export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !req.userRole) {
      return next(new AppError('Authentication required', 401, 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.userRole)) {
      return next(
        new AppError(
          'You do not have permission to perform this action',
          403,
          'FORBIDDEN_ROLE'
        )
      );
    }

    next();
  };
};
