import crypto from 'crypto';
import mongoose from 'mongoose';
import { Certificate, ICertificate } from '../models/Certificate';
import { User } from '../models/User';
import { TrainingModule } from '../models/TrainingModule';
import { Organization } from '../models/Organization';
import { config } from '../config';
import { CERTIFICATE_STATUS, CertificateVerificationResult } from '@parishak/shared';
import { AppError } from '../utils/appError';

export const generateUniqueCertificateId = (): string => {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `PRS-CERT-${year}-${randomHex}`;
};

export const generateVerificationToken = (
  certificateId: string,
  userId: string,
  moduleId: string
): string => {
  const data = `${certificateId}:${userId}:${moduleId}:${Date.now()}:${crypto.randomBytes(16).toString('hex')}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

export const issueCertificate = async ({
  userId,
  moduleId,
  assessmentAttemptId,
  score
}: {
  userId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  assessmentAttemptId: mongoose.Types.ObjectId;
  score: number;
}): Promise<ICertificate> => {
  // 1. Idempotency check: if certificate already generated for this attempt, return it
  const existingForAttempt = await Certificate.findOne({ assessmentAttemptId });
  if (existingForAttempt) {
    return existingForAttempt;
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found for certificate issuance', 404);

  const moduleDoc = await TrainingModule.findById(moduleId);
  if (!moduleDoc) throw new AppError('Module not found for certificate issuance', 404);

  const org = await Organization.findById(user.organizationId);
  const organizationName = org ? org.name : 'PARIKSHAK Safety Network';

  // Revoke previous valid certificate for the same module and user if re-qualifying
  await Certificate.updateMany(
    { userId, moduleId, status: CERTIFICATE_STATUS.VALID },
    { status: CERTIFICATE_STATUS.EXPIRED, revocationReason: 'Superseded by updated assessment qualification' }
  );

  const certificateId = generateUniqueCertificateId();
  const verificationToken = generateVerificationToken(
    certificateId,
    userId.toString(),
    moduleId.toString()
  );

  const issueDate = new Date();
  // Verification URL points to public verification route
  const verificationUrl = `${config.certificateBaseUrl}/${certificateId}`;

  const cert = await Certificate.create({
    certificateId,
    verificationToken,
    userId,
    organizationId: user.organizationId,
    moduleId,
    assessmentAttemptId,
    workerName: user.fullName,
    workerId: user.workerId,
    organizationName,
    moduleTitle: typeof moduleDoc.title === 'string' ? moduleDoc.title : moduleDoc.title.en,
    score,
    issueDate,
    status: CERTIFICATE_STATUS.VALID,
    adminVerified: true,
    verificationTimestamp: new Date(),
    verificationUrl
  });

  return cert;
};

export const verifyCertificateByTokenOrId = async (
  identifier: string
): Promise<CertificateVerificationResult> => {
  const trimmed = identifier ? identifier.trim() : '';
  const query = mongoose.isValidObjectId(trimmed)
    ? {
        $or: [
          { _id: trimmed },
          { verificationToken: trimmed },
          { certificateId: trimmed.toUpperCase() }
        ]
      }
    : {
        $or: [
          { verificationToken: trimmed },
          { certificateId: trimmed.toUpperCase() }
        ]
      };

  const cert = await Certificate.findOne(query);

  if (!cert) {
    return {
      status: 'NOT_FOUND',
      certificateId: identifier,
      isValid: false,
      message: 'No certificate found matching the provided verification code.'
    };
  }

  const status = cert.status;

  // Mask worker ID for public view: e.g. "WRK-****-001"
  const rawId = cert.workerId || '';
  const maskedId =
    rawId.length > 4
      ? `${rawId.substring(0, 3)}-****-${rawId.substring(rawId.length - 3)}`
      : '***';

  const isValid = status === CERTIFICATE_STATUS.VALID;
  let message = 'Certificate is authentic and currently active.';
  if (status === CERTIFICATE_STATUS.REVOKED) {
    message = `Certificate was revoked by safety administrator. Reason: ${cert.revocationReason || 'Compliance review'}`;
  } else if (status === CERTIFICATE_STATUS.EXPIRED) {
    message = 'Certificate has expired. Retraining required.';
  }

  return {
    status,
    certificateId: cert.certificateId,
    workerName: cert.workerName,
    workerIdMasked: maskedId,
    moduleTitle: cert.moduleTitle,
    organizationName: cert.organizationName,
    score: cert.score,
    issueDate: cert.issueDate.toISOString(),
    expiryDate: cert.expiryDate ? cert.expiryDate.toISOString() : undefined,
    verificationUrl: cert.verificationUrl,
    isValid,
    message
  };
};
