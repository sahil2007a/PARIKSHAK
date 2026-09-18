import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Award,
  Sparkles,
  Zap,
  Flame,
  Wind
} from 'lucide-react-native';
import { ARSimulationEngine, ARActionResult } from '../../engine/ARSimulationEngine';
import { ARCameraView } from '../../components/AR/ARCameraView';
import { FireScenario3D } from '../../components/AR/FireScenario3D';
import { GasLeakScenario3D } from '../../components/AR/GasLeakScenario3D';
import { ExistingFireModuleScreen } from '../../components/AR/ExistingFireModuleScreen';
import { ARScenarioDefinition, ARScenarioStep, ARActionType } from '@parishak/shared';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../localization/i18n';
import { offlineStorage } from '../../services/offlineStorage';
import { mobileApi } from '../../services/api';

export default function ARTrainingScreen() {
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const moduleId = id || '1';
  const { t, currentLanguage, resolveLocalizedText } = useLanguage();
  const [engine] = useState(() => new ARSimulationEngine());
  const [scenario, setScenario] = useState<ARScenarioDefinition | null>(null);
  const [currentStep, setCurrentStep] = useState<ARScenarioStep | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [isSurfaceLocked, setIsSurfaceLocked] = useState(false);
  const [dangerAlert, setDangerAlert] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const lang = currentLanguage;

  useEffect(() => {
    const scen = engine.loadScenario(moduleId);
    setScenario(scen);
    setCurrentStep(engine.getCurrentStep());
    setStepIndex(engine.getCurrentStepIndex());
    setLoading(false);
  }, [moduleId]);

  const handleLockSurface = () => {
    const result = engine.confirmSurfacePlanePlacement();
    setIsSurfaceLocked(true);
    setStepIndex(result.nextStepIndex || 1);
    setCurrentStep(engine.getCurrentStep());
  };

  const handleExecuteAction = async (actionType: ARActionType, isSafe: boolean) => {
    const result = engine.executeAction(actionType, isSafe);

    if (result.dangerAlert) {
      setDangerAlert(true);
      setTimeout(() => setDangerAlert(false), 800);
      const alertMsg = (result.feedbackText as any)[lang] || result.feedbackText.en;
      Alert.alert(
        t('ar.criticalSafetyWarning', 'CRITICAL SAFETY WARNING'),
        alertMsg
      );
      return;
    }

    if (result.isScenarioComplete) {
      const user = await offlineStorage.getUser();
      const telem = engine.getTelemetry(user?.workerId || 'WRK-DEMO');
      setTelemetry(telem);
      setIsComplete(true);

      // Save drill telemetry locally / sync queue
      try {
        await offlineStorage.saveProgress(moduleId, 100);
        await offlineStorage.addToSyncQueue({
          id: `sync-ar-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: 'AR_DRILL_TELEMETRY',
          payload: {
            ...telem,
            workerId: user?.workerId || 'WRK-DEMO'
          },
          idempotencyKey: `ar-drill-${Date.now()}`,
          createdAt: new Date().toISOString(),
          retryCount: 0
        });
        // Sync immediately with backend so admin dashboard receives real-time event
        mobileApi.syncOfflineProgress().catch(() => {});
      } catch (e) {
        console.error('Failed to save AR progress locally', e);
      }
    } else if (result.isStepCompleted) {
      setStepIndex(engine.getCurrentStepIndex());
      setCurrentStep(engine.getCurrentStep());
    }
  };

  const handleRestart = () => {
    setIsComplete(false);
    setIsSurfaceLocked(false);
    const scen = engine.loadScenario(moduleId);
    setScenario(scen);
    setCurrentStep(engine.getCurrentStep());
    setStepIndex(0);
  };

  if (loading || !scenario) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{t('ar.initializingEngine', 'Initializing AR Camera Engine...')}</Text>
      </View>
    );
  }

  // When Fire AR Drill or R Simulator is opened, directly load the EXISTING Fire Module
  if (moduleId === '1' || scenario.type === 'FIRE_AND_EXPLOSION') {
    return (
      <ExistingFireModuleScreen
        isSimulatorMode={mode === 'simulator'}
        onComplete={(score) => {
          mobileApi.completeFireDrill({ scenarioId: 'ar-fire-drill-01', score }).catch(() => {});
        }}
      />
    );
  }

  const stepTitle = currentStep ? resolveLocalizedText(currentStep.title) : '';
  const stepInstruction = currentStep ? resolveLocalizedText(currentStep.instruction) : '';

  return (
    <View style={styles.container}>
      {/* Main AR Camera Viewport */}
      <ARCameraView
        isSurfaceLocked={isSurfaceLocked}
        onLockSurface={handleLockSurface}
        stepTitle={stepTitle}
        stepInstruction={stepInstruction}
        dangerAlert={dangerAlert}
        totalSteps={engine.getTotalSteps()}
        currentStepIndex={stepIndex}
        scenarioType={scenario.type as 'FIRE_AND_EXPLOSION' | 'GAS_LEAK_CONFINED_SPACE'}
      >
        {(scenario.type as string) === 'FIRE_AND_EXPLOSION' ? (
          <FireScenario3D
            currentStepIndex={stepIndex}
            onExecuteAction={handleExecuteAction}
            language={lang}
          />
        ) : (
          <GasLeakScenario3D
            currentStepIndex={stepIndex}
            onExecuteAction={handleExecuteAction}
            language={lang}
          />
        )}
      </ARCameraView>

      {/* Completion Modal Overlay */}
      {isComplete && (
        <View style={styles.completionOverlay}>
          <View style={styles.completionCard}>
            <View style={styles.completionIconBadge}>
              <ShieldCheck size={36} color="#FFFFFF" />
            </View>

            <Text style={styles.completionTitle}>{t('ar.drillCompleted', 'AR Safety Drill Completed!')}</Text>
            <Text style={styles.completionSub}>
              {t('ar.drillCompletedDesc', 'You have successfully demonstrated spatial hazard recognition, emergency protocols, and procedural mastery in augmented reality.')}
            </Text>

            {/* Score & Telemetry Grid */}
            <View style={styles.telemetryGrid}>
              <View style={styles.telemetryCell}>
                <Text style={styles.telemetryLabel}>{t('ar.competencyLabel', 'Competency')}</Text>
                <Text style={styles.telemetryValue}>{telemetry?.competencyScore?.overall || 95}%</Text>
              </View>

              <View style={styles.telemetryCell}>
                <Text style={styles.telemetryLabel}>{t('ar.drillDuration', 'Drill Duration')}</Text>
                <Text style={styles.telemetryValue}>{telemetry?.totalDurationSeconds || 42}s</Text>
              </View>

              <View style={styles.telemetryCell}>
                <Text style={styles.telemetryLabel}>{t('ar.unsafeTriggers', 'Unsafe Triggers')}</Text>
                <Text style={[styles.telemetryValue, { color: telemetry?.unsafeActionsTriggered === 0 ? '#10B981' : '#EF4444' }]}>
                  {telemetry?.unsafeActionsTriggered || 0}
                </Text>
              </View>
            </View>

            {/* View Verified Certificate Button */}
            <TouchableOpacity
              style={[styles.startExamButton, { backgroundColor: '#10B981', marginBottom: 10 }]}
              onPress={() => router.replace('/(tabs)/certificates')}
              activeOpacity={0.85}
            >
              <Award size={20} color="#FFFFFF" />
              <Text style={styles.startExamButtonText}>
                {t('ar.viewCertificate', 'View Verified Safety Certificate')}
              </Text>
            </TouchableOpacity>

            {/* Primary Action Button: Go to Exam */}
            <TouchableOpacity
              style={styles.startExamButton}
              onPress={() => router.replace(`/assessment/${moduleId}`)}
              activeOpacity={0.85}
            >
              <FileCheck2 size={20} color="#FFFFFF" />
              <Text style={styles.startExamButtonText}>
                {t('ar.takeExam', 'Take Official Certification Exam')}
              </Text>
            </TouchableOpacity>

            {/* Secondary Action Button: Practice Again */}
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRestart}
              activeOpacity={0.8}
            >
              <RotateCcw size={16} color={COLORS.mutedText} />
              <Text style={styles.retryButtonText}>{t('ar.repeatDrill', 'Repeat AR Scenario Practice')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A'
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  loadingText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '700'
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  completionOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    zIndex: 50
  },
  completionCard: {
    backgroundColor: '#1E293B',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    ...SHADOWS.floating
  },
  completionIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8
  },
  completionSub: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18
  },
  telemetryGrid: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 20
  },
  telemetryCell: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: RADIUS.md,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  telemetryLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4
  },
  telemetryValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900'
  },
  startExamButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    width: '100%',
    marginBottom: 10
  },
  startExamButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10
  },
  retryButtonText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700'
  }
});
