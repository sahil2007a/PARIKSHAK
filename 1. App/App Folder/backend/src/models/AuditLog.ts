import mongoose, { Schema, Document } from 'mongoose';
import { AuditAction, AUDIT_ACTIONS } from '@parishak/shared';

export interface IAuditLog extends Document {
  userId?: mongoose.Types.ObjectId;
  userWorkerId?: string;
  userRole?: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    userWorkerId: { type: String },
    userRole: { type: String },
    action: {
      type: String,
      enum: Object.values(AUDIT_ACTIONS),
      required: true,
      index: true
    },
    entity: { type: String, required: true, index: true },
    entityId: { type: String, required: true },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
