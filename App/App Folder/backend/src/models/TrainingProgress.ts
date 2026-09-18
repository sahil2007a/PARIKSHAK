import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainingProgress extends Document {
  userId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  moduleNumber: number;
  completedLessons: string[];
  progressPercentage: number;
  lastLessonId?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  score?: number;
  isCertified: boolean;
  arCompleted?: boolean;
  arCompletedAt?: Date;
  arScore?: number;
  assessmentPassed?: boolean;
  assessmentScore?: number;
  certificateId?: string;
  completedVideos?: string[];
  completedChapters?: number[];
  completedAssessments?: number[];
  completedArChapters?: number[];
  startedAt: Date;
  completedAt?: Date;
  updatedAt: Date;
}

const TrainingProgressSchema = new Schema<ITrainingProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'TrainingModule',
      required: true,
      index: true
    },
    moduleNumber: { type: Number, required: true },
    completedLessons: [{ type: String }],
    completedVideos: [{ type: String }],
    completedChapters: [{ type: Number }],
    completedAssessments: [{ type: Number }],
    completedArChapters: [{ type: Number }],
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    lastLessonId: { type: String },
    status: {
      type: String,
      enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
      default: 'NOT_STARTED',
      index: true
    },
    score: { type: Number },
    isCertified: { type: Boolean, default: false },
    arCompleted: { type: Boolean, default: false },
    arCompletedAt: { type: Date },
    arScore: { type: Number },
    assessmentPassed: { type: Boolean, default: false },
    assessmentScore: { type: Number },
    certificateId: { type: String },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

// Compound unique index per user and module
TrainingProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

export const TrainingProgress = mongoose.model<ITrainingProgress>(
  'TrainingProgress',
  TrainingProgressSchema
);
