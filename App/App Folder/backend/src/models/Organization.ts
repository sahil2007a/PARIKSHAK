import mongoose, { Schema, Document } from 'mongoose';
import { SectorType, SECTORS } from '@parishak/shared';

export interface IOrganization extends Document {
  name: string;
  code: string;
  sector: SectorType;
  contactEmail: string;
  activeWorkersCount: number;
  complianceTargetPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    sector: {
      type: String,
      enum: Object.values(SECTORS),
      required: true,
      default: SECTORS.MINING
    },
    contactEmail: { type: String, required: true, trim: true },
    activeWorkersCount: { type: Number, default: 0 },
    complianceTargetPercentage: { type: Number, default: 95 }
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
