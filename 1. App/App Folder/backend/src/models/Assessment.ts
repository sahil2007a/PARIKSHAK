import mongoose, { Schema, Document } from 'mongoose';
import {
  QuestionType,
  QUESTION_TYPES,
  DifficultyLevel,
  DIFFICULTY_LEVELS,
  LocalizedString
} from '@parishak/shared';

export interface IAssessmentQuestion {
  questionId: string;
  type: QuestionType;
  question: LocalizedString;
  imageUrl?: string;
  options: Array<{
    id: string;
    text: LocalizedString;
    imageUrl?: string;
    isCorrect?: boolean;
  }>;
  correctAnswer: string | string[];
  explanation: LocalizedString;
  difficulty: DifficultyLevel;
  competencyDomain: 'knowledge' | 'recognition' | 'decisionMaking' | 'procedure' | 'safetyCompliance';
  weight: number;
  timeLimitSeconds: number;
}

export interface IAssessment extends Document {
  moduleId: mongoose.Types.ObjectId;
  title: LocalizedString;
  passingScore: number;
  attemptLimit: number;
  timeLimitMinutes: number;
  questions: IAssessmentQuestion[];
  isPublished: boolean;
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

const AssessmentQuestionSchema = new Schema(
  {
    questionId: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(QUESTION_TYPES),
      default: QUESTION_TYPES.MCQ
    },
    question: { type: LocalizedStringSchema, required: true },
    imageUrl: { type: String },
    options: [
      {
        id: { type: String, required: true },
        text: { type: LocalizedStringSchema, required: true },
        imageUrl: { type: String },
        isCorrect: { type: Boolean }
      }
    ],
    correctAnswer: { type: Schema.Types.Mixed, required: true },
    explanation: { type: LocalizedStringSchema, required: true },
    difficulty: {
      type: String,
      enum: Object.values(DIFFICULTY_LEVELS),
      default: DIFFICULTY_LEVELS.INTERMEDIATE
    },
    competencyDomain: {
      type: String,
      enum: ['knowledge', 'recognition', 'decisionMaking', 'procedure', 'safetyCompliance'],
      default: 'knowledge'
    },
    weight: { type: Number, default: 10 },
    timeLimitSeconds: { type: Number, default: 60 }
  },
  { _id: false }
);

const AssessmentSchema = new Schema<IAssessment>(
  {
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'TrainingModule',
      required: true,
      unique: true,
      index: true
    },
    title: { type: LocalizedStringSchema, required: true },
    passingScore: { type: Number, default: 70 },
    attemptLimit: { type: Number, default: 3 },
    timeLimitMinutes: { type: Number, default: 15 },
    questions: [AssessmentQuestionSchema],
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
