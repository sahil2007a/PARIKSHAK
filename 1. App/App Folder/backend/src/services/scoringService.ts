import { IAssessment, IAssessmentQuestion } from '../models/Assessment';
import { AssessmentSubmissionAnswer, CompetencyBreakdown } from '@parishak/shared';

export interface EvaluatedAnswer {
  questionId: string;
  selectedOption: string | string[];
  isCorrect: boolean;
  pointsAwarded: number;
  timeSpentSeconds: number;
}

export interface EvaluationResult {
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  competency: CompetencyBreakdown;
  evaluatedAnswers: EvaluatedAnswer[];
  recommendedRetraining: boolean;
  feedback: string;
}

export const evaluateAssessment = (
  assessment: IAssessment,
  userAnswers: AssessmentSubmissionAnswer[]
): EvaluationResult => {
  const questionMap = new Map<string, IAssessmentQuestion>();
  assessment.questions.forEach((q) => {
    questionMap.set(q.questionId, q);
  });

  let totalPoints = 0;
  let earnedPoints = 0;
  let correctCount = 0;

  const domainScores: Record<
    'knowledge' | 'recognition' | 'decisionMaking' | 'procedure' | 'safetyCompliance',
    { earned: number; total: number }
  > = {
    knowledge: { earned: 0, total: 0 },
    recognition: { earned: 0, total: 0 },
    decisionMaking: { earned: 0, total: 0 },
    procedure: { earned: 0, total: 0 },
    safetyCompliance: { earned: 0, total: 0 }
  };

  const userAnswersMap = new Map<string, AssessmentSubmissionAnswer>();
  userAnswers.forEach((a) => userAnswersMap.set(a.questionId, a));

  const evaluatedAnswers: EvaluatedAnswer[] = [];

  for (const question of assessment.questions) {
    const qWeight = question.weight || 10;
    totalPoints += qWeight;

    const domain = question.competencyDomain || 'knowledge';
    domainScores[domain].total += qWeight;

    const submitted = userAnswersMap.get(question.questionId);
    let isCorrect = false;

    if (submitted) {
      if (Array.isArray(question.correctAnswer) && Array.isArray(submitted.selectedOption)) {
        // Sequence or multi-select equality check
        isCorrect =
          question.correctAnswer.length === submitted.selectedOption.length &&
          question.correctAnswer.every((val, idx) => val === submitted.selectedOption[idx]);
      } else {
        isCorrect = String(submitted.selectedOption) === String(question.correctAnswer);
      }
    }

    const pointsAwarded = isCorrect ? qWeight : 0;
    earnedPoints += pointsAwarded;
    domainScores[domain].earned += pointsAwarded;

    if (isCorrect) {
      correctCount++;
    }

    evaluatedAnswers.push({
      questionId: question.questionId,
      selectedOption: submitted ? submitted.selectedOption : '',
      isCorrect,
      pointsAwarded,
      timeSpentSeconds: submitted ? submitted.timeSpentSeconds : 0
    });
  }

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = percentage >= assessment.passingScore;

  const calculateDomainPercentage = (domain: keyof typeof domainScores): number => {
    const { earned, total } = domainScores[domain];
    return total > 0 ? Math.round((earned / total) * 100) : 100;
  };

  const competency: CompetencyBreakdown = {
    knowledge: calculateDomainPercentage('knowledge'),
    recognition: calculateDomainPercentage('recognition'),
    decisionMaking: calculateDomainPercentage('decisionMaking'),
    procedure: calculateDomainPercentage('procedure'),
    safetyCompliance: calculateDomainPercentage('safetyCompliance'),
    overall: percentage
  };

  let feedback = 'Excellent performance! You demonstrated strong mastery of safety procedures.';
  if (!passed) {
    feedback = `Score of ${percentage}% is below the required ${assessment.passingScore}% passing threshold. Retraining on key procedures recommended.`;
  } else if (percentage < 85) {
    feedback = 'Assessment passed successfully. Review minor procedural details to ensure continuous safety excellence.';
  }

  return {
    score: earnedPoints,
    totalPoints,
    percentage,
    passed,
    passingScore: assessment.passingScore,
    correctAnswersCount: correctCount,
    totalQuestionsCount: assessment.questions.length,
    competency,
    evaluatedAnswers,
    recommendedRetraining: !passed,
    feedback
  };
};
