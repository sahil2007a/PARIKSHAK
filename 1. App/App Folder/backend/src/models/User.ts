import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  UserRole,
  USER_ROLES,
  UserStatus,
  USER_STATUS,
  SectorType,
  SECTORS,
  SupportedLanguage,
  SUPPORTED_LANGUAGES
} from '@parishak/shared';

export interface IUser extends Document {
  workerId: string;
  fullName: string;
  phone: string;
  email?: string;
  passwordHash: string;
  organizationId: mongoose.Types.ObjectId;
  sector: SectorType;
  jobRole: string;
  experienceYears: number;
  preferredLanguage: SupportedLanguage;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  refreshTokenVersion: number;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLoginAt?: Date;
  lastActiveAt?: Date;
  deletedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    workerId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: { type: String, required: true },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true
    },
    sector: {
      type: String,
      enum: Object.values(SECTORS),
      required: true,
      default: SECTORS.MINING
    },
    jobRole: { type: String, required: true, trim: true },
    experienceYears: { type: Number, default: 0 },
    preferredLanguage: {
      type: String,
      enum: SUPPORTED_LANGUAGES,
      default: 'en'
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.WORKER,
      index: true
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
      index: true
    },
    avatarUrl: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    refreshTokenVersion: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    lastLoginAt: { type: Date },
    lastActiveAt: { type: Date },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

UserSchema.index({ organizationId: 1, status: 1 });

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);
