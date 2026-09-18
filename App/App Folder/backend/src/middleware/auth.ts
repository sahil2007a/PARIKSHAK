import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser } from '../models/User';
import { AppError } from '../utils/appError';
import { UserRole } from '@parishak/shared';

export interface AuthContext {
  userId: string;
  workerId: string;
  role: UserRole;
  sessionId?: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
  userRole?: UserRole;
  auth?: AuthContext;
}

interface JwtAccessPayload {
  sub?: string;
  userId?: string;
  workerId: string;
  role: UserRole;
  sessionId?: string;
  type?: string;
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required. Please provide a valid Bearer token.', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    let decoded: JwtAccessPayload;

    try {
      decoded = jwt.verify(token, config.jwt.accessSecret) as JwtAccessPayload;
    } catch (jwtErr: any) {
      if (jwtErr.name === 'TokenExpiredError') {
        throw new AppError('Access token has expired. Please refresh your session.', 401, 'TOKEN_EXPIRED');
      }
      throw new AppError('Invalid authentication token.', 401, 'TOKEN_INVALID');
    }

    const userId = decoded.sub || decoded.userId;
    if (!userId) {
      throw new AppError('Malformed token payload.', 401, 'TOKEN_INVALID');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User associated with this token no longer exists.', 401, 'RESOURCE_NOT_FOUND');
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError('Your account has been suspended by compliance administrator.', 403, 'ACCOUNT_SUSPENDED');
    }

    if (user.status === 'DEACTIVATED') {
      throw new AppError('Your account has been deactivated.', 403, 'ACCOUNT_DEACTIVATED');
    }

    if (user.status !== 'ACTIVE') {
      throw new AppError('User account is not active.', 403, 'ACCOUNT_INACTIVE');
    }

    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;
    req.auth = {
      userId: user.id,
      workerId: user.workerId,
      role: user.role,
      sessionId: decoded.sessionId
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authenticateOptional = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query.token && typeof req.query.token === 'string') {
      token = req.query.token;
    }

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret) as JwtAccessPayload;
      const userId = decoded.sub || decoded.userId;
      if (userId) {
        const user = await User.findById(userId);
        if (user && user.status === 'ACTIVE') {
          req.user = user;
          req.userId = user.id;
          req.userRole = user.role;
          req.auth = {
            userId: user.id,
            workerId: user.workerId,
            role: user.role,
            sessionId: decoded.sessionId
          };
        }
      }
    } catch {
      // ignore token verification error in optional auth
    }

    next();
  } catch (error) {
    next(error);
  }
};
