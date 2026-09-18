import { z } from 'zod';
import { SECTORS, SUPPORTED_LANGUAGES } from '@parishak/shared';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  workerId: z.string().min(3, 'Worker ID must be at least 3 characters').max(30),
  phone: z.string().min(8, 'Phone number must be at least 8 characters').max(20),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100),
  organizationName: z.string().min(2, 'Organization name is required').max(150),
  sector: z.enum([SECTORS.MINING, SECTORS.STEEL, SECTORS.MICA, SECTORS.GENERAL]).optional(),
  jobRole: z.string().min(2, 'Job role is required').max(100),
  experienceYears: z.number().min(0).max(60).optional(),
  preferredLanguage: z.enum(['en', 'hi', 'sat'] as const).optional()
});

export const verifyRegistrationSchema = z.object({
  registrationId: z.string().optional(),
  workerId: z.string().optional(),
  otp: z.string().length(6, 'Verification code must be exactly 6 digits')
}).refine((data) => data.registrationId || data.workerId, {
  message: 'Either registrationId or workerId must be provided'
});

export const resendVerificationSchema = z.object({
  identifier: z.string().min(3, 'Worker ID or Email is required')
});

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Worker ID, Phone, or Email is required'),
  password: z.string().min(1, 'Password is required')
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required')
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(3, 'Worker ID or Email is required')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters')
});
