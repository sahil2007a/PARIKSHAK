import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { PendingRegistration, IPendingRegistration } from '../models/PendingRegistration';
import { User, IUser } from '../models/User';
import { Organization } from '../models/Organization';
import { generateSecureOTP, hashOTP, verifyOTPHash } from './otp.service';
import { sendVerificationEmail } from './email.service';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';
import { SECTORS, USER_ROLES, USER_STATUS, AUDIT_ACTIONS } from '@parishak/shared';
import { logAudit } from '../middleware/auditLogger';
import { AuthRequest } from '../middleware/auth';
import { createSessionAndTokens } from './authService';

export interface RegisterInput {
  fullName: string;
  workerId: string;
  phone: string;
  email?: string;
  password: string;
  organizationName: string;
  sector?: string;
  jobRole: string;
  experienceYears?: number;
  preferredLanguage?: 'en' | 'hi' | 'sat';
}

export interface VerifyRegistrationInput {
  registrationId?: string;
  workerId?: string;
  otp: string;
}

export interface VerificationResult {
  user: {
    id: string;
    workerId: string;
    fullName: string;
    phone: string;
    email?: string;
    organizationId: string;
    organizationName: string;
    sector: string;
    jobRole: string;
    experienceYears: number;
    preferredLanguage: string;
    role: string;
    status: string;
    createdAt: string;
  };
  tokens?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}

/**
 * Register a new worker in staging PendingRegistration collection and dispatch OTP
 */
export const initiateRegistration = async (
  input: RegisterInput
): Promise<{ registrationId: string; workerId: string; expiresInSeconds: number; destination: string }> => {
  const normalizedWorkerId = input.workerId.trim().toUpperCase();
  const normalizedEmail = input.email ? input.email.trim().toLowerCase() : undefined;
  const normalizedPhone = input.phone.trim();

  // 1. Check duplicate active user
  const existingUserWorker = await User.findOne({ workerId: normalizedWorkerId });
  if (existingUserWorker) {
    throw new AppError('Worker ID is already registered in the system', 409, 'WORKER_ID_ALREADY_EXISTS');
  }

  if (normalizedEmail) {
    const existingUserEmail = await User.findOne({ email: normalizedEmail });
    if (existingUserEmail) {
      throw new AppError('Email address is already in use', 409, 'EMAIL_ALREADY_EXISTS');
    }
  }

  const existingUserPhone = await User.findOne({ phone: normalizedPhone });
  if (existingUserPhone) {
    throw new AppError('Phone number is already associated with an account', 409, 'PHONE_ALREADY_EXISTS');
  }

  // 2. Clear any existing pending registration for this workerId/email
  await PendingRegistration.deleteMany({
    $or: [
      { workerId: normalizedWorkerId },
      ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
      { phone: normalizedPhone }
    ]
  });

  // 3. Find or stage organization
  let org = await Organization.findOne({
    name: new RegExp(`^${input.organizationName.trim()}$`, 'i')
  });
  if (!org) {
    const orgCode =
      input.organizationName.substring(0, 4).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
    org = await Organization.create({
      name: input.organizationName.trim(),
      code: orgCode,
      sector: input.sector || SECTORS.GENERAL,
      contactEmail: normalizedEmail || 'contact@org.safety',
      activeWorkersCount: 0
    });
  }

  // 4. Hash password and generate secure OTP
  const passwordHash = await bcrypt.hash(input.password, 10);
  const rawOtp = generateSecureOTP();
  const otpHash = hashOTP(rawOtp);
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // 5. Store in PendingRegistration (User is NOT created yet)
  const pending = await PendingRegistration.create({
    fullName: input.fullName.trim(),
    workerId: normalizedWorkerId,
    email: normalizedEmail,
    phone: normalizedPhone,
    passwordHash,
    organizationId: org._id,
    organizationName: org.name,
    sector: input.sector || SECTORS.GENERAL,
    jobRole: input.jobRole.trim(),
    experienceYears: input.experienceYears || 0,
    preferredLanguage: input.preferredLanguage || 'en',
    verificationChannel: normalizedEmail ? 'EMAIL' : 'SMS',
    otpHash,
    otpExpiresAt,
    otpAttempts: 0,
    maxOtpAttempts: 3,
    resendCount: 0,
    status: 'PENDING'
  });

  // 6. Dispatch OTP to worker
  if (normalizedEmail) {
    await sendVerificationEmail(normalizedEmail, input.fullName, rawOtp);
  } else {
    logger.info(`[SMS STUB] Verification OTP for ${normalizedPhone} (${normalizedWorkerId}): ${rawOtp}`);
  }

  return {
    registrationId: pending.id,
    workerId: pending.workerId,
    expiresInSeconds: 600,
    destination: normalizedEmail ? normalizedEmail : `${normalizedPhone.substring(0, 4)}****${normalizedPhone.slice(-2)}`
  };
};

/**
 * Direct Worker Registration creating User with status PENDING (Awaiting Admin Approval)
 */
export const registerWorkerDirect = async (
  input: RegisterInput,
  reqContext?: AuthRequest
): Promise<{ user: any; message: string }> => {
  const normalizedWorkerId = input.workerId.trim().toUpperCase();
  const normalizedEmail = input.email ? input.email.trim().toLowerCase() : undefined;
  const normalizedPhone = input.phone.trim();

  // 1. Check duplicate active user
  const existingUserWorker = await User.findOne({ workerId: normalizedWorkerId });
  if (existingUserWorker) {
    throw new AppError('Worker ID is already registered in the system', 409, 'WORKER_ID_ALREADY_EXISTS');
  }

  if (normalizedEmail) {
    const existingUserEmail = await User.findOne({ email: normalizedEmail });
    if (existingUserEmail) {
      throw new AppError('Email address is already in use', 409, 'EMAIL_ALREADY_EXISTS');
    }
  }

  const existingUserPhone = await User.findOne({ phone: normalizedPhone });
  if (existingUserPhone) {
    throw new AppError('Phone number is already associated with an account', 409, 'PHONE_ALREADY_EXISTS');
  }

  // 2. Find or create Organization
  let org = await Organization.findOne({
    name: new RegExp(`^${input.organizationName.trim()}$`, 'i')
  });
  if (!org) {
    const orgCode =
      input.organizationName.substring(0, 4).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);
    org = await Organization.create({
      name: input.organizationName.trim(),
      code: orgCode,
      sector: input.sector || SECTORS.GENERAL,
      contactEmail: normalizedEmail || 'contact@org.safety',
      activeWorkersCount: 0
    });
  }

  // 3. Hash password
  const passwordHash = await bcrypt.hash(input.password, 10);

  // 4. Create User with PENDING status (Awaiting Administrator Approval)
  const newUser = await User.create({
    workerId: normalizedWorkerId,
    fullName: input.fullName.trim(),
    phone: normalizedPhone,
    email: normalizedEmail,
    passwordHash,
    organizationId: org._id,
    sector: input.sector || SECTORS.GENERAL,
    jobRole: input.jobRole.trim(),
    experienceYears: input.experienceYears || 0,
    preferredLanguage: input.preferredLanguage || 'en',
    role: USER_ROLES.WORKER,
    status: USER_STATUS.PENDING, // PENDING ADMIN APPROVAL
    isEmailVerified: Boolean(normalizedEmail),
    isPhoneVerified: Boolean(normalizedPhone)
  });

  // Audit log
  if (reqContext) {
    await logAudit(
      { user: newUser, headers: reqContext.headers, socket: reqContext.socket } as unknown as AuthRequest,
      AUDIT_ACTIONS.USER_REGISTER,
      'User',
      newUser.id,
      { workerId: newUser.workerId, status: USER_STATUS.PENDING }
    );
  }

  return {
    user: {
      id: newUser.id,
      workerId: newUser.workerId,
      fullName: newUser.fullName,
      phone: newUser.phone,
      email: newUser.email,
      organizationName: org.name,
      sector: newUser.sector,
      jobRole: newUser.jobRole,
      status: newUser.status,
      createdAt: newUser.createdAt.toISOString()
    },
    message: 'Registration submitted successfully! Your account is pending administrator approval before login.'
  };
};

/**
 * Verify OTP from PendingRegistration and create User with status PENDING (Awaiting Admin Approval)
 */
export const verifyRegistration = async (
  input: VerifyRegistrationInput,
  reqContext?: AuthRequest
): Promise<VerificationResult> => {
  if (!input.otp) {
    throw new AppError('Verification code is required', 400, 'OTP_REQUIRED');
  }

  const query = input.registrationId
    ? { _id: input.registrationId }
    : { workerId: input.workerId?.toUpperCase() };

  const pending = await PendingRegistration.findOne(query);
  if (!pending) {
    throw new AppError(
      'Registration session not found or expired. Please submit registration again.',
      404,
      'REGISTRATION_NOT_FOUND'
    );
  }

  if (pending.status === 'BLOCKED') {
    throw new AppError(
      'Registration blocked due to too many incorrect OTP attempts. Please register again.',
      429,
      'OTP_TOO_MANY_ATTEMPTS'
    );
  }

  if (new Date() > pending.otpExpiresAt) {
    pending.status = 'EXPIRED';
    await pending.save();
    throw new AppError('Verification code has expired. Please request a new code.', 400, 'OTP_EXPIRED');
  }

  // Verify candidate OTP
  const isMatch = verifyOTPHash(input.otp, pending.otpHash);
  if (!isMatch) {
    pending.otpAttempts += 1;
    if (pending.otpAttempts >= pending.maxOtpAttempts) {
      pending.status = 'BLOCKED';
    }
    await pending.save();

    const remaining = pending.maxOtpAttempts - pending.otpAttempts;
    throw new AppError(
      `Invalid verification code. ${remaining > 0 ? `${remaining} attempts remaining.` : 'Account blocked.'}`,
      400,
      'OTP_INVALID'
    );
  }

  // OTP verified! Create real User in MongoDB with PENDING status (Requires Admin Approval)
  const newUser = await User.create({
    workerId: pending.workerId,
    fullName: pending.fullName,
    phone: pending.phone,
    email: pending.email,
    passwordHash: pending.passwordHash,
    organizationId: pending.organizationId,
    sector: pending.sector,
    jobRole: pending.jobRole,
    experienceYears: pending.experienceYears,
    preferredLanguage: pending.preferredLanguage,
    role: USER_ROLES.WORKER,
    status: USER_STATUS.PENDING, // PENDING ADMIN APPROVAL
    isEmailVerified: Boolean(pending.email),
    isPhoneVerified: Boolean(pending.phone)
  });

  // Delete pending registration record to prevent replay
  await PendingRegistration.findByIdAndDelete(pending._id);

  // Audit log
  if (reqContext) {
    await logAudit(
      { user: newUser, headers: reqContext.headers, socket: reqContext.socket } as unknown as AuthRequest,
      AUDIT_ACTIONS.USER_REGISTER,
      'User',
      newUser.id,
      { workerId: newUser.workerId, status: USER_STATUS.PENDING }
    );
  }

  return {
    user: {
      id: newUser.id,
      workerId: newUser.workerId,
      fullName: newUser.fullName,
      phone: newUser.phone,
      email: newUser.email,
      organizationId: pending.organizationId?.toString() || '',
      organizationName: pending.organizationName,
      sector: newUser.sector,
      jobRole: newUser.jobRole,
      experienceYears: newUser.experienceYears,
      preferredLanguage: newUser.preferredLanguage,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt.toISOString()
    }
  };
};

/**
 * Resend OTP to worker with rate-limit cooldown
 */
export const resendVerificationOTP = async (
  identifier: string
): Promise<{ message: string; expiresInSeconds: number }> => {
  const normalized = identifier.trim();
  const isEmail = normalized.includes('@');
  const query = isEmail ? { email: normalized.toLowerCase() } : { workerId: normalized.toUpperCase() };

  const pending = await PendingRegistration.findOne(query);
  if (!pending) {
    throw new AppError('No pending registration found for this identifier.', 404, 'REGISTRATION_NOT_FOUND');
  }

  // 60-second cooldown check
  const timeSinceLastUpdated = (Date.now() - pending.updatedAt.getTime()) / 1000;
  if (timeSinceLastUpdated < 60) {
    const wait = Math.ceil(60 - timeSinceLastUpdated);
    throw new AppError(`Please wait ${wait} seconds before requesting a new code.`, 429, 'OTP_COOLDOWN');
  }

  const rawOtp = generateSecureOTP();
  pending.otpHash = hashOTP(rawOtp);
  pending.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  pending.otpAttempts = 0;
  pending.resendCount += 1;
  pending.status = 'PENDING';
  await pending.save();

  if (pending.email) {
    await sendVerificationEmail(pending.email, pending.fullName, rawOtp);
  } else {
    logger.info(`[SMS STUB RESEND] Verification OTP for ${pending.phone} (${pending.workerId}): ${rawOtp}`);
  }

  return {
    message: `A new verification code has been dispatched.`,
    expiresInSeconds: 600
  };
};
