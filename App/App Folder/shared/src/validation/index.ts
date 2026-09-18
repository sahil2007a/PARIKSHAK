import { z } from 'zod';
import {
  SECTORS,
  USER_ROLES,
  USER_STATUS,
  MODULE_CATEGORIES,
  DIFFICULTY_LEVELS,
  QUESTION_TYPES,
  CERTIFICATE_STATUS,
  SUPPORTED_LANGUAGES
} from '../constants';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  workerId: z.string().min(3, 'Worker ID must be at least 3 characters').toUpperCase(),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  organizationName: z.string().min(2, 'Organization name is required'),
  sector: z.enum([
    SECTORS.MINING,
    SECTORS.STEEL,
    SECTORS.MICA,
    SECTORS.CONSTRUCTION,
    SECTORS.MANUFACTURING,
    SECTORS.GENERAL
  ]),
  jobRole: z.string().min(2, 'Job role is required'),
  experienceYears: z.number().min(0).max(60).default(0),
  preferredLanguage: z.enum(SUPPORTED_LANGUAGES).default('en')
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(3, 'Worker ID or Email is required'),
  password: z.string().min(1, 'Password is required')
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(3, 'Worker ID or Email is required')
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
  email: z.string().email().optional().or(z.literal('')),
  jobRole: z.string().min(2).optional(),
  experienceYears: z.number().min(0).max(60).optional(),
  preferredLanguage: z.enum(SUPPORTED_LANGUAGES).optional()
});

export const assessmentAnswerSchema = z.object({
  questionId: z.string().min(1),
  selectedOption: z.union([z.string(), z.array(z.string())]),
  timeSpentSeconds: z.number().min(0).default(0)
});

export const assessmentSubmissionSchema = z.object({
  assessmentId: z.string().min(1),
  moduleId: z.string().min(1),
  answers: z.array(assessmentAnswerSchema),
  timeSpentTotalSeconds: z.number().min(0),
  idempotencyKey: z.string().min(1),
  offlineCompletedAt: z.string().optional()
});
export type AssessmentSubmissionInput = z.infer<typeof assessmentSubmissionSchema>;

export const syncQueueSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      type: z.enum(['ASSESSMENT_ATTEMPT', 'SCENARIO_PRACTICE', 'LESSON_PROGRESS']),
      payload: z.record(z.any()),
      idempotencyKey: z.string(),
      createdAt: z.string(),
      retryCount: z.number().default(0)
    })
  )
});
export type SyncQueueInput = z.infer<typeof syncQueueSchema>;

export const moduleCreateSchema = z.object({
  moduleNumber: z.number().int().positive(),
  title: z.union([
    z.string().min(3),
    z.object({
      en: z.string().min(3),
      hi: z.string().optional(),
      sat: z.string().optional()
    })
  ]),
  description: z.union([
    z.string().min(5),
    z.object({
      en: z.string().min(5),
      hi: z.string().optional(),
      sat: z.string().optional()
    })
  ]),
  sector: z.enum([
    SECTORS.MINING,
    SECTORS.STEEL,
    SECTORS.MICA,
    SECTORS.CONSTRUCTION,
    SECTORS.MANUFACTURING,
    SECTORS.GENERAL
  ]),
  category: z.enum([
    MODULE_CATEGORIES.ALL,
    MODULE_CATEGORIES.FIRE_SAFETY,
    MODULE_CATEGORIES.GAS_SAFETY,
    MODULE_CATEGORIES.MACHINERY,
    MODULE_CATEGORIES.PPE,
    MODULE_CATEGORIES.EMERGENCY
  ]),
  estimatedDurationMinutes: z.number().int().positive(),
  difficulty: z.enum([
    DIFFICULTY_LEVELS.BEGINNER,
    DIFFICULTY_LEVELS.INTERMEDIATE,
    DIFFICULTY_LEVELS.ADVANCED
  ]),
  isPublished: z.boolean().default(true)
});

export const certificateRevokeSchema = z.object({
  reason: z.string().min(3, 'Revocation reason is required')
});
