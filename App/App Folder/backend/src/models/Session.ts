import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  sessionId: string;
  userId: mongoose.Types.ObjectId;
  refreshTokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  revokedAt?: Date;
  isRevoked: boolean;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    sessionId: {
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
    refreshTokenHash: {
      type: String,
      required: true
    },
    ipAddress: { type: String },
    userAgent: { type: String },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    },
    revokedAt: { type: Date },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true
    },
    lastUsedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

SessionSchema.index({ userId: 1, isRevoked: 1 });

export const Session = mongoose.model<ISession>('Session', SessionSchema);
