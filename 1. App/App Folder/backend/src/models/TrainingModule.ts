import mongoose, { Schema, Document } from 'mongoose';
import {
  SectorType,
  SECTORS,
  ModuleCategory,
  MODULE_CATEGORIES,
  DifficultyLevel,
  DIFFICULTY_LEVELS,
  LocalizedString
} from '@parishak/shared';

export interface ITrainingModule extends Document {
  moduleNumber: number;
  title: LocalizedString;
  description: LocalizedString;
  sector: SectorType;
  category: ModuleCategory;
  estimatedDurationMinutes: number;
  difficulty: DifficultyLevel;
  iconName: string;
  thumbnailUrl: string;
  isPublished: boolean;
  lessonsCount: number;
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const LocalizedStringSchema = new Schema(
  {
    en: { type: String, required: true },
    hi: { type: String, default: '' },
    sat: { type: String, default: '' }
  },
  { _id: false }
);

const TrainingModuleSchema = new Schema<ITrainingModule>(
  {
    moduleNumber: { type: Number, required: true, unique: true, index: true },
    title: { type: LocalizedStringSchema, required: true },
    description: { type: LocalizedStringSchema, required: true },
    sector: {
      type: String,
      enum: Object.values(SECTORS),
      required: true,
      default: SECTORS.GENERAL,
      index: true
    },
    category: {
      type: String,
      enum: Object.values(MODULE_CATEGORIES),
      required: true,
      index: true
    },
    estimatedDurationMinutes: { type: Number, default: 25 },
    difficulty: {
      type: String,
      enum: Object.values(DIFFICULTY_LEVELS),
      default: DIFFICULTY_LEVELS.BEGINNER
    },
    iconName: { type: String, default: 'shield-alert' },
    thumbnailUrl: { type: String, default: '' },
    isPublished: { type: Boolean, default: true, index: true },
    lessonsCount: { type: Number, default: 0 },
    passingScore: { type: Number, default: 70 }
  },
  { timestamps: true }
);

export const TrainingModule = mongoose.model<ITrainingModule>('TrainingModule', TrainingModuleSchema);
