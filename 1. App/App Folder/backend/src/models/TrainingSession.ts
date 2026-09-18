import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainingSession extends Document {
  userId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  lessonId?: string;
  sessionId?: string;
  scenarioId?: string;
  sessionType: 'LESSON' | 'SCENARIO' | 'DRILL';
  durationSeconds: number;
  interactionsCount: number;
  fireDetected?: boolean;
  fireExtinguished?: boolean;
  score?: number;
  passAccuracy?: number;
  extinguisherType?: string;
  metadata?: Record<string, any>;
  completed: boolean;
  startedAt: Date;
  endedAt?: Date;
}

const TrainingSessionSchema = new Schema<ITrainingSession>(
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
    lessonId: { type: String },
    sessionId: { type: String, index: true },
    scenarioId: { type: String },
    sessionType: {
      type: String,
      enum: ['LESSON', 'SCENARIO', 'DRILL'],
      default: 'LESSON'
    },
    durationSeconds: { type: Number, default: 0 },
    interactionsCount: { type: Number, default: 0 },
    fireDetected: { type: Boolean, default: false },
    fireExtinguished: { type: Boolean, default: false },
    score: { type: Number, default: 100 },
    passAccuracy: { type: Number, default: 100 },
    extinguisherType: { type: String },
    metadata: { type: Schema.Types.Mixed },
    completed: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date }
  },
  { timestamps: true }
);

export const TrainingSession = mongoose.model<ITrainingSession>(
  'TrainingSession',
  TrainingSessionSchema
);
