import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Easing
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  Scan,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wind,
  Layers,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  RefreshCw,
  Camera,
  Grid,
  Square
} from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { ARPlaneType } from '@parishak/shared';
import { YOLODetectionOverlay } from './YOLODetectionOverlay';
import { useLanguage } from '../../localization/i18n';

interface ARCameraViewProps {
  children?: any;
  isSurfaceLocked: boolean;
  onLockSurface: () => void;
  stepTitle: string;
  stepInstruction: string;
  dangerAlert: boolean;
  totalSteps: number;
  currentStepIndex: number;
  scenarioType: 'FIRE_AND_EXPLOSION' | 'GAS_LEAK_CONFINED_SPACE';
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ARCameraView: React.FC<ARCameraViewProps> = ({
  children,
  isSurfaceLocked,
  onLockSurface,
  stepTitle,
  stepInstruction,
  dangerAlert,
  totalSteps,
  currentStepIndex,
  scenarioType
}) => {
  const { t } = useLanguage();
  const [permission, requestPermission] = useCameraPermissions();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [cameraFacing, setCameraFacing] = useState<'back' | 'front'>('back');
  const [activePlane, setActivePlane] = useState<ARPlaneType>('horizontal');
  const [surfaceConfidence, setSurfaceConfidence] = useState(0); // 0 to 100%
  const [featurePointsCount, setFeaturePointsCount] = useState(12);

  // Animations
  const scanSweep = useRef(new Animated.Value(0)).current;
  const reticleScale = useRef(new Animated.Value(0.95)).current;
  const sonarRing = useRef(new Animated.Value(0)).current;
  const dangerFlash = useRef(new Animated.Value(0)).current;
  const featurePulse = useRef(new Animated.Value(0.5)).current;

  // 1. Proactively request camera permission on mount
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // 2. Web camera fallback if running on web browser
  const videoRef = useRef<any>(null);
  useEffect(() => {
    if (Platform.OS === 'web' && !permission?.granted) {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play?.();
            }
          })
          .catch((err) => {
            console.log('Web camera stream fallback error:', err);
          });
      }
    }
  }, [permission]);

  // 3. Surface Plane Detection simulation loop
  useEffect(() => {
    // Pulse animation for surface reticle
    Animated.loop(
      Animated.sequence([
        Animated.timing(reticleScale, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.timing(reticleScale, {
          toValue: 0.95,
          duration: 800,
          useNativeDriver: true
        })
      ])
    ).start();

    // Laser grid scanning sweep loop
    Animated.loop(
      Animated.timing(scanSweep, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();

    // Sonar radar ring expansion
    Animated.loop(
      Animated.sequence([
        Animated.timing(sonarRing, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(sonarRing, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true
        })
      ])
    ).start();

    // Feature point sparkle
    Animated.loop(
      Animated.sequence([
        Animated.timing(featurePulse, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true
        }),
        Animated.timing(featurePulse, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true
        })
      ])
    ).start();

    // Confidence accumulation simulation
    const confInterval = setInterval(() => {
      setSurfaceConfidence((prev) => {
        if (prev < 98) {
          return Math.min(98, prev + 18);
        }
        return prev;
      });
      setFeaturePointsCount((prev) => (prev < 48 ? prev + 6 : 48));
    }, 450);

    return () => clearInterval(confInterval);
  }, []);

  // 4. Danger flash on violation
  useEffect(() => {
    if (dangerAlert) {
      Animated.sequence([
        Animated.timing(dangerFlash, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(dangerFlash, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(dangerFlash, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(dangerFlash, { toValue: 0, duration: 250, useNativeDriver: true })
      ]).start();
    }
  }, [dangerAlert]);

  const hasCamera = permission?.granted;

  // Feature point cloud simulated coordinates
  const featurePoints = [
    { top: '35%', left: '25%', label: '+0.32' },
    { top: '40%', left: '68%', label: '-0.45' },
    { top: '48%', left: '42%', label: '+0.12' },
    { top: '55%', left: '18%', label: '-0.78' },
    { top: '58%', left: '76%', label: '+0.64' },
    { top: '65%', left: '32%', label: '+0.05' },
    { top: '68%', left: '62%', label: '-0.21' },
    { top: '74%', left: '48%', label: '+0.18' }
  ];

  return (
    <View style={styles.container}>
      {/* 1. Camera Feed Layer */}
      {hasCamera ? (
        <CameraView style={StyleSheet.absoluteFill} facing={cameraFacing} />
      ) : Platform.OS === 'web' ? (
        <View style={StyleSheet.absoluteFill}>
          {/* HTML5 Video element on web */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {/* Fallback industrial texture if webcam not yet authorized */}
          <View style={styles.simulatedBackground}>
            <View style={styles.floorPerspectiveGrid} />
            <TouchableOpacity
              style={styles.permissionBadge}
              onPress={requestPermission}
              activeOpacity={0.8}
            >
              <Camera size={16} color="#00F2FE" />
              <Text style={styles.permissionText}>{t('ar.grantCamera', 'Grant Live Camera Feed')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.simulatedBackground}>
          {/* Industrial Factory Floor Texture for Simulator / No Camera */}
          <View style={styles.floorPerspectiveGrid} />
          <TouchableOpacity
            style={styles.permissionBadge}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Camera size={16} color="#00F2FE" />
            <Text style={styles.permissionText}>{t('ar.enableCamera', 'Enable Live Camera Feed')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 2. YOLO Real-Time Industrial Computer Vision Bounding Box Overlay */}
      <YOLODetectionOverlay
        isSurfaceLocked={isSurfaceLocked}
        currentStepIndex={currentStepIndex}
        scenarioType={scenarioType}
      />

      {/* 3. Danger Flash Alert Overlay */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.dangerFlashOverlay,
          {
            opacity: dangerFlash
          }
        ]}
      />

      {/* 4. AR Spatial Surface Plane Detection Mode (Before Locked) */}
      {!isSurfaceLocked && (
        <View style={styles.scanningLayer}>
          {/* Dual Perspective LiDAR Scanning Grid: Horizontal vs Vertical */}
          <View style={styles.perspectiveContainer}>
            {activePlane === 'horizontal' ? (
              <View style={styles.lidarFloorGrid}>
                <Animated.View
                  style={[
                    styles.lidarLaserBeam,
                    {
                      transform: [
                        {
                          translateY: scanSweep.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-120, 200]
                          })
                        }
                      ]
                    }
                  ]}
                />
              </View>
            ) : (
              <View style={styles.lidarWallGrid}>
                <Animated.View
                  style={[
                    styles.lidarWallLaserBeam,
                    {
                      transform: [
                        {
                          translateX: scanSweep.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-140, 140]
                          })
                        }
                      ]
                    }
                  ]}
                />
              </View>
            )}
          </View>

          {/* SLAM Feature Point Cloud Anchors */}
          {featurePoints.map((pt, i) => (
            <Animated.View
              key={i}
              style={[
                styles.featureAnchorDot,
                {
                  top: pt.top as any,
                  left: pt.left as any,
                  opacity: featurePulse
                }
              ]}
            >
              <View style={styles.featureCrosshairH} />
              <View style={styles.featureCrosshairV} />
              <Text style={styles.featureCoordText}>{pt.label}</Text>
            </Animated.View>
          ))}

          {/* Dynamic 3D Reticle on the Detected Surface */}
          <TouchableOpacity
            onPress={onLockSurface}
            activeOpacity={0.9}
            style={styles.reticleTouchWrapper}
          >
            {/* Sonar Expanding Wave */}
            <Animated.View
              style={[
                styles.sonarWave,
                {
                  transform: [
                    {
                      scale: sonarRing.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.6]
                      })
                    }
                  ],
                  opacity: sonarRing.interpolate({
                    inputRange: [0, 0.8, 1],
                    outputRange: [0.8, 0.4, 0]
                  })
                }
              ]}
            />

            {/* Target Ring */}
            <Animated.View
              style={[
                styles.reticleRing,
                {
                  transform: [{ scale: reticleScale }]
                }
              ]}
            >
              <View style={styles.reticleCornerTL} />
              <View style={styles.reticleCornerTR} />
              <View style={styles.reticleCornerBL} />
              <View style={styles.reticleCornerBR} />
              <View style={styles.reticleCenterDot} />
              <Scan size={34} color={activePlane === 'horizontal' ? COLORS.secondary : '#A78BFA'} style={styles.scanIcon} />
            </Animated.View>
          </TouchableOpacity>

          {/* Surface Plane Detection Telemetry Card */}
          <View style={styles.surfacePromptCard}>
            {/* Plane Mode Selector Tabs */}
            <View style={styles.planeModeSelector}>
              <TouchableOpacity
                style={[
                  styles.planeModeButton,
                  activePlane === 'horizontal' && styles.planeModeButtonActive
                ]}
                onPress={() => setActivePlane('horizontal')}
                activeOpacity={0.8}
              >
                <Grid size={13} color={activePlane === 'horizontal' ? '#00F2FE' : '#94A3B8'} />
                <Text
                  style={[
                    styles.planeModeText,
                    activePlane === 'horizontal' && styles.planeModeTextActive
                  ]}
                >
                  FLOOR / TABLE (HORIZONTAL)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.planeModeButton,
                  activePlane === 'vertical' && styles.planeModeButtonActiveVertical
                ]}
                onPress={() => setActivePlane('vertical')}
                activeOpacity={0.8}
              >
                <Square size={13} color={activePlane === 'vertical' ? '#A78BFA' : '#94A3B8'} />
                <Text
                  style={[
                    styles.planeModeText,
                    activePlane === 'vertical' && styles.planeModeTextActiveVertical
                  ]}
                >
                  WALL / DOOR (VERTICAL)
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.surfacePromptHeader}>
              <View
                style={[
                  styles.liveIndicatorDot,
                  { backgroundColor: activePlane === 'horizontal' ? '#00F2FE' : '#A78BFA' }
                ]}
              />
              <Text style={styles.surfacePromptTitle}>
                {surfaceConfidence > 50
                  ? 'Surface detected — Tap to place training environment'
                  : `Scanning for flat surface... ${surfaceConfidence}%`}
              </Text>
            </View>

            {/* Surface Metrics Bar */}
            <View style={styles.planeMetricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>{t('ar.confidence', 'CONFIDENCE')}</Text>
                <Text style={styles.metricValue}>{surfaceConfidence}%</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>{t('ar.distance', 'DISTANCE')}</Text>
                <Text style={styles.metricValue}>{activePlane === 'horizontal' ? '1.38 m' : '2.15 m'}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>{t('ar.surfaceNormal', 'SURFACE NORMAL')}</Text>
                <Text style={styles.metricValue}>
                  {activePlane === 'horizontal' ? '[0, 1, 0] 12°' : '[0, 0, 1] 88°'}
                </Text>
              </View>
            </View>

            {/* Confidence Progress Bar */}
            <View style={styles.confidenceBarTrack}>
              <View
                style={[
                  styles.confidenceBarFill,
                  {
                    width: `${surfaceConfidence}%`,
                    backgroundColor: activePlane === 'horizontal' ? '#00F2FE' : '#A78BFA'
                  }
                ]}
              />
            </View>

            <Text style={styles.surfacePromptSub}>
              {surfaceConfidence > 50
                ? 'Stable horizontal surface detected. Tap anywhere on the floor reticle to anchor the 3D mining training environment.'
                : 'Move your phone slowly across a flat surface (floor, table, or corridor) to detect training surface.'}
            </Text>

            <TouchableOpacity
              style={[
                styles.lockPlaneButton,
                activePlane === 'vertical' && { backgroundColor: '#7C3AED' }
              ]}
              onPress={onLockSurface}
              activeOpacity={0.85}
            >
              <CheckCircle2 size={18} color="#FFFFFF" />
              <Text style={styles.lockPlaneButtonText}>
                {surfaceConfidence > 50
                  ? 'Tap to Place Training Environment'
                  : 'Surface detected — Tap to place training environment'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 5. Active Spatial 3D / AR Objects Layer (Once Locked) */}
      {isSurfaceLocked && <View style={styles.spatialSceneLayer}>{children}</View>}

      {/* 5. Top Industrial HUD */}
      <View style={styles.topHud}>
        <View style={styles.hudBadge}>
          {scenarioType === 'FIRE_AND_EXPLOSION' ? (
            <Flame size={14} color="#FF6B6B" />
          ) : (
            <Wind size={14} color="#48DBFB" />
          )}
          <Text style={styles.hudBadgeText}>
            {scenarioType === 'FIRE_AND_EXPLOSION' ? 'AR FIRE DRILL' : 'AR GAS LEAK DRILL'}
          </Text>
        </View>

        <View style={styles.stepProgressContainer}>
          <Text style={styles.stepProgressText}>
            STEP {currentStepIndex + 1} / {totalSteps}
          </Text>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }
              ]}
            />
          </View>
        </View>

        <View style={styles.hudActionButtons}>
          <TouchableOpacity
            style={styles.audioToggleButton}
            onPress={() =>
              setCameraFacing((prev) => (prev === 'back' ? 'front' : 'back'))
            }
            activeOpacity={0.8}
          >
            <RefreshCw size={14} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.audioToggleButton}
            onPress={() => setAudioEnabled(!audioEnabled)}
            activeOpacity={0.8}
          >
            {audioEnabled ? (
              <Volume2 size={15} color="#FFFFFF" />
            ) : (
              <VolumeX size={15} color="#A0AEC0" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 6. Bottom Step Guidance HUD Card */}
      {isSurfaceLocked && (
        <View style={styles.bottomInstructionCard}>
          <View style={styles.instructionHeader}>
            <View style={styles.instructionIconCircle}>
              <Sparkles size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.instructionStepTitle} numberOfLines={1}>
              {stepTitle}
            </Text>
          </View>
          <Text style={styles.instructionBody}>{stepInstruction}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A'
  },
  simulatedBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0B1120',
    alignItems: 'center',
    justifyContent: 'center'
  },
  floorPerspectiveGrid: {
    position: 'absolute',
    bottom: 0,
    left: -SCREEN_WIDTH * 0.5,
    right: -SCREEN_WIDTH * 0.5,
    height: SCREEN_HEIGHT * 0.65,
    borderTopWidth: 2,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    opacity: 0.6
  },
  permissionBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: '#00F2FE',
    zIndex: 10
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  dangerFlashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(239, 68, 68, 0.45)',
    zIndex: 99
  },
  scanningLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20
  },
  perspectiveContainer: {
    position: 'absolute',
    bottom: '22%',
    width: 320,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center'
  },
  lidarFloorGrid: {
    width: 280,
    height: 180,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.25)',
    borderRadius: 16,
    backgroundColor: 'rgba(0, 242, 254, 0.03)',
    overflow: 'hidden',
    position: 'relative'
  },
  lidarWallGrid: {
    width: 280,
    height: 200,
    borderWidth: 1.5,
    borderColor: 'rgba(167, 139, 250, 0.35)',
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.04)',
    overflow: 'hidden',
    position: 'relative'
  },
  lidarLaserBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#00F2FE',
    shadowColor: '#00F2FE',
    shadowOpacity: 0.9,
    shadowRadius: 8
  },
  lidarWallLaserBeam: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#A78BFA',
    shadowColor: '#A78BFA',
    shadowOpacity: 0.9,
    shadowRadius: 8
  },
  featureAnchorDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  featureCrosshairH: {
    position: 'absolute',
    width: 8,
    height: 1.5,
    backgroundColor: '#F59E0B'
  },
  featureCrosshairV: {
    position: 'absolute',
    width: 1.5,
    height: 8,
    backgroundColor: '#F59E0B'
  },
  featureCoordText: {
    position: 'absolute',
    top: 10,
    fontSize: 7,
    fontFamily: 'monospace',
    color: '#F59E0B',
    fontWeight: '800'
  },
  reticleTouchWrapper: {
    position: 'absolute',
    top: '36%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sonarWave: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: 'rgba(0, 242, 254, 0.5)'
  },
  reticleRing: {
    width: 200,
    height: 200,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 242, 254, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'rgba(0, 242, 254, 0.05)'
  },
  reticleCornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 24,
    height: 24,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.secondary
  },
  reticleCornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 24,
    height: 24,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.secondary
  },
  reticleCornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 24,
    height: 24,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.secondary
  },
  reticleCornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.secondary
  },
  reticleCenterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary
  },
  scanIcon: {
    position: 'absolute'
  },
  planeModeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: RADIUS.md,
    padding: 4
  },
  planeModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    borderRadius: RADIUS.sm
  },
  planeModeButtonActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    borderWidth: 1,
    borderColor: '#00F2FE'
  },
  planeModeButtonActiveVertical: {
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
    borderWidth: 1,
    borderColor: '#A78BFA'
  },
  planeModeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8'
  },
  planeModeTextActive: {
    color: '#00F2FE',
    fontWeight: '800'
  },
  planeModeTextActiveVertical: {
    color: '#A78BFA',
    fontWeight: '800'
  },
  surfacePromptCard: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderRadius: RADIUS.xl,
    padding: SPACING.md + 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.35)',
    ...SHADOWS.floating
  },
  surfacePromptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  liveIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981'
  },
  surfacePromptTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#00F2FE',
    letterSpacing: 0.5
  },
  planeMetricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8
  },
  metricItem: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: RADIUS.sm,
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: 'center'
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '800'
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'monospace'
  },
  confidenceBarTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10
  },
  confidenceBarFill: {
    height: '100%',
    backgroundColor: '#00F2FE',
    borderRadius: 2
  },
  surfacePromptSub: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
    marginBottom: 12
  },
  lockPlaneButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: RADIUS.md,
    gap: 8
  },
  lockPlaneButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  spatialSceneLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 10
  },
  topHud: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 30
  },
  hudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  hudBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  stepProgressContainer: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  stepProgressText: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 3
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 2
  },
  hudActionButtons: {
    flexDirection: 'row',
    gap: 6
  },
  audioToggleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  bottomInstructionCard: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderRadius: RADIUS.xl,
    padding: SPACING.md + 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    zIndex: 30,
    ...SHADOWS.card
  },
  instructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  instructionIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 168, 150, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  instructionStepTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1
  },
  instructionBody: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 18
  }
});
