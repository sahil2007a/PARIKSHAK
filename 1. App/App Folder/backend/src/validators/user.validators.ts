import { z } from 'zod';
import { SUPPORTED_LANGUAGES } from '@parishak/shared';

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().min(8).max(20).optional(),
  jobRole: z.string().min(2).max(100).optional(),
  experienceYears: z.number().min(0).max(60).optional(),
  preferredLanguage: z.enum(['en', 'hi', 'sat'] as const).optional(),
  avatarUrl: z.string().url().optional().or(z.literal(''))
});
