import {
  ScenarioDefinition,
  ScenarioSessionState,
  UserScenarioAction,
  CompetencyBreakdown,
  ScenarioStep
} from '@parishak/shared';

export interface ActionValidationResult {
  isSafeAction: boolean;
  pointsAwarded: number;
  feedbackMessage: string;
  isStepCompleted: boolean;
}

export interface TrainingExperienceEngine {
  loadScenario(moduleId: string): Promise<ScenarioDefinition>;
  startScenario(scenarioId: string): Promise<ScenarioSessionState>;
  recordAction(actionId: string, timeSpentSeconds: number): Promise<ActionValidationResult>;
  getCurrentStep(): ScenarioStep | null;
  getCurrentState(): ScenarioSessionState;
  completeScenario(): Promise<ScenarioSessionState>;
  getScore(): { score: number; competency: CompetencyBreakdown };
}
