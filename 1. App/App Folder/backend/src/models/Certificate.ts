import mongoose, { Schema, Document } from 'mongoose';
import { CertificateStatus, CERTIFICATE_STATUS } from '@parishak/shared';

export interface ICertificate extends Document {
  certificateId: string;
  verificationToken: string;
  userId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  assessmentAttemptId: mongoose.Types.ObjectId;
  workerName: string;
  workerId: string;
  organizationName: string;
  moduleTitle: string;
  score: number;
  issueDate: Date;
  expiryDate?: Date;
  status: CertificateStatus;
  verificationUrl: string;
  adminVerified?: boolean;
  verificationTimestamp?: Date;
  revocationReason?: string;
  revokedAt?: Date;
  revokedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    verificationToken: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'TrainingModule',
      required: true,
      index: true
    },
    assessmentAttemptId: {
      type: Schema.Types.ObjectId,
      ref: 'AssessmentAttempt',
      required: true
    },
    workerName: { type: String, required: true },
    workerId: { type: String, required: true, index: true },
    organizationName: { type: String, required: true },
    moduleTitle: { type: String, required: true },
    score: { type: Number, required: true },
    issueDate: { type: Date, required: true, default: Date.now },
    expiryDate: { type: Date, required: false },
    status: {
      type: String,
      enum: Object.values(CERTIFICATE_STATUS),
      default: CERTIFICATE_STATUS.VALID,
      index: true
    },
    verificationUrl: { type: String, required: true },
    adminVerified: { type: Boolean, default: true, index: true },
    verificationTimestamp: { type: Date, default: Date.now },
    revocationReason: { type: String },
    revokedAt: { type: Date },
    revokedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

CertificateSchema.index({ userId: 1, moduleId: 1, status: 1 });
CertificateSchema.index({ assessmentAttemptId: 1 }, { unique: true });

export const Certificate = mongoose.model<ICertificate>('Certificate', CertificateSchema);
