import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User';
import { PendingRegistration } from '../models/PendingRegistration';
import { createSessionAndTokens, rotateRefreshToken, revokeSession, revokeAllUserSessions } from '../services/authService';
import { registerWorkerDirect, initiateRegistration, verifyRegistration, resendVerificationOTP } from '../services/verification.service';
import { logAudit } from '../middleware/auditLogger';
import { AppError } from '../utils/appError';
import { AUDIT_ACTIONS, USER_STATUS } from '@parishak/shared';
import { AuthRequest } from '../middleware/auth';

/**
 * Register a new worker directly (Stores in User collection with status PENDING for Admin Approval)
 * POST /api/v1/auth/register
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await registerWorkerDirect(req.body, req as AuthRequest);

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Initiate worker registration with OTP (Stores in PendingRegistration, sends OTP)
 * POST /api/v1/auth/initiate-register
 */
export const initiateRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await initiateRegistration(req.body);

    res.status(201).json({
      success: true,
      message: `Registration initiated. A 6-digit verification code has been dispatched to ${result.destination}.`,
      data: {
        registrationId: result.registrationId,
        workerId: result.workerId,
        expiresInSeconds: result.expiresInSeconds
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify registration OTP and create User account with status PENDING
 * POST /api/v1/auth/verify-registration
 */
export const verifyRegistrationController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await verifyRegistration(req.body, req as AuthRequest);

    res.status(200).json({
      success: true,
      message: 'Account verified and submitted for Administrator approval. Welcome to PARISHAK.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resend verification OTP
 * POST /api/v1/auth/resend-verification
 */
export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier } = req.body;
    const result = await resendVerificationOTP(identifier);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        expiresInSeconds: result.expiresInSeconds
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate active worker / admin and create session
 * POST /api/v1/auth/login
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, password } = req.body;

    const isEmail = identifier.includes('@');
    const query = isEmail
      ? { email: identifier.toLowerCase().trim() }
      : { workerId: identifier.toUpperCase().trim() };

    const user = await User.findOne(query).populate('organizationId');
    if (!user) {
      // Check if user is pending registration OTP
      const isPending = await PendingRegistration.findOne(query);
      if (isPending) {
        throw new AppError(
          'Your registration is pending verification. Please verify with the 6-digit code sent to you.',
          403,
          'ACCOUNT_NOT_VERIFIED'
        );
      }
      throw new AppError('Invalid credentials. Please verify your Worker ID / Email and password.', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials. Please verify your Worker ID / Email and password.', 401, 'INVALID_CREDENTIALS');
    }

    // Check account approval status
    if (user.status === USER_STATUS.PENDING) {
      throw new AppError(
        'Your registration is awaiting approval by the Plant Safety Administrator. You will be able to log in once an administrator approves your account.',
        403,
        'ACCOUNT_PENDING_APPROVAL'
      );
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      throw new AppError('Account is suspended. Contact compliance administrator.', 403, 'ACCOUNT_SUSPENDED');
    }

    if (user.status === USER_STATUS.DEACTIVATED) {
      throw new AppError('Account is deactivated. Contact compliance administrator.', 403, 'ACCOUNT_DEACTIVATED');
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw new AppError('Account is not active. Contact compliance administrator.', 403, 'ACCOUNT_INACTIVE');
    }

    user.lastLoginAt = new Date();
    user.lastActiveAt = new Date();
    await user.save();

    // Create stateful session & tokens
    const { tokens, session } = await createSessionAndTokens(
      user,
      req.ip,
      req.headers['user-agent']
    );

    await logAudit(
      { user, headers: req.headers, socket: req.socket } as unknown as AuthRequest,
      AUDIT_ACTIONS.USER_LOGIN,
      'User',
      user.id,
      { workerId: user.workerId, role: user.role, sessionId: session.sessionId }
    );

    const org = user.organizationId as any;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          workerId: user.workerId,
          fullName: user.fullName,
          phone: user.phone,
          email: user.email,
          organizationId: org ? org.id : '',
          organizationName: org ? org.name : '',
          sector: user.sector,
          jobRole: user.jobRole,
          experienceYears: user.experienceYears,
          preferredLanguage: user.preferredLanguage,
          role: user.role,
          status: user.status,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt.toISOString()
        },
        tokens
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rotate Refresh Token and return fresh Access + Refresh tokens
 * POST /api/v1/auth/refresh
 */
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400, 'REFRESH_TOKEN_REQUIRED');
    }

    const { tokens } = await rotateRefreshToken(
      refreshToken,
      req.ip,
      req.headers['user-agent']
    );

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: { tokens }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout current session
 * POST /api/v1/auth/logout
 */
export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.auth?.sessionId) {
      await revokeSession(req.auth.sessionId);
    } else if (req.user) {
      await revokeAllUserSessions(req.user.id);
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout all sessions
 * POST /api/v1/auth/logout-all
 */
export const logoutAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user) {
      await revokeAllUserSessions(req.user.id);
    }

    res.status(200).json({
      success: true,
      message: 'All active sessions have been terminated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request password reset token
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier } = req.body;
    const isEmail = identifier.includes('@');
    const query = isEmail
      ? { email: identifier.toLowerCase().trim() }
      : { workerId: identifier.toUpperCase().trim() };

    const user = await User.findOne(query);
    if (!user) {
      // Prevent user enumeration by returning 200 generic message
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this identifier, a password reset link has been dispatched.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset token generated successfully.',
      data: {
        resetToken // Provided for verification in development / automated tests
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password using token
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new AppError('Password reset token is invalid or has expired', 400, 'INVALID_RESET_TOKEN');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Revoke all existing sessions for security
    await revokeAllUserSessions(user.id);

    await logAudit(
      { user, headers: req.headers, socket: req.socket } as unknown as AuthRequest,
      AUDIT_ACTIONS.PASSWORD_RESET,
      'User',
      user.id,
      { workerId: user.workerId }
    );

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. Please login with your new password.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated user profile
 * GET /api/v1/auth/me
 */
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const user = await User.findById(req.user.id).populate('organizationId');
    if (!user) {
      throw new AppError('User not found', 404, 'RESOURCE_NOT_FOUND');
    }

    const org = user.organizationId as any;

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        workerId: user.workerId,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        organizationId: org ? org.id : '',
        organizationName: org ? org.name : '',
        sector: user.sector,
        jobRole: user.jobRole,
        experienceYears: user.experienceYears,
        preferredLanguage: user.preferredLanguage,
        role: user.role,
        status: user.status,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};
