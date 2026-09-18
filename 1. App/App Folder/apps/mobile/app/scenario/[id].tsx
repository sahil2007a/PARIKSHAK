import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  Flame,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Award,
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react-native';
import { SimulationEngine } from '../../engine/SimulationEngine';
import { ActionValidationResult } from '../../engine/TrainingExperienceEngine';
import { ScenarioDefinition, ScenarioStep, ScenarioSessionState } from '@parishak/shared';
import { Button } from '../../components/Button';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../localization/i18n';

export default function ScenarioSimulationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, resolveLocalizedText } = useLanguage();
  const [engine] = useState(() => new SimulationEngine());
  const [scenario, setScenario] = useState<ScenarioDefinition | null>(null);
  const [currentStep, setCurrentStep] = useState<ScenarioStep | null>(null);
  const [sessionState, setSessionState] = useState<ScenarioSessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [lastFeedback, setLastFeedback] = useState<ActionValidationResult | null>(null);
  const [simComplete, setSimComplete] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true
        })
      ])
    ).start();

    const init = async () => {
      const scen = await engine.loadScenario(id || '1');
      setScenario(scen);
      const state = await engine.startScenario(scen.scenarioId);
      setSessionState(state);
      setCurrentStep(engine.getCurrentStep());
      setLoading(false);
    };
    init();
  }, [id]);

  const handleActionSelect = async (actionId: string) => {
    if (!currentStep || selectedActionId) return;

    setSelectedActionId(actionId);
    const result = await engine.recordAction(actionId, 5);
    setLastFeedback(result);
    setSessionState(engine.getCurrentState());

    if (result.isStepCompleted) {
      setTimeout(() => {
        const nextStep = engine.getCurrentStep();
        const nextState = engine.getCurrentState();

        if (nextState.isCompleted) {
          setSimComplete(true);
        } else {
          setCurrentStep(nextStep);
          setSelectedActionId(null);
          setLastFeedback(null);
        }
      }, 1400);
    } else {
      // Unsafe action -> allow retry after feedback
      setTimeout(() => {
        setSelectedActionId(null);
      }, 1800);
    }
  };

  const handleRestart = async () => {
    if (!scenario) return;
    setLoading(true);
    setSimComplete(false);
    setSelectedActionId(null);
    setLastFeedback(null);
    const state = await engine.startScenario(scenario.scenarioId);
    setSessionState(state);
    setCurrentStep(engine.getCurrentStep());
    setLoading(false);
  };

  if (loading || !scenario || !currentStep) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{t('scenario.initializing', 'Initializing Simulation Drill...')}</Text>
      </SafeAreaView>
    );
  }

  const scenarioTitle = resolveLocalizedText(scenario.title);
  const stepTitle = resolveLocalizedText(currentStep.title);
  const stepDesc = resolveLocalizedText(currentStep.description);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.topScoreBadge}>
          <Sparkles size={14} color={COLORS.primary} />
          <Text style={styles.topScoreText}>{t('common.score', 'Score')}: {sessionState?.score || 0} pts</Text>
        </View>

        <TouchableOpacity onPress={handleRestart} style={styles.restartButton}>
          <RotateCcw size={16} color={COLORS.mutedText} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {simComplete ? (
          /* Simulation Complete View */
          <View style={styles.completeCard}>
            <View style={styles.completeIconCircle}>
              <Award size={48} color="#FFFFFF" />
            </View>

            <Text style={styles.completeTitle}>{t('scenario.completed', 'Scenario Simulation Completed!')}</Text>
            <Text style={styles.completeSub}>
              {t('scenario.completeDesc', 'You successfully identified the hazard, alerted facility personnel, and executed the PASS extinguishing technique according to industrial standards.')}
            </Text>

            <View style={styles.scoreStatsBox}>
              <View style={styles.scoreStat}>
                <Text style={styles.scoreStatNum}>{sessionState?.score || 100}</Text>
                <Text style={styles.scoreStatLabel}>{t('scenario.drillPoints', 'Drill Points')}</Text>
              </View>
              <View style={styles.scoreStat}>
                <Text style={styles.scoreStatNum}>{sessionState?.competency.procedure || 100}%</Text>
                <Text style={styles.scoreStatLabel}>{t('scenario.procedureScore', 'Procedure Score')}</Text>
              </View>
              <View style={styles.scoreStat}>
                <Text style={styles.scoreStatNum}>100%</Text>
                <Text style={styles.scoreStatLabel}>{t('scenario.safetyRating', 'Safety Rating')}</Text>
              </View>
            </View>

            <Button
              title={t('scenario.proceedExam', 'Proceed to Official Certification Exam →')}
              onPress={() => router.push(`/assessment/${id}`)}
              size="lg"
              style={{ width: '100%', marginTop: 20 }}
            />

            <TouchableOpacity
              onPress={handleRestart}
              style={styles.retryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.retryButtonText}>{t('scenario.repeatDrill', 'Repeat Simulation Drill')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Step Progression Bar */}
            <View style={styles.progressRow}>
              <Text style={styles.progressStepText}>
                {t('assessment.step', 'Step')} {(sessionState?.currentStepIndex || 0) + 1} {t('common.of', 'of')} {scenario.steps.length}
              </Text>
              <View style={styles.stepTrack}>
                {scenario.steps.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.stepSegment,
                      idx <= (sessionState?.currentStepIndex || 0) && styles.stepSegmentActive
                    ]}
                  />
                ))}
              </View>
            </View>

            {/* Simulated Hazardous Environment Visual Box */}
            <View style={styles.environmentVisualBox}>
              <Animated.View
                style={[
                  styles.hazardCircle,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <Flame size={44} color="#FFFFFF" />
              </Animated.View>
              <Text style={styles.hazardVisualTitle}>{t('scenario.simulatedHazard', 'Simulated Diesel Fire Hazard')}</Text>
              <Text style={styles.hazardVisualSub}>{t('scenario.facilityConveyor', 'Facility Conveyor Floor • Zone B')}</Text>
            </View>

            {/* Current Step Instruction Card */}
            <View style={styles.instructionCard}>
              <Text style={styles.stepTitleText}>{stepTitle}</Text>
              <Text style={styles.stepDescText}>{stepDesc}</Text>
            </View>

            {/* Action Feedback Banner */}
            {lastFeedback && (
              <View
                style={[
                  styles.feedbackBanner,
                  lastFeedback.isSafeAction ? styles.feedbackSuccess : styles.feedbackDanger
                ]}
              >
                <View style={styles.feedbackHeader}>
                  {lastFeedback.isSafeAction ? (
                    <CheckCircle2 size={16} color="#27AE60" />
                  ) : (
                    <AlertTriangle size={16} color="#E74C3C" />
                  )}
                  <Text
                    style={[
                      styles.feedbackHeaderText,
                      lastFeedback.isSafeAction ? { color: '#27AE60' } : { color: '#E74C3C' }
                    ]}
                  >
                    {lastFeedback.isSafeAction ? t('scenario.safeActionExecuted', 'Safe Action Executed (+20 pts)') : t('scenario.unsafeActionTriggered', 'Unsafe Action Triggered')}
                  </Text>
                </View>
                <Text style={styles.feedbackBodyText}>{lastFeedback.feedbackMessage}</Text>
              </View>
            )}

            {/* Available Action Decisions */}
            <Text style={styles.actionsHeading}>{t('scenario.selectAction', 'Select Next Safety Action')}</Text>

            <View style={styles.actionsList}>
              {currentStep.availableActions.map((action) => {
                const label = resolveLocalizedText(action.label);
                const isSelected = selectedActionId === action.actionId;

                return (
                  <TouchableOpacity
                    key={action.actionId}
                    style={[
                      styles.actionOptionCard,
                      isSelected &&
                        (action.isSafeAction ? styles.actionOptionSuccess : styles.actionOptionDanger)
                    ]}
                    onPress={() => handleActionSelect(action.actionId)}
                    activeOpacity={0.8}
                    disabled={!!selectedActionId}
                  >
                    <View style={styles.actionOptionContent}>
                      <Text
                        style={[
                          styles.actionOptionText,
                          isSelected && action.isSafeAction && { color: '#0E6655' },
                          isSelected && !action.isSafeAction && { color: '#78281F' }
                        ]}
                      >
                        {label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    gap: 12
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkText
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9EFEF'
  },
  topScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full
  },
  topScoreText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary
  },
  restartButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F5F8F7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl
  },
  progressRow: {
    marginBottom: 12
  },
  progressStepText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.mutedText,
    marginBottom: 6,
    textTransform: 'uppercase'
  },
  stepTrack: {
    flexDirection: 'row',
    gap: 6,
    height: 6
  },
  stepSegment: {
    flex: 1,
    backgroundColor: '#E2E8E6',
    borderRadius: RADIUS.full
  },
  stepSegmentActive: {
    backgroundColor: COLORS.primary
  },
  environmentVisualBox: {
    backgroundColor: '#1E293B',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    ...SHADOWS.floating
  },
  hazardCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E74C3C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 10
  },
  hazardVisualTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 6
  },
  hazardVisualSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  },
  instructionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E2E8E6',
    marginBottom: 16,
    ...SHADOWS.card
  },
  stepTitleText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 6
  },
  stepDescText: {
    fontSize: 13,
    color: COLORS.mutedText,
    lineHeight: 19
  },
  feedbackBanner: {
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: 16,
    borderWidth: 1
  },
  feedbackSuccess: {
    backgroundColor: '#EAFAF1',
    borderColor: '#A9DFBF'
  },
  feedbackDanger: {
    backgroundColor: '#FDEDEC',
    borderColor: '#FADBD8'
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  feedbackHeaderText: {
    fontSize: 12,
    fontWeight: '800'
  },
  feedbackBodyText: {
    fontSize: 12,
    color: COLORS.darkText,
    lineHeight: 17
  },
  actionsHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.3
  },
  actionsList: {
    gap: 10,
    marginBottom: 20
  },
  actionOptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md + 2,
    borderWidth: 1.5,
    borderColor: '#E2E8E6',
    ...SHADOWS.sm
  },
  actionOptionSuccess: {
    backgroundColor: '#E8F8F5',
    borderColor: COLORS.primary
  },
  actionOptionDanger: {
    backgroundColor: '#FDEDEC',
    borderColor: COLORS.danger
  },
  actionOptionContent: {
    flex: 1
  },
  actionOptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkText,
    lineHeight: 18
  },
  completeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8E6',
    marginTop: SPACING.md,
    ...SHADOWS.card
  },
  completeIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.floating
  },
  completeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.darkText,
    textAlign: 'center',
    marginBottom: 6
  },
  completeSub: {
    fontSize: 12,
    color: COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20
  },
  scoreStatsBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#F8FAF9',
    padding: 14,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#E2E8E6'
  },
  scoreStat: {
    alignItems: 'center'
  },
  scoreStatNum: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary
  },
  scoreStatLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.mutedText,
    textTransform: 'uppercase',
    marginTop: 2
  },
  retryButton: {
    marginTop: 14,
    padding: 8
  },
  retryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.mutedText
  }
});
