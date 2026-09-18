import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Flame,
  Sparkles,
  Play,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Award,
  CheckCircle,
  XCircle,
  ChevronRight,
  RotateCcw
} from 'lucide-react-native';
import { mobileApi } from '../../services/api';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { t } from '../../localization/i18n';

// Direct import of the EXISTING Fire Module Screen from AR Model
// @ts-ignore - JavaScript component from AR Model
import ARFireScreen from '../../../../AR Model/mobile_virtual_fire/src/screens/ARFireScreen';

interface ExistingFireModuleScreenProps {
  onComplete?: (score: number) => void;
  isSimulatorMode?: boolean;
}

export const ExistingFireModuleScreen: React.FC<ExistingFireModuleScreenProps> = ({
  onComplete,
  isSimulatorMode = false
}) => {
  const insets = useSafeAreaInsets();
  const [yoloStatus, setYoloStatus] = useState<{
    isYoloRunning: boolean;
    yoloUrl: string;
    modelLoaded?: boolean;
  }>({
    isYoloRunning: false,
    yoloUrl: 'http://localhost:8000'
  });
  const [isStartingServer, setIsStartingServer] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  // Fire AR Real Assessment State
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [assessmentResult, setAssessmentResult] = useState<{
    score: number;
    correctCount: number;
    passed: boolean;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const DRILL_SCENARIOS = [
    {
      id: 1,
      title: 'Scenario 1: Identify Fire Class & Fuel',
      question: 'A pool of diesel fuel beneath a conveyor roller has ignited. What is the fire class and immediate rule?',
      options: [
        { id: 'a', text: 'Class A: Spray pressurized water immediately' },
        { id: 'b', text: 'Class B: Flammable liquid fire. NEVER use water. Use ABC Dry Powder or Foam' },
        { id: 'c', text: 'Class D: Combustible metal fire. Use sand only' }
      ],
      correctAnswer: 'b',
      explanation: 'Water on flammable liquids causes violent splashing and steam explosions. Always use Class B agent.'
    },
    {
      id: 2,
      title: 'Scenario 2: PASS Extinguisher Technique Sequence',
      question: 'To operate the 3D dry powder extinguisher properly, what is the mandatory operational sequence?',
      options: [
        { id: 'a', text: 'Aim at top flames -> Squeeze -> Pull pin -> Sweep' },
        { id: 'b', text: 'Pull safety pin -> Aim low at fire base -> Squeeze lever -> Sweep side-to-side' },
        { id: 'c', text: 'Squeeze handle -> Sweep -> Pull pin -> Run away' }
      ],
      correctAnswer: 'b',
      explanation: 'PASS stands for: Pull the pin, Aim at the base, Squeeze the trigger, Sweep side-to-side.'
    },
    {
      id: 3,
      title: 'Scenario 3: Energized Machinery Hazard',
      question: 'The fire spreads toward an energized 415V electrical control switchgear. What action is strictly FORBIDDEN?',
      options: [
        { id: 'a', text: 'De-energizing the main circuit breaker from a safe panel' },
        { id: 'b', text: 'Using a non-conductive CO2 gas extinguisher' },
        { id: 'c', text: 'Directing a water hose or water extinguisher at the live switchgear' }
      ],
      correctAnswer: 'c',
      explanation: 'Water conducts high voltage electricity directly back to the operator, causing fatal electrocution.'
    },
    {
      id: 4,
      title: 'Scenario 4: Emergency Response & Alarm',
      question: 'Before discharging the extinguisher, what mandatory safety communication step must be taken?',
      options: [
        { id: 'a', text: 'Sound nearest emergency pull station alarm and alert control room' },
        { id: 'b', text: 'Wait 10 minutes to see if the fire burns out naturally' },
        { id: 'c', text: 'Take a video on phone to upload to social media' }
      ],
      correctAnswer: 'a',
      explanation: 'Always raise the alarm and confirm emergency responders are dispatched before fighting any industrial fire.'
    },
    {
      id: 5,
      title: 'Scenario 5: Evacuation Threshold & Decision',
      question: 'The flame height exceeds a 200-liter oil drum and dense smoke reaches breathing level. What is the correct decision?',
      options: [
        { id: 'a', text: 'Keep fighting alone until the extinguisher cylinder is empty' },
        { id: 'b', text: 'Abort firefighting immediately, stay low beneath smoke, and evacuate via marked emergency route' },
        { id: 'c', text: 'Climb onto the machine conveyor to get above the heat' }
      ],
      correctAnswer: 'b',
      explanation: 'If a fire exceeds drum height, portable extinguishers are insufficient. Abort immediately and evacuate.'
    }
  ];

  const handleSelectAnswer = (scenarioId: number, optionId: string) => {
    setUserAnswers((prev) => ({ ...prev, [scenarioId]: optionId }));
  };

  const handleSubmitDrillAssessment = async () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount < DRILL_SCENARIOS.length) {
      Alert.alert('Incomplete Assessment', `Please answer all ${DRILL_SCENARIOS.length} scenarios before submitting.`);
      return;
    }

    setIsSubmitting(true);
    let correct = 0;
    DRILL_SCENARIOS.forEach((scen) => {
      if (userAnswers[scen.id] === scen.correctAnswer) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / DRILL_SCENARIOS.length) * 100);
    const passed = calculatedScore >= 70;

    try {
      const res = await mobileApi.completeFireDrill({
        scenarioId: 'ar-fire-drill-01',
        score: calculatedScore,
        passAccuracy: calculatedScore / 100,
        extinguisherType: 'ABC_DRY_POWDER'
      });

      setAssessmentResult({
        score: calculatedScore,
        correctCount: correct,
        passed,
        message: res.message || (passed ? 'Fire AR Drill Passed!' : 'Retraining Recommended.')
      });

      onComplete?.(calculatedScore);
    } catch (e: any) {
      setAssessmentResult({
        score: calculatedScore,
        correctCount: correct,
        passed,
        message: 'Drill score saved locally.'
      });
      onComplete?.(calculatedScore);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check YOLO backend status on mount
  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      try {
        const res = await mobileApi.getFireModuleStatus();
        if (isMounted && res?.data) {
          setYoloStatus({
            isYoloRunning: !!res.data.isYoloRunning,
            yoloUrl: res.data.yoloUrl || 'http://localhost:8000',
            modelLoaded: !!res.data.modelLoaded
          });
        }
      } catch {
        // status check fallback
      }
    };

    check();
    const interval = setInterval(check, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleStartYoloServer = async () => {
    setIsStartingServer(true);
    try {
      const res = await mobileApi.startYoloServer();
      if (res.success || res.alreadyRunning) {
        setYoloStatus((prev) => ({ ...prev, isYoloRunning: true }));
        Alert.alert('YOLO Server Active', 'Connected to YOLOv8 Detection Server on port 8000.');
      } else {
        Alert.alert('Server Start Notice', res.message || 'Starting YOLO server in background...');
      }
    } catch (e: any) {
      Alert.alert('Server Start', 'Ensure 1_START_YOLO_SERVER.bat is running on port 8000.');
    } finally {
      setIsStartingServer(false);
    }
  };

  const handleLaunchStandalone = async () => {
    try {
      const res = await mobileApi.launchMobileApp();
      Alert.alert('Mobile Bundler', res.message || 'Starting 2_START_MOBILE_APP.bat Expo bundler...');
    } catch {
      Alert.alert('Notice', 'Run 2_START_MOBILE_APP.bat directly from AR Model directory.');
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Core Existing Fire Module Screen */}
      <View style={styles.fireModuleWrapper}>
        <ARFireScreen />
      </View>

      {/* 2. Seamless PARIKSHAK 1.0 Top Overlay Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={18} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Exit Drill</Text>
        </TouchableOpacity>

        {/* Live YOLO AI Server Indicator */}
        <View style={styles.statusPillGroup}>
          <View
            style={[
              styles.statusPill,
              yoloStatus.isYoloRunning ? styles.statusPillOnline : styles.statusPillOffline
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: yoloStatus.isYoloRunning ? '#10B981' : '#F59E0B' }
              ]}
            />
            <Text style={styles.statusText}>
              {yoloStatus.isYoloRunning ? 'YOLO AI: CONNECTED' : 'YOLO AI: CONNECTING'}
            </Text>
          </View>

          {!yoloStatus.isYoloRunning && (
            <TouchableOpacity
              style={styles.startServerButton}
              onPress={handleStartYoloServer}
              disabled={isStartingServer}
              activeOpacity={0.8}
            >
              {isStartingServer ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Play size={11} color="#FFFFFF" />
                  <Text style={styles.startServerText}>Start Server</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 3. Interactive Fire AR Guidance Banner (Dismissible) */}
      {showGuide && (
        <View style={styles.guideBanner}>
          <View style={styles.guideHeader}>
            <View style={styles.guideTitleRow}>
              <Flame size={14} color="#FF6B00" />
              <Text style={styles.guideTitle}>FIRE AR SAFETY DRILL (PASS PROTOCOL)</Text>
            </View>
            <TouchableOpacity onPress={() => setShowGuide(false)}>
              <Text style={styles.dismissText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.guideBody}>
            • <Text style={{ fontWeight: '700', color: '#FFFFFF' }}>YOLO AI Detection:</Text> Streams camera to identify industrial machinery & flammable objects.{'\n'}
            • <Text style={{ fontWeight: '700', color: '#FFFFFF' }}>Interactive Simulation:</Text> Tap screen to position virtual hazards on physical floor.{'\n'}
            • <Text style={{ fontWeight: '700', color: '#FFFFFF' }}>Extinguisher Action:</Text> Practice PASS protocol: Pull, Aim, Squeeze, Sweep.
          </Text>
        </View>
      )}

      {/* 4. Floating Action Button: Trigger Fire AR Assessment on Bottom-Left */}
      <View style={[styles.bottomLeftBar, { bottom: Math.max(insets.bottom, 20) + 16 }]}>
        <TouchableOpacity
          style={styles.drillAssessmentButton}
          onPress={() => setShowAssessmentModal(true)}
          activeOpacity={0.85}
        >
          <Award size={16} color="#FFFFFF" />
          <Text style={styles.drillAssessmentButtonText} numberOfLines={1}>
            {assessmentResult ? `${assessmentResult.score}% • ${t('ar.reviewDrill')}` : t('ar.assessmentButton')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 5. Real Fire AR Drill Assessment Modal */}
      <Modal
        visible={showAssessmentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAssessmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Flame size={20} color="#FF6B00" />
                <Text style={styles.modalTitle}>Fire Safety Drill Evaluation</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAssessmentModal(false)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {assessmentResult ? (
                <View style={styles.resultContainer}>
                  <View
                    style={[
                      styles.resultBadgeCircle,
                      assessmentResult.passed ? { backgroundColor: '#10B981' } : { backgroundColor: '#EF4444' }
                    ]}
                  >
                    {assessmentResult.passed ? (
                      <CheckCircle size={44} color="#FFFFFF" />
                    ) : (
                      <XCircle size={44} color="#FFFFFF" />
                    )}
                  </View>

                  <Text style={styles.resultTitle}>
                    {assessmentResult.passed ? 'Drill Passed Successfully!' : 'Drill Incomplete'}
                  </Text>
                  <Text style={styles.resultScoreText}>{assessmentResult.score}%</Text>
                  <Text style={styles.resultSubText}>
                    {assessmentResult.correctCount} of {DRILL_SCENARIOS.length} scenarios correct.
                  </Text>
                  <Text style={styles.resultMessage}>{assessmentResult.message}</Text>

                  <View style={styles.resultActions}>
                    <TouchableOpacity
                      style={styles.primaryActionBtn}
                      onPress={() => {
                        setShowAssessmentModal(false);
                        router.push('/assessment/1');
                      }}
                    >
                      <Text style={styles.primaryActionText}>Proceed to Certification Exam →</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.secondaryActionBtn}
                      onPress={() => {
                        setShowAssessmentModal(false);
                        router.back();
                      }}
                    >
                      <Text style={styles.secondaryActionText}>Return to Module Overview</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  <Text style={styles.scenarioIntro}>
                    Answer these 5 critical industrial fire scenarios to verify practical hazard response and record your score.
                  </Text>

                  {DRILL_SCENARIOS.map((scen, idx) => {
                    const selected = userAnswers[scen.id];
                    return (
                      <View key={scen.id} style={styles.scenarioCard}>
                        <Text style={styles.scenarioNumber}>Scenario {idx + 1} of {DRILL_SCENARIOS.length}</Text>
                        <Text style={styles.scenarioQuestion}>{scen.question}</Text>

                        <View style={styles.optionsGroup}>
                          {scen.options.map((opt) => {
                            const isChosen = selected === opt.id;
                            return (
                              <TouchableOpacity
                                key={opt.id}
                                style={[
                                  styles.optionRow,
                                  isChosen && styles.optionRowSelected
                                ]}
                                onPress={() => handleSelectAnswer(scen.id, opt.id)}
                                activeOpacity={0.8}
                              >
                                <View style={[styles.radioCircle, isChosen && styles.radioCircleSelected]}>
                                  {isChosen && <View style={styles.radioInner} />}
                                </View>
                                <Text style={[styles.optionText, isChosen && styles.optionTextSelected]}>
                                  {opt.text}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    );
                  })}

                  <TouchableOpacity
                    style={[
                      styles.submitDrillBtn,
                      Object.keys(userAnswers).length < DRILL_SCENARIOS.length && styles.submitDrillBtnDisabled
                    ]}
                    onPress={handleSubmitDrillAssessment}
                    disabled={isSubmitting || Object.keys(userAnswers).length < DRILL_SCENARIOS.length}
                    activeOpacity={0.8}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.submitDrillBtnText}>Submit Fire AR Assessment</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  fireModuleWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 32,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  statusPillGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1
  },
  statusPillOnline: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.4)'
  },
  statusPillOffline: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.4)'
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  startServerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FF6B00',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20
  },
  startServerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  guideBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 90 : 76,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: RADIUS.md,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.35)',
    zIndex: 40
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  guideTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  guideTitle: {
    color: '#FF6B00',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  dismissText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 6
  },
  guideBody: {
    color: '#CBD5E1',
    fontSize: 10,
    lineHeight: 14
  },
  bottomLeftBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 36 : 24,
    left: 16,
    zIndex: 50,
    alignItems: 'flex-start'
  },
  drillAssessmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FF6B00',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...SHADOWS.card,
    elevation: 8,
    maxWidth: 190
  },
  drillAssessmentButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 24
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)'
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  closeBtnText: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '700'
  },
  modalScroll: {
    padding: 20
  },
  scenarioIntro: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18
  },
  scenarioCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  scenarioNumber: {
    color: '#FF6B00',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  scenarioQuestion: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 12
  },
  optionsGroup: {
    gap: 8
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  optionRowSelected: {
    borderColor: '#FF6B00',
    backgroundColor: 'rgba(255, 107, 0, 0.15)'
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioCircleSelected: {
    borderColor: '#FF6B00'
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B00'
  },
  optionText: {
    color: '#E2E8F0',
    fontSize: 13,
    flex: 1,
    lineHeight: 18
  },
  optionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  submitDrillBtn: {
    backgroundColor: '#FF6B00',
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24
  },
  submitDrillBtnDisabled: {
    backgroundColor: '#475569',
    opacity: 0.6
  },
  submitDrillBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  resultContainer: {
    alignItems: 'center',
    paddingVertical: 16
  },
  resultBadgeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  resultTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6
  },
  resultScoreText: {
    color: '#FF6B00',
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 4
  },
  resultSubText: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 10
  },
  resultMessage: {
    color: '#CBD5E1',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
    marginBottom: 24
  },
  resultActions: {
    width: '100%',
    gap: 12
  },
  primaryActionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: RADIUS.lg,
    alignItems: 'center'
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  secondaryActionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  secondaryActionText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '700'
  }
});

export default ExistingFireModuleScreen;
