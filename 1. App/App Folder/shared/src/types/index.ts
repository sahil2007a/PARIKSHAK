import {
  SectorType,
  UserRole,
  UserStatus,
  ModuleCategory,
  DifficultyLevel,
  QuestionType,
  CertificateStatus,
  NotificationType,
  AuditAction,
  SupportedLanguage
} from '../constants';

export interface UserProfile {
  id: string;
  workerId: string;
  fullName: string;
  phone: string;
  email?: string;
  organizationId: string;
  organizationName?: string;
  sector: SectorType;
  jobRole: string;
  experienceYears: number;
  preferredLanguage: SupportedLanguage;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  sector: SectorType;
  contactEmail: string;
  activeWorkersCount: number;
  complianceTargetPercentage: number;
  createdAt: string;
}

export interface LocalizedString {
  en: string;
  hi: string;
  sat: string;
}

export interface LessonKeyPoint {
  id: string;
  title: LocalizedString | string;
  description: LocalizedString | string;
  icon?: string;
}

export interface LessonContentBlock {
  type: 'TEXT' | 'CALLOUT' | 'STEP' | 'SAFETY_WARNING' | 'IMAGE_EXPLANATION';
  title?: LocalizedString | string;
  body: LocalizedString | string;
  bulletPoints?: (LocalizedString | string)[];
  mediaUrl?: string;
  tag?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  order: number;
  title: LocalizedString | string;
  description: LocalizedString | string;
  durationMinutes: number;
  keySafetyPoints: LessonKeyPoint[];
  contentBlocks: LessonContentBlock[];
  checklist: string[];
  isCompleted?: boolean;
}

export interface TrainingModule {
  id: string;
  moduleNumber: number;
  title: LocalizedString | string;
  description: LocalizedString | string;
  sector: SectorType;
  category: ModuleCategory;
  estimatedDurationMinutes: number;
  difficulty: DifficultyLevel;
  iconName: string;
  thumbnailUrl: string;
  isPublished: boolean;
  lessonsCount: number;
  progressPercentage?: number;
  isCertified?: boolean;
  lessons?: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOption {
  id: string;
  text: LocalizedString | string;
  imageUrl?: string;
  isCorrect?: boolean; // stripped on client retrieval
}

export interface AssessmentQuestion {
  id: string;
  questionId: string;
  type: QuestionType;
  question: LocalizedString | string;
  imageUrl?: string;
  options: QuestionOption[];
  correctAnswer: string | string[]; // answer id or sequence of ids (stripped when delivered to client)
  explanation: LocalizedString | string;
  difficulty: DifficultyLevel;
  competencyDomain: 'knowledge' | 'recognition' | 'decisionMaking' | 'procedure' | 'safetyCompliance';
  weight: number;
  timeLimitSeconds: number;
}

export interface AssessmentConfig {
  id: string;
  moduleId: string;
  title: LocalizedString | string;
  passingScore: number;
  attemptLimit: number;
  timeLimitMinutes: number;
  questionsCount: number;
  questions?: AssessmentQuestion[];
}

export interface CompetencyBreakdown {
  knowledge: number; // 0 - 100
  recognition: number;
  decisionMaking: number;
  procedure: number;
  safetyCompliance: number;
  overall: number;
}

export interface AssessmentSubmissionAnswer {
  questionId: string;
  selectedOption: string | string[];
  timeSpentSeconds: number;
}

export interface AssessmentSubmissionPayload {
  assessmentId: string;
  moduleId: string;
  answers: AssessmentSubmissionAnswer[];
  timeSpentTotalSeconds: number;
  idempotencyKey: string;
  offlineCompletedAt?: string;
}

export interface AssessmentResult {
  attemptId: string;
  assessmentId: string;
  moduleId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  timeTakenSeconds: number;
  competency: CompetencyBreakdown;
  certificateId?: string;
  isCertificateEligible?: boolean;
  arCompleted?: boolean;
  recommendedRetraining?: boolean;
  feedback: string;
  completedAt: string;
}

export interface TrainingModuleProgress {
  id?: string;
  userId: string;
  moduleId: string;
  moduleNumber: number;
  completedLessons: string[];
  progressPercentage: number;
  lastLessonId?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  score?: number;
  isCertified: boolean;
  arCompleted?: boolean;
  arCompletedAt?: string;
  arScore?: number;
  assessmentPassed?: boolean;
  assessmentScore?: number;
  certificateId?: string;
  startedAt: string;
  completedAt?: string;
  updatedAt?: string;
}

export interface Certificate {
  id: string;
  certificateId: string; // e.g. PRS-CERT-2026-A9401B
  verificationToken: string;
  userId: string;
  workerName: string;
  workerId: string;
  organizationId: string;
  organizationName: string;
  moduleId: string;
  moduleTitle: string;
  score: number;
  issueDate: string;
  expiryDate?: string;
  status: CertificateStatus;
  verificationUrl: string;
  qrCodeDataUrl?: string;
  revocationReason?: string;
  revokedAt?: string;
  adminVerified?: boolean;
  verificationTimestamp?: string;
  qrPayload?: {
    certificateId: string;
    verifyUrl: string;
    token: string;
  };
}

export interface CertificateVerificationResult {
  status: CertificateStatus | 'NOT_FOUND';
  certificateId: string;
  workerName?: string;
  workerIdMasked?: string;
  moduleTitle?: string;
  organizationName?: string;
  score?: number;
  issueDate?: string;
  expiryDate?: string;
  verificationUrl?: string;
  isValid: boolean;
  message: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export type NotificationItem = AppNotification;

export interface AuditLogItem {
  id: string;
  userId?: string;
  userEmail?: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

// Interactive Simulation Engine Domain Types
export interface ScenarioStep {
  stepId: string;
  order: number;
  title: LocalizedString | string;
  description: LocalizedString | string;
  environmentType: 'PLANT_FLOOR' | 'CONFINED_SPACE' | 'FURNACE_ZONE' | 'CRUSHING_AREA' | 'ELECTRICAL_ROOM';
  availableActions: {
    actionId: string;
    label: LocalizedString | string;
    icon?: string;
    isSafeAction: boolean;
    feedbackMessage: LocalizedString | string;
    competencyDomain: 'knowledge' | 'recognition' | 'decisionMaking' | 'procedure' | 'safetyCompliance';
  }[];
  correctActionId: string;
  hazardHotspots?: {
    id: string;
    xPercent: number;
    yPercent: number;
    hazardLabel: string;
    identified: boolean;
  }[];
}

export interface ScenarioDefinition {
  scenarioId: string;
  moduleId: string;
  title: LocalizedString | string;
  briefing: LocalizedString | string;
  environmentImageUrl?: string;
  steps: ScenarioStep[];
}

export interface UserScenarioAction {
  stepId: string;
  actionId: string;
  timestamp: number;
}

export interface ScenarioSessionState {
  sessionId: string;
  scenarioId: string;
  currentStepIndex: number;
  isCompleted: boolean;
  actionsHistory: UserScenarioAction[];
  score: number;
  competency: CompetencyBreakdown;
  startTime: number;
  endTime?: number;
}

// Offline Pending Sync Item
export interface PendingSyncItem {
  id: string;
  type: 'ASSESSMENT_ATTEMPT' | 'SCENARIO_PRACTICE' | 'LESSON_PROGRESS' | 'AR_DRILL_TELEMETRY' | 'PROFILE_UPDATE';
  payload: Record<string, unknown>;
  idempotencyKey: string;
  createdAt: string;
  retryCount: number;
  lastError?: string;
}

export interface SyncResponse {
  syncedCount: number;
  failedCount: number;
  processedIds: string[];
  certificatesEarned: Certificate[];
  latestProgress: Record<string, number>;
}

// -------------------------------------------------------------
// Real Smartphone Camera-Based AR Training Types
// -------------------------------------------------------------
export type ARScenarioType = 'FIRE_AND_EXPLOSION' | 'GAS_LEAK_CONFINED_SPACE' | 'LOTO_MACHINE' | 'PPE_INSPECTION' | 'EMERGENCY_EVACUATION';

export type ARActionType =
  // Fire AR Actions
  | 'SCAN_SURFACE'
  | 'PLACE_SCENARIO'
  | 'IDENTIFY_EMERGENCY_EXIT'
  | 'SPOT_HAZARD'
  | 'SOUND_ALARM'
  | 'SELECT_EXTINGUISHER'
  | 'PASS_PULL_PIN'
  | 'PASS_AIM_BASE'
  | 'PASS_SQUEEZE_LEVER'
  | 'PASS_SWEEP_FLAME'
  | 'FOLLOW_EVACUATION_ROUTE'
  | 'REACH_ASSEMBLY_POINT'
  // Gas Leak AR Actions
  | 'INSPECT_GAS_DETECTOR'
  | 'PROHIBIT_UNSAFE_ENTRY'
  | 'EQUIP_SCBA_PPE'
  | 'ACTIVATE_BUDDY_SYSTEM'
  | 'DEPLOY_BARRICADE'
  | 'TRIGGER_ISOLATION_VENTILATION'
  | 'SAFE_MUSTER_RETREAT';

export interface ARScenarioObject {
  id: string;
  type: 'HAZARD_SOURCE' | 'EXTINGUISHER' | 'ALARM_CALLPOINT' | 'EXIT_SIGN' | 'EVACUATION_ARROW' | 'GAS_DETECTOR' | 'PPE_RACK' | 'BUDDY_WORKER' | 'BARRICADE' | 'SAFE_ZONE';
  label: LocalizedString | string;
  position: { x: number; y: number; z: number };
  status: 'ACTIVE' | 'RESOLVED' | 'TRIGGERED' | 'DISPENSED' | 'LOCKED' | 'EQUIPPED';
  isInteractive: boolean;
  highlighted?: boolean;
}

export interface ARScenarioStep {
  stepIndex: number;
  stepKey: string;
  title: LocalizedString | string;
  instruction: LocalizedString | string;
  audioPromptKey?: string;
  expectedAction: ARActionType;
  availableActionOptions?: {
    actionKey: string;
    label: LocalizedString | string;
    isCorrect: boolean;
    feedback: LocalizedString | string;
  }[];
  dangerWarning?: LocalizedString | string;
  timeoutSeconds: number;
}

export interface ARScenarioDefinition {
  scenarioId: string;
  moduleId: string;
  type: ARScenarioType;
  title: LocalizedString | string;
  briefing: LocalizedString | string;
  steps: ARScenarioStep[];
  objects: ARScenarioObject[];
}

export interface ARSessionTelemetry {
  sessionId: string;
  moduleId: string;
  workerId: string;
  scenarioType: ARScenarioType;
  startTime: number;
  completionTime?: number;
  totalDurationSeconds: number;
  surfaceScannedSuccessfully: boolean;
  planeAnchorPosition?: { x: number; y: number; z: number };
  stepsCompleted: number;
  totalSteps: number;
  unsafeActionsTriggered: number;
  actionsLog: {
    stepIndex: number;
    actionType: ARActionType;
    isSafe: boolean;
    timestamp: number;
    timeSpentSeconds: number;
  }[];
  competencyScore: CompetencyBreakdown;
  isCompletedSuccessfully: boolean;
}

export type ARPlaneType = 'horizontal' | 'vertical' | 'any';

export type HazardType =
  | 'fire'
  | 'fuel'
  | 'electrical'
  | 'toxic_gas'
  | 'flammable_gas'
  | 'pressure'
  | 'pinch_point'
  | 'high_voltage';

export type IndustrialAssetType =
  | 'diesel_generator'
  | 'electrical_panel'
  | 'industrial_motor'
  | 'conveyor_system'
  | 'gas_cylinder'
  | 'oxygen_cylinder'
  | 'fire_extinguisher_abc'
  | 'fire_extinguisher_co2'
  | 'fire_extinguisher_water'
  | 'electrical_cabinet'
  | 'workshop_bench'
  | 'industrial_machine'
  | 'pipe_valve'
  | 'storage_container'
  | 'emergency_exit'
  | 'warning_sign'
  | 'hazard_zone'
  | 'ppe_station'
  | 'gas_monitoring_station';

export interface IndustrialAssetDefinition {
  id: string;
  type: IndustrialAssetType;
  name: LocalizedString;
  description: LocalizedString;
  model: string;
  preferredPlane: ARPlaneType;
  scale: number;
  interactionEnabled: boolean;
  hazardTypes: HazardType[];
  trainingModule: 'fire_explosion' | 'gas_leak_confined_space' | 'general';
  anchorRules: {
    snapToPlane: boolean;
    minClearanceRadiusMeters: number;
    defaultElevation: number;
  };
  boundingDimensions: {
    width: number;
    height: number;
    depth: number;
  };
  yoloClass: string;
}

export interface YOLODetectedObject {
  id: string;
  yoloClass: string;
  assetType?: IndustrialAssetType;
  label: string;
  confidence: number;
  bbox: {
    x: number; // percentage 0-100 of screen
    y: number; // percentage 0-100 of screen
    width: number; // percentage of screen
    height: number; // percentage of screen
  };
  distanceMeters: number;
  isTargetOfInterest: boolean;
  associatedPlane: ARPlaneType;
}

export interface ARPlaneDetectionState {
  planeType: ARPlaneType;
  isDetected: boolean;
  confidence: number;
  distanceMeters: number;
  pitchDegrees: number;
  surfaceAreaEstimatedM2: number;
  anchorCoordinates?: { x: number; y: number; z: number };
  stabilityScore: number;
}

