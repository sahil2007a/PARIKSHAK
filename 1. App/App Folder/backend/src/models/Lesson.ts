import mongoose, { Schema, Document } from 'mongoose';
import { LocalizedString } from '@parishak/shared';

export interface ILesson extends Document {
  moduleId: mongoose.Types.ObjectId;
  order: number;
  title: LocalizedString;
  description: LocalizedString;
  durationMinutes: number;
  keySafetyPoints: Array<{
    id: string;
    title: LocalizedString;
    description: LocalizedString;
    icon?: string;
  }>;
  contentBlocks: Array<{
    type: 'TEXT' | 'CALLOUT' | 'STEP' | 'SAFETY_WARNING' | 'IMAGE_EXPLANATION';
    title?: LocalizedString;
    body: LocalizedString;
    bulletPoints?: LocalizedString[];
    mediaUrl?: string;
    tag?: string;
  }>;
  checklist: string[];
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

const LessonSchema = new Schema<ILesson>(
  {
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: 'TrainingModule',
      required: true,
      index: true
    },
    order: { type: Number, required: true },
    title: { type: LocalizedStringSchema, required: true },
    description: { type: LocalizedStringSchema, required: true },
    durationMinutes: { type: Number, default: 8 },
    keySafetyPoints: [
      {
        id: { type: String, required: true },
        title: { type: LocalizedStringSchema, required: true },
        description: { type: LocalizedStringSchema, required: true },
        icon: { type: String }
      }
    ],
    contentBlocks: [
      {
        type: {
          type: String,
          enum: ['TEXT', 'CALLOUT', 'STEP', 'SAFETY_WARNING', 'IMAGE_EXPLANATION'],
          default: 'TEXT'
        },
        title: { type: LocalizedStringSchema },
        body: { type: LocalizedStringSchema, required: true },
        bulletPoints: [{ type: LocalizedStringSchema }],
        mediaUrl: { type: String },
        tag: { type: String }
      }
    ],
    checklist: [{ type: String }]
  },
  { timestamps: true }
);

LessonSchema.index({ moduleId: 1, order: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', LessonSchema);
