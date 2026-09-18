import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  moduleId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  answers: Array<{
    questionId: string;
    selectedOption: string | string[];
    isCorrect: boolean;
    pointsAwarded: number;
    timeSpentSeconds: number;
  }>;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  competency: {
    knowledge: number;
    recognition: number;
    decisionMaking: number;
    procedure: number;
    safetyCompliance: number;
    overall: number;
  };
  timeSpentTotalSeconds: number;
  idempotencyKey: string;
  isOfflineSubmission: boolean;
  offlineCompletedAt?: Date;
  certificateId?: mongoose.Types.ObjectId;
  arTelemetry?: {
    arModeCompleted: boolean;
    totalDurationSeconds: number;
    unsafeActionsTriggered: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentAttemptSchema = new Schema<IAssessmentAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
      index: true
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'TrainingModule',
      required: true,
      index: true
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true
    },
    answers: [
      {
        questionId: { type: String, required: true },
        selectedOption: { type: Schema.Types.Mixed, required: true },
        isCorrect: { type: Boolean, required: true },
        pointsAwarded: { type: Number, default: 0 },
        timeSpentSeconds: { type: Number, default: 0 }
      }
    ],
    score: { type: Number, required: true },
    totalPoints: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true, index: true },
    passingScore: { type: Number, required: true },
    competency: {
      knowledge: { type: Number, default: 0 },
      recognition: { type: Number, default: 0 },
      decisionMaking: { type: Number, default: 0 },
      procedure: { type: Number, default: 0 },
      safetyCompliance: { type: Number, default: 0 },
      overall: { type: Number, default: 0 }
    },
    timeSpentTotalSeconds: { type: Number, default: 0 },
    idempotencyKey: { type: String, required: true, unique: true, index: true },
    isOfflineSubmission: { type: Boolean, default: false },
    offlineCompletedAt: { type: Date },
    arTelemetry: {
      arModeCompleted: { type: Boolean, default: false },
      totalDurationSeconds: { type: Number, default: 0 },
      unsafeActionsTriggered: { type: Number, default: 0 }
    },
    certificateId: {
      type: Schema.Types.ObjectId,
      ref: 'Certificate'
    }
  },
  { timestamps: true }
);

AssessmentAttemptSchema.index({ userId: 1, moduleId: 1, createdAt: -1 });

export const AssessmentAttempt = mongoose.model<IAssessmentAttempt>('AssessmentAttempt', AssessmentAttemptSchema);
