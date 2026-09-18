import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { AppError } from '../utils/appError';
import { revokeAllUserSessions } from '../services/authService';
import { logAudit } from '../middleware/auditLogger';
import { AUDIT_ACTIONS } from '@parishak/shared';

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId).populate('organizationId');
    if (!user) {
      throw new AppError('User profile not found', 404, 'RESOURCE_NOT_FOUND');
    }

    const org = user.organizationId as any;

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
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
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { fullName, phone, jobRole, experienceYears, preferredLanguage, avatarUrl } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      throw new AppError('User profile not found', 404, 'RESOURCE_NOT_FOUND');
    }

    // Only allow updating safe fields
    if (fullName) user.fullName = fullName.trim();
    if (phone) user.phone = phone.trim();
    if (jobRole) user.jobRole = jobRole.trim();
    if (experienceYears !== undefined) user.experienceYears = Number(experienceYears);
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
    user.lastActiveAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        workerId: user.workerId,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        jobRole: user.jobRole,
        experienceYears: user.experienceYears,
        preferredLanguage: user.preferredLanguage,
        avatarUrl: user.avatarUrl
      }
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400, 'VALIDATION_ERROR');
    }

    const user = await User.findById(req.userId);
    if (!user) {
      throw new AppError('User not found', 404, 'RESOURCE_NOT_FOUND');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new AppError('Current password is incorrect', 400, 'INVALID_CREDENTIALS');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Revoke all sessions for security
    await revokeAllUserSessions(user.id);

    await logAudit(
      req,
      AUDIT_ACTIONS.PASSWORD_RESET,
      'User',
      user.id,
      { workerId: user.workerId }
    );

    res.status(200).json({
      success: true,
      message: 'Password changed successfully. All active sessions have been terminated. Please login again.'
    });
  } catch (error) {
    next(error);
  }
};
