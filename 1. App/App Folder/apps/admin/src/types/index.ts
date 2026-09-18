export interface AdminUser {
  id: string;
  workerId: string;
  fullName: string;
  email: string;
  role: string;
  organizationName: string;
}

export interface DashboardStats {
  totalWorkers: number;
  activeWorkers: number;
  pendingApprovalsCount?: number;
  totalCertificates: number;
  certifiedWorkersCount: number;
  compliancePercentage: number;
  expiringCertificates: number;
  expiredCertificates: number;
  totalModules: number;
  monthlyActivity: Array<{ month: string; completions: number; certifications: number }>;
  moduleStats: Array<{
    id: string;
    moduleNumber: number;
    title: string;
    attempts: number;
    passes: number;
    certifications: number;
    passRate: number;
  }>;
}

export interface WorkerRow {
  id: string;
  workerId: string;
  fullName: string;
  phone: string;
  email?: string;
  organizationName: string;
  sector: string;
  jobRole: string;
  experienceYears: number;
  preferredLanguage: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING';
  trainingProgress: number;
  completedModulesCount: number;
  latestScore: number | null;
  certificateStatus: 'CERTIFIED' | 'PENDING';
  lastActive: string;
  createdAt: string;
}

export interface CertificateStats {
  total: number;
  valid: number;
  revoked: number;
}

export interface CertificateRow {
  id: string;
  certificateId: string;
  verificationToken: string;
  workerName: string;
  workerId: string;
  organizationName: string;
  moduleId: string;
  moduleTitle: string;
  score: number;
  issueDate: string;
  expiryDate?: string;
  status: 'VALID' | 'EXPIRED' | 'REVOKED';
  verificationUrl: string;
  qrCodeDataUrl?: string;
  revocationReason?: string;
  revokedAt?: string;
  adminVerified?: boolean;
  verificationTimestamp?: string;
}

export interface AuditLogRow {
  id: string;
  userId?: string;
  userWorkerId?: string;
  userRole?: string;
  action: string;
  entity: string;
  entityId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}
