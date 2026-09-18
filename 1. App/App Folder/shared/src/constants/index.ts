// Color Palette and Brand
export const BRAND_COLORS = {
  primary: '#16A085',
  primaryDark: '#0E6655',
  primaryLight: '#E8F8F5',
  darkText: '#14213D',
  background: '#F5F8F7',
  white: '#FFFFFF',
  mutedText: '#7A8793',
  border: '#E1E8E6',
  danger: '#E74C3C',
  dangerLight: '#FDEDEC',
  warning: '#F39C12',
  warningLight: '#FEF9E7',
  success: '#27AE60',
  successLight: '#EAFAF1',
  cardShadow: 'rgba(20, 33, 61, 0.08)'
} as const;

export const SECTORS = {
  MINING: 'MINING',
  STEEL: 'STEEL',
  MICA: 'MICA',
  CONSTRUCTION: 'CONSTRUCTION',
  MANUFACTURING: 'MANUFACTURING',
  GENERAL: 'GENERAL'
} as const;
export type SectorType = typeof SECTORS[keyof typeof SECTORS];

export const USER_ROLES = {
  WORKER: 'WORKER',
  SUPERVISOR: 'SUPERVISOR',
  ADMIN: 'ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
} as const;
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const USER_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  DEACTIVATED: 'DEACTIVATED'
} as const;
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];

export const MODULE_CATEGORIES = {
  ALL: 'ALL',
  FIRE_SAFETY: 'FIRE_SAFETY',
  GAS_SAFETY: 'GAS_SAFETY',
  MACHINERY: 'MACHINERY',
  PPE: 'PPE',
  EMERGENCY: 'EMERGENCY'
} as const;
export type ModuleCategory = typeof MODULE_CATEGORIES[keyof typeof MODULE_CATEGORIES];

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED'
} as const;
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[keyof typeof DIFFICULTY_LEVELS];

export const QUESTION_TYPES = {
  MCQ: 'MCQ',
  IMAGE_SELECTION: 'IMAGE_SELECTION',
  SEQUENCE_ORDERING: 'SEQUENCE_ORDERING',
  TRUE_FALSE: 'TRUE_FALSE',
  SCENARIO_DECISION: 'SCENARIO_DECISION',
  OBJECT_SELECTION: 'OBJECT_SELECTION',
  PROCEDURE_ORDERING: 'PROCEDURE_ORDERING'
} as const;
export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];

export const CERTIFICATE_STATUS = {
  VALID: 'VALID',
  EXPIRED: 'EXPIRED',
  REVOKED: 'REVOKED'
} as const;
export type CertificateStatus = typeof CERTIFICATE_STATUS[keyof typeof CERTIFICATE_STATUS];

export const NOTIFICATION_TYPES = {
  TRAINING_REMINDER: 'TRAINING_REMINDER',
  CERTIFICATE_EXPIRY: 'CERTIFICATE_EXPIRY',
  CERTIFICATE_ISSUED: 'CERTIFICATE_ISSUED',
  ASSESSMENT_RESULT: 'ASSESSMENT_RESULT',
  ADMIN_MESSAGE: 'ADMIN_MESSAGE',
  SYSTEM: 'SYSTEM'
} as const;
export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

export const AUDIT_ACTIONS = {
  USER_LOGIN: 'USER_LOGIN',
  USER_REGISTER: 'USER_REGISTER',
  USER_STATUS_CHANGE: 'USER_STATUS_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  MODULE_CREATE: 'MODULE_CREATE',
  MODULE_UPDATE: 'MODULE_UPDATE',
  MODULE_DELETE: 'MODULE_DELETE',
  ASSESSMENT_SUBMIT: 'ASSESSMENT_SUBMIT',
  CERTIFICATE_GENERATE: 'CERTIFICATE_GENERATE',
  CERTIFICATE_REVOKE: 'CERTIFICATE_REVOKE',
  SYNC_EXECUTED: 'SYNC_EXECUTED'
} as const;
export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'sat'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const DEFAULT_PASSING_SCORE = 70;
export const DEFAULT_ATTEMPT_LIMIT = 3;
export const DEFAULT_EXPIRY_DAYS = 365;
