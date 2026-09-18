import mongoose, { Schema, Document } from 'mongoose';
import { SectorType, SECTORS, SupportedLanguage, SUPPORTED_LANGUAGES } from '@parishak/shared';

export interface IPendingRegistration extends Document {
  fullName: string;
  workerId: string;
  email?: string;
  phone: string;
  passwordHash: string;
  organizationId?: mongoose.Types.ObjectId;
  organizationName: string;
  sector: SectorType;
  jobRole: string;
  experienceYears: number;
  preferredLanguage: SupportedLanguage;
  verificationChannel: 'EMAIL' | 'SMS';
  otpHash: string;
  otpExpiresAt: Date;
  otpAttempts: number;
  maxOtpAttempts: number;
  resendCount: number;
  lastResentAt?: Date;
  status: 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'BLOCKED';
  createdAt: Date;
  updatedAt: Date;
  verifiedAt?: Date;
}

const PendingRegistrationSchema = new Schema<IPendingRegistration>(
  {
    fullName: { type: String, required: true, trim: true },
    workerId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      index: true
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    passwordHash: { type: String, required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization'
    },
    organizationName: { type: String, required: true, trim: true },
    sector: {
      type: String,
      enum: Object.values(SECTORS),
      required: true,
      default: SECTORS.GENERAL
    },
    jobRole: { type: String, required: true, trim: true },
    experienceYears: { type: Number, default: 0 },
    preferredLanguage: {
      type: String,
      enum: SUPPORTED_LANGUAGES,
      default: 'en'
    },
    verificationChannel: {
      type: String,
      enum: ['EMAIL', 'SMS'],
      default: 'EMAIL'
    },
    otpHash: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true, index: true },
    otpAttempts: { type: Number, default: 0 },
    maxOtpAttempts: { type: Number, default: 3 },
    resendCount: { type: Number, default: 0 },
    lastResentAt: { type: Date },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'EXPIRED', 'BLOCKED'],
      default: 'PENDING',
      index: true
    },
    verifiedAt: { type: Date }
  },
  { timestamps: true }
);

export const PendingRegistration = mongoose.model<IPendingRegistration>(
  'PendingRegistration',
  PendingRegistrationSchema
);
