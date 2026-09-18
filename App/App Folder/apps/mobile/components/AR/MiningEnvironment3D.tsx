import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  Vibration
} from 'react-native';
import {
  Flame,
  ShieldCheck,
  Zap,
  DoorOpen,
  LogOut,
  AlertTriangle,
  Wind,
  Crosshair,
  Check,
  CheckCircle2,
  Hand,
  Volume2
} from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { FireController, FireState } from '../../engine/FireController';
import { FIRE_SCENARIO_LAYOUT, MiningScenarioSpawner } from '../../engine/MiningScenarioSpawner';
import {
  FireEffectEngine,
  FlameEmitter,
  EmberParticle,
  SmokePuff,
  SprayParticle
} from '../../engine/FireEffectEngine';
import { FireSpriteOverlay } from './FireSpriteOverlay';
import { ExtinguisherSpray } from './ExtinguisherSpray';
import ARExtinguisher3DLayer from './ARExtinguisher3DLayer';
import { mobileApi } from '../../services/api';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MiningEnvironment3DProps {
  fireController: FireController;
  currentStepIndex: number;
  onStepComplete: (stepKey: string, isSafe: boolean) => void;
  language: string;
}

export const MiningEnvironment3D: React.FC<MiningEnvironment3DProps> = ({
  fireController,
  currentStepIndex,
  onStepComplete,
  language
}) => {
  // Fire State from Controller
  const [fireState, setFireState] = useState<FireState>(fireController.getState());

  // Extinguisher PASS State Machine
  // 'IDLE_IN_SCENE' -> 'SELECTED' -> 'PIN_PULLED' -> 'AIMED_CORRECTLY' -> 'DISCHARGING' -> 'EXTINGUISHED'
  const [passState, setPassState] = useState<
    'IDLE_IN_SCENE' | 'SELECTED' | 'PIN_PULLED' | 'AIMED_CORRECTLY' | 'DISCHARGING' | 'EXTINGUISHED'
  >('IDLE_IN_SCENE');

  const [pinRemoved, setPinRemoved] = useState(false);
  const [aimAngle, setAimAngle] = useState(0); // 0 = perfectly aligned at base
  const [isAimedProperly, setIsAimedProperly] = useState(true);
  const [isSqueezing, setIsSqueezing] = useState(false);
  const [suppressionProgress, setSuppressionProgress] = useState(0);
  const [exitVerified, setExitVerified] = useState(false);

  // ── ML Model Fire Effect Engine (sprite-based fire + CO2 spray) ──────────────
  const fireEffectEngineRef = useRef(new FireEffectEngine(16, 24));
  const [flameEmitters, setFlameEmitters] = useState<FlameEmitter[]>([]);
  const [embers, setEmbers] = useState<EmberParticle[]>([]);
  const [smokePuffs, setSmokePuffs] = useState<SmokePuff[]>([]);
  const [sprayParticlesList, setSprayParticlesList] = useState<SprayParticle[]>([]);
  const rafRef = useRef<number | null>(null);
  // Fire bounding box anchored on the diesel generator (pixel space)
  const FIRE_BOX = { x: SCREEN_WIDTH * 0.28, y: SCREEN_HEIGHT * 0.18, width: 160, height: 130 };
  const phaseOffsetRef = useRef(Math.random() * 10.0);
  // ─────────────────────────────────────────────────────────────────────────────

  // Animations
  const flamePulseOuter = useRef(new Animated.Value(1)).current;
  const flamePulseInner = useRef(new Animated.Value(0.9)).current;
  const smokeRise = useRef(new Animated.Value(0)).current;
  const pinSlide = useRef(new Animated.Value(0)).current;
  const leverSqueeze = useRef(new Animated.Value(0)).current;
  const exitGlow = useRef(new Animated.Value(0.8)).current;
  const floorGridPulse = useRef(new Animated.Value(0.5)).current;
  const sprayParticles = useRef(new Animated.Value(0)).current;
  const sessionIdRef = useRef<string | null>(null);

  // Initialize fire drill session with ML service & backend
  useEffect(() => {
    mobileApi.startFireScenario('ar-fire-drill-01')
      .then((res) => {
        if (res && res.sessionId) {
          sessionIdRef.current = res.sessionId;
        }
      })
      .catch((err) => {
        console.log('Fire scenario backend init (offline fallback mode):', err);
      });
  }, []);

  // 1. Subscribe to FireController
  useEffect(() => {
    const unsubscribe = fireController.subscribe((state) => {
      setFireState(state);
      setSuppressionProgress(state.suppressionPercentage);
      if (state.isExtinguished && passState !== 'EXTINGUISHED') {
        setPassState('EXTINGUISHED');
      }
    });
    return unsubscribe;
  }, [fireController, passState]);

  // 2a. RAF loop — drive FireEffectEngine for sprite-based fire & CO2 spray
  useEffect(() => {
    const engine = fireEffectEngineRef.current;
    let running = true;

    const tick = () => {
      if (!running) return;
      const ts = performance.now();
      const extProgress = 1.0 - Math.max(0, Math.min(1, fireController.getIntensity()));

      const { emitters: newEmitters } = engine.getFlameEmitters(
        FIRE_BOX,
        phaseOffsetRef.current,
        ts,
        extProgress
      );
      setFlameEmitters(newEmitters);
      setEmbers(engine.generateEmbers(7, FIRE_BOX, ts, extProgress));
      setSmokePuffs(engine.generateSmokePuffs(FIRE_BOX, ts, extProgress));

      if (isSqueezing) {
        setSprayParticlesList(
          engine.generateSprayParticles(22, ts, SCREEN_WIDTH, SCREEN_HEIGHT)
        );
      } else {
        setSprayParticlesList([]);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [isSqueezing, fireController]);

  // 2b. Flame & Environment Continuous Loops
  useEffect(() => {
    // Outer flame turbulent flicker
    Animated.loop(
      Animated.sequence([
        Animated.timing(flamePulseOuter, { toValue: 1.18, duration: 250, useNativeDriver: true }),
        Animated.timing(flamePulseOuter, { toValue: 0.88, duration: 280, useNativeDriver: true }),
        Animated.timing(flamePulseOuter, { toValue: 1.12, duration: 220, useNativeDriver: true }),
        Animated.timing(flamePulseOuter, { toValue: 0.95, duration: 260, useNativeDriver: true })
      ])
    ).start();

    // Inner flame white-hot flicker
    Animated.loop(
      Animated.sequence([
        Animated.timing(flamePulseInner, { toValue: 1.25, duration: 200, useNativeDriver: true }),
        Animated.timing(flamePulseInner, { toValue: 0.82, duration: 220, useNativeDriver: true })
      ])
    ).start();

    // Smoke billowing upwards
    Animated.loop(
      Animated.sequence([
        Animated.timing(smokeRise, { toValue: -60, duration: 1600, useNativeDriver: true }),
        Animated.timing(smokeRise, { toValue: 0, duration: 50, useNativeDriver: true })
      ])
    ).start();

    // Exit sign emergency pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(exitGlow, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(exitGlow, { toValue: 0.85, duration: 800, useNativeDriver: true })
      ])
    ).start();

    // Floor hazard boundary glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(floorGridPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(floorGridPulse, { toValue: 0.4, duration: 1000, useNativeDriver: true })
      ])
    ).start();
  }, []);

  // 3. Extinguisher Squeeze & Chemical Discharge Loop
  useEffect(() => {
    let dischargeInterval: any = null;
    if (isSqueezing && pinRemoved && fireState.isActive) {
      // Loop spray particle animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(sprayParticles, { toValue: 1, duration: 180, useNativeDriver: true }),
          Animated.timing(sprayParticles, { toValue: 0, duration: 60, useNativeDriver: true })
        ])
      ).start();

      // Trigger continuous suppression
      dischargeInterval = setInterval(() => {
        if (isAimedProperly) {
          const finished = fireController.reduceIntensity(0.04);
          if (Platform.OS !== 'web') {
            Vibration.vibrate(40);
          }
          if (finished) {
            setPassState('EXTINGUISHED');
            clearInterval(dischargeInterval);
            onStepComplete('PASS_SWEEP_FLAME', true);
            if (sessionIdRef.current) {
              mobileApi.extinguishFire(sessionIdRef.current, 'EXTINGUISH', 'ABC_DRY_POWDER', 95)
                .catch((err) => console.log('Extinguish API sync:', err));
            }
          }
        }
      }, 150);
    } else {
      sprayParticles.setValue(0);
      if (dischargeInterval) clearInterval(dischargeInterval);
    }

    return () => {
      if (dischargeInterval) clearInterval(dischargeInterval);
    };
  }, [isSqueezing, pinRemoved, isAimedProperly, fireState.isActive]);

  // Handle Extinguisher Pick Up
  const handleSelectExtinguisher = () => {
    if (passState === 'IDLE_IN_SCENE') {
      setPassState('SELECTED');
      onStepComplete('SELECT_EXTINGUISHER', true);
    }
  };

  // Handle Pin Pull Interaction
  const handlePullPin = () => {
    if (!pinRemoved) {
      Animated.timing(pinSlide, {
        toValue: 28,
        duration: 350,
        useNativeDriver: true
      }).start(() => {
        setPinRemoved(true);
        setPassState('PIN_PULLED');
        if (Platform.OS !== 'web') {
          Vibration.vibrate(80);
        }
      });
    }
  };

  // Handle Lever Squeeze Down
  const handleSqueezePressIn = () => {
    if (pinRemoved) {
      setIsSqueezing(true);
      Animated.timing(leverSqueeze, {
        toValue: 8,
        duration: 100,
        useNativeDriver: true
      }).start();
    }
  };

  // Handle Lever Squeeze Release
  const handleSqueezePressOut = () => {
    setIsSqueezing(false);
    Animated.timing(leverSqueeze, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true
    }).start();
  };

  // Handle Exit Verification
  const handleVerifyExit = () => {
    setExitVerified(true);
    onStepComplete('REACH_ASSEMBLY_POINT', true);
  };

  const flameHeight = 110 * fireState.intensity;
  const flameWidth = 90 * fireState.intensity;

  return (
    <View style={styles.worldContainer} pointerEvents="box-none">
      {/* ========================================================================= */}
      {/* 3D PERSPECTIVE ENVIRONMENT (ANCHORED ROOT TO PLANE)                      */}
      {/* ========================================================================= */}
      <View style={styles.anchored3DWorld} pointerEvents="box-none">
        {/* 1. Industrial Diamond Steel Floor Platform */}
        <Animated.View
          style={[
            styles.diamondSteelPlatform,
            {
              borderColor: fireState.isActive ? '#EF4444' : '#10B981',
              opacity: floorGridPulse
            }
          ]}
        >
          {/* Ground Hazard Cordon Chevrons */}
          <View style={styles.hazardPerimeterStrip}>
            <Text style={styles.hazardPerimeterText}>
              {fireState.isActive
                ? '/// DANGER: CLASS B FUEL FIRE — KEEP CLEAR ///'
                : '/// AREA SECURED — SAFE PASSAGEWAY ///'}
            </Text>
          </View>
        </Animated.View>

        {/* 2. Fuel / Oil Drum (Offset: { x: 1.1, z: -1.2 }) */}
        <View style={styles.fuelDrumContainer}>
          <View style={styles.fuelDrumLid} />
          <View style={styles.fuelDrumBody}>
            <View style={styles.fuelDrumRidge1} />
            <View style={styles.fuelDrumRidge2} />
            <View style={styles.flammableLiquidDiamond}>
              <Flame size={12} color="#FFFFFF" />
              <Text style={styles.flammableDiamondText}>3</Text>
            </View>
          </View>
          <Text style={styles.assetGroundLabel}>DIESEL DRUM (200L)</Text>
        </View>

        {/* 3. 415V Industrial Electrical Cabinet (Offset: { x: -1.1, z: -1.2 }) */}
        <View style={styles.electricalCabinetContainer}>
          <View style={styles.cabinetRoof} />
          <View style={styles.cabinetBody}>
            <View style={styles.cabinetVentSlots}>
              <View style={styles.ventSlot} />
              <View style={styles.ventSlot} />
              <View style={styles.ventSlot} />
            </View>
            <View style={styles.highVoltageSign}>
              <Zap size={14} color="#FFD700" />
              <Text style={styles.highVoltageText}>415V MCC</Text>
            </View>
            <View style={styles.doorHandle} />
          </View>
          <Text style={styles.assetGroundLabel}>MCC CABINET</Text>
        </View>

        {/* 4. Industrial Coolant & Fuel Pipe Manifold (Offset: { x: -1.3, z: -1.7 }) */}
        <View style={styles.pipeManifoldContainer}>
          <View style={styles.pipeSegmentH} />
          <View style={styles.pipeFlangeRing} />
          <View style={styles.pipeSegmentV} />
          <View style={styles.pressureGaugeCircle}>
            <Text style={styles.gaugePressureText}>6.2 BAR</Text>
          </View>
        </View>

        {/* 5. DIESEL GENERATOR (Central Primary Object: { x: 0, z: -1.5 }) */}
        <View style={styles.dieselGeneratorContainer}>
          {/* Exhaust Manifold Pipes */}
          <View style={styles.exhaustManifold}>
            <View style={styles.exhaustPipe} />
            <View style={styles.exhaustCap} />
          </View>

          {/* Generator Main Housing */}
          <View style={styles.generatorEnclosure}>
            {/* Top Louver Hood */}
            <View style={styles.generatorHood} />

            {/* Front Radiator Cooling Grill */}
            <View style={styles.radiatorGrill}>
              <View style={styles.radiatorGrillBar} />
              <View style={styles.radiatorGrillBar} />
              <View style={styles.radiatorGrillBar} />
              <View style={styles.radiatorGrillBar} />
            </View>

            {/* DGMS Identification Rating Plate */}
            <View style={styles.ratingPlate}>
              <View style={styles.ratingDot} />
              <Text style={styles.ratingPlateText}>HEAVY GENSET #4 · DIESEL</Text>
            </View>

            {/* Hazard Stripe Base */}
            <View style={styles.hazardStripeBase} />
          </View>
          <Text style={styles.generatorGroundTag}>DIESEL GENERATOR [CLASS B FUEL SOURCE]</Text>

          {/* =================================================================== */}
          {/* ML MODEL FIRE: 16-Frame Animated Sprite Overlay + Smoke            */}
          {/* =================================================================== */}
          {/* Ambient smoke billowing (Animated.View — kept from original) */}
          {fireState.isActive && (
            <Animated.View
              style={[
                styles.smokeParticlesContainer,
                {
                  opacity: fireState.smokeDensity,
                  transform: [{ translateY: smokeRise }]
                }
              ]}
              pointerEvents="none"
            >
              <View style={styles.smokePuff1} />
              <View style={styles.smokePuff2} />
              <View style={styles.smokePuff3} />
            </Animated.View>
          )}

          {/* ML Model: Animated Fire Sprite Overlay (anchored to generator) */}
          <FireSpriteOverlay
            box={FIRE_BOX}
            opacity={fireState.isActive ? Math.max(0.2, fireState.intensity) : 0}
            emitters={flameEmitters}
            embers={embers}
            smokePuffs={smokePuffs}
            isExtinguished={fireState.isExtinguished}
            blendMode="hybrid"
          />

          {/* Extinguished Steam Plume */}
          {fireState.isExtinguished && (
            <View style={styles.extinguishedIndicatorBadge}>
              <ShieldCheck size={26} color="#00F2FE" />
              <Text style={styles.extinguishedBadgeText}>FIRE 100% SUPPRESSED</Text>
            </View>
          )}
        </View>

        {/* 6. SPATIAL 3D FIRE EXTINGUISHER IN WORLD SCENE */}
        {passState === 'IDLE_IN_SCENE' && (
          <TouchableOpacity
            style={styles.extinguisherInWorldAnchor}
            onPress={handleSelectExtinguisher}
            activeOpacity={0.85}
          >
            {/* Interactive Pulse Halo */}
            <View style={styles.extinguisherHaloPulse} />

            {/* 3D Extinguisher Asset Cylinder */}
            <View style={styles.worldExtinguisherBody}>
              {/* Valve / Neck */}
              <View style={styles.worldExtinguisherValve} />
              {/* Red Cylinder */}
              <View style={styles.worldExtinguisherCylinder}>
                <View style={styles.worldExtinguisherBand} />
                <Text style={styles.worldExtinguisherText}>ABC</Text>
              </View>
              {/* Base */}
              <View style={styles.worldExtinguisherBase} />
            </View>

            {/* Floating Selection Badge */}
            <View style={styles.tapToEquipBadge}>
              <Hand size={12} color="#00F2FE" />
              <Text style={styles.tapToEquipText}>TAP EXTINGUISHER</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* 7. PHOTOLUMINESCENT EMERGENCY EXIT ROUTE (Offset: { x: 0, z: -2.2 }) */}
        <Animated.View
          style={[
            styles.emergencyExitWorldPortal,
            {
              transform: [{ scale: exitGlow }],
              opacity: fireState.isExtinguished ? 1 : 0.6
            }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.exitPortalTouchBox,
              fireState.isExtinguished && styles.exitPortalTouchBoxReady
            ]}
            onPress={handleVerifyExit}
            activeOpacity={0.8}
            disabled={!fireState.isExtinguished && !exitVerified}
          >
            <View style={styles.exitSignIlluminatedHeader}>
              <DoorOpen size={22} color="#FFFFFF" />
              <Text style={styles.exitPortalSignText}>EMERGENCY EXIT</Text>
              <LogOut size={16} color="#FFFFFF" />
            </View>

            <View style={styles.exitDoorFrame}>
              <View style={styles.exitDoorPanel}>
                <View style={styles.exitCrashBar} />
              </View>
            </View>

            <Text style={styles.exitRouteVerifyText}>
              {fireState.isExtinguished
                ? 'TAP TO VERIFY CLEAR ESCAPE ROUTE'
                : 'ESCAPE ROUTE MONITORED'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ========================================================================= */}
      {/* INTERACTIVE PASS EXTINQUISHER WORKBENCH (HANDHELD 3D AR TOOL)            */}
      {/* ========================================================================= */}
      {passState !== 'IDLE_IN_SCENE' && !fireState.isExtinguished && (
        <View style={styles.handheldPassToolContainer} pointerEvents="box-none">
          {/* ML Model: Volumetric CO2 Spray (replaces simple discharge plume) */}
          <ExtinguisherSpray particles={sprayParticlesList} active={isSqueezing} />

          {/* ML Model: Three.js WebGL 3D Extinguisher (right-bottom AR anchor) */}
          <ARExtinguisher3DLayer
            isExtinguishing={isSqueezing && pinRemoved}
            onToggleExtinguisher={(spraying) => {
              if (spraying) {
                handleSqueezePressIn();
              } else {
                handleSqueezePressOut();
              }
            }}
          />

          {/* Interactive PASS Tool Dock */}
          <View style={styles.passToolCard}>
            {/* Step Progress Pills: P - A - S - S */}
            <View style={styles.passPillsRow}>
              <View style={[styles.passPill, pinRemoved && styles.passPillComplete]}>
                <Text style={styles.passPillLetter}>P</Text>
                <Text style={styles.passPillWord}>PULL PIN</Text>
              </View>

              <View style={[styles.passPill, isAimedProperly && pinRemoved && styles.passPillComplete]}>
                <Text style={styles.passPillLetter}>A</Text>
                <Text style={styles.passPillWord}>AIM BASE</Text>
              </View>

              <View style={[styles.passPill, isSqueezing && styles.passPillComplete]}>
                <Text style={styles.passPillLetter}>S</Text>
                <Text style={styles.passPillWord}>SQUEEZE</Text>
              </View>

              <View style={[styles.passPill, suppressionProgress > 40 && styles.passPillComplete]}>
                <Text style={styles.passPillLetter}>S</Text>
                <Text style={styles.passPillWord}>SWEEP</Text>
              </View>
            </View>

            {/* Live Suppression Progress Bar */}
            <View style={styles.suppressionMeterContainer}>
              <View style={styles.suppressionMeterHeader}>
                <Text style={styles.suppressionMeterLabel}>FIRE SUPPRESSION PROGRESS</Text>
                <Text style={styles.suppressionMeterValue}>{suppressionProgress}%</Text>
              </View>
              <View style={styles.suppressionTrack}>
                <View
                  style={[
                    styles.suppressionFill,
                    {
                      width: `${suppressionProgress}%`,
                      backgroundColor: suppressionProgress > 70 ? '#10B981' : '#F59E0B'
                    }
                  ]}
                />
              </View>
            </View>

            {/* Interactive PASS Action Controls */}
            {!pinRemoved ? (
              // STEP 1: PULL PIN
              <View style={styles.passActionArea}>
                <Text style={styles.passInstructionPrompt}>
                  1. PULL the safety pin & break tamper seal to arm extinguisher:
                </Text>
                <TouchableOpacity
                  style={styles.pullPinInteractiveButton}
                  onPress={handlePullPin}
                  activeOpacity={0.85}
                >
                  <Animated.View
                    style={[
                      styles.safetyPinPullRing,
                      { transform: [{ translateX: pinSlide }] }
                    ]}
                  >
                    <View style={styles.pullRingCircle} />
                    <View style={styles.pullRingPinStem} />
                  </Animated.View>
                  <Text style={styles.pullPinButtonText}>PULL SAFETY PIN OUT</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // STEP 2 & 3: AIM & SQUEEZE LEVER
              <View style={styles.passActionArea}>
                {/* Aim Alignment Indicator */}
                <View style={styles.aimStatusRow}>
                  <Crosshair
                    size={18}
                    color={isAimedProperly ? '#10B981' : '#EF4444'}
                  />
                  <Text
                    style={[
                      styles.aimStatusText,
                      { color: isAimedProperly ? '#10B981' : '#EF4444' }
                    ]}
                  >
                    {isAimedProperly
                      ? 'AIM ALIGNED: TARGETING BASE OF FLAME (GOOD)'
                      : 'AIM TOO HIGH! AIM DIRECTLY AT FUEL BASE'}
                  </Text>
                </View>

                {/* Press & Hold Squeeze Lever */}
                <TouchableOpacity
                  style={[
                    styles.squeezeLeverButton,
                    isSqueezing && styles.squeezeLeverButtonActive
                  ]}
                  onPressIn={handleSqueezePressIn}
                  onPressOut={handleSqueezePressOut}
                  activeOpacity={0.9}
                >
                  <Animated.View
                    style={[
                      styles.leverMechanicalArm,
                      { transform: [{ translateY: leverSqueeze }] }
                    ]}
                  >
                    <Wind size={22} color="#FFFFFF" />
                  </Animated.View>
                  <View>
                    <Text style={styles.squeezeButtonText}>
                      {isSqueezing
                        ? 'DISCHARGING DRY CHEMICAL POWDER...'
                        : 'PRESS & HOLD LEVER TO SQUEEZE & SWEEP'}
                    </Text>
                    <Text style={styles.squeezeButtonSub}>
                      Keep sweeping across the entire burning base
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {/* ========================================================================= */}
      {/* EVACUATION PHASE HUD ONCE FIRE EXTINGUISHED                               */}
      {/* ========================================================================= */}
      {fireState.isExtinguished && (
        <View style={styles.evacuationCompletionBanner} pointerEvents="box-none">
          <View style={styles.evacCard}>
            <View style={styles.evacHeader}>
              <ShieldCheck size={28} color="#10B981" />
              <View>
                <Text style={styles.evacTitle}>FIRE EXTINGUISHED SUCCESSFULLY!</Text>
                <Text style={styles.evacSub}>Final Step: Evacuate via emergency exit portal</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.verifyExitButton}
              onPress={handleVerifyExit}
              activeOpacity={0.85}
            >
              <CheckCircle2 size={18} color="#FFFFFF" />
              <Text style={styles.verifyExitButtonText}>
                Confirm Safe Egress & Complete Scenario
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  worldContainer: {
    ...StyleSheet.absoluteFill as any,
    alignItems: 'center',
    justifyContent: 'center'
  },
  anchored3DWorld: {
    ...StyleSheet.absoluteFill as any,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ perspective: 900 }]
  },

  // 1. Diamond Steel Platform
  diamondSteelPlatform: {
    position: 'absolute',
    bottom: '18%',
    width: 320,
    height: 240,
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    transform: [{ rotateX: '65deg' }],
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  hazardPerimeterStrip: {
    width: '100%',
    backgroundColor: 'rgba(239, 68, 68, 0.35)',
    paddingVertical: 4,
    alignItems: 'center'
  },
  hazardPerimeterText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FCA5A5',
    letterSpacing: 0.6
  },

  // 2. Fuel Drum
  fuelDrumContainer: {
    position: 'absolute',
    bottom: '30%',
    right: '12%',
    alignItems: 'center'
  },
  fuelDrumLid: {
    width: 44,
    height: 12,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#475569'
  },
  fuelDrumBody: {
    width: 42,
    height: 60,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fuelDrumRidge1: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#334155'
  },
  fuelDrumRidge2: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#334155'
  },
  flammableLiquidDiamond: {
    width: 22,
    height: 22,
    backgroundColor: '#DC2626',
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF'
  },
  flammableDiamondText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
    transform: [{ rotate: '-45deg' }]
  },

  // 3. Electrical Cabinet
  electricalCabinetContainer: {
    position: 'absolute',
    bottom: '32%',
    left: '10%',
    alignItems: 'center'
  },
  cabinetRoof: {
    width: 54,
    height: 8,
    backgroundColor: '#334155',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  cabinetBody: {
    width: 50,
    height: 85,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#475569',
    padding: 4,
    alignItems: 'center'
  },
  cabinetVentSlots: {
    width: '100%',
    gap: 3,
    marginBottom: 8
  },
  ventSlot: {
    height: 2,
    backgroundColor: '#0F172A'
  },
  highVoltageSign: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4
  },
  highVoltageText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#FFD700'
  },
  doorHandle: {
    position: 'absolute',
    right: 5,
    top: 40,
    width: 3,
    height: 12,
    backgroundColor: '#94A3B8'
  },
  assetGroundLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: '#94A3B8',
    marginTop: 4
  },

  // 4. Pipe Manifold
  pipeManifoldContainer: {
    position: 'absolute',
    bottom: '48%',
    left: '8%',
    alignItems: 'center'
  },
  pipeSegmentH: {
    width: 48,
    height: 8,
    backgroundColor: '#64748B',
    borderRadius: 2
  },
  pipeFlangeRing: {
    width: 12,
    height: 14,
    backgroundColor: '#475569',
    borderRadius: 3
  },
  pipeSegmentV: {
    width: 8,
    height: 32,
    backgroundColor: '#64748B'
  },
  pressureGaugeCircle: {
    position: 'absolute',
    top: -12,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  gaugePressureText: {
    fontSize: 5,
    fontWeight: '900',
    color: '#0F172A'
  },

  // 5. Diesel Generator
  dieselGeneratorContainer: {
    position: 'absolute',
    bottom: '28%',
    alignItems: 'center',
    zIndex: 10
  },
  exhaustManifold: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: -4,
    zIndex: 11
  },
  exhaustPipe: {
    width: 14,
    height: 24,
    backgroundColor: '#475569',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  exhaustCap: {
    width: 20,
    height: 4,
    backgroundColor: '#334155'
  },
  generatorEnclosure: {
    width: 140,
    height: 95,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8
  },
  generatorHood: {
    width: '100%',
    height: 10,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6
  },
  radiatorGrill: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4
  },
  radiatorGrillBar: {
    width: 4,
    height: 35,
    backgroundColor: '#0F172A',
    borderRadius: 2
  },
  ratingPlate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 4
  },
  ratingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10B981'
  },
  ratingPlateText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#00F2FE',
    letterSpacing: 0.5
  },
  hazardStripeBase: {
    width: '100%',
    height: 6,
    backgroundColor: '#F59E0B',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6
  },
  generatorGroundTag: {
    fontSize: 8,
    fontWeight: '900',
    color: '#E2E8F0',
    marginTop: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },

  // 3D Fire Spatial Anchor
  fireSpatialAnchor: {
    position: 'absolute',
    top: -85,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 25
  },
  smokeParticlesContainer: {
    position: 'absolute',
    top: -45,
    alignItems: 'center'
  },
  smokePuff1: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(75, 85, 99, 0.45)'
  },
  smokePuff2: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(107, 114, 128, 0.35)',
    marginTop: -20,
    marginLeft: 15
  },
  smokePuff3: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    marginTop: -25,
    marginRight: 18
  },
  groundHeatGlow: {
    position: 'absolute',
    bottom: -15,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 69, 0, 0.25)'
  },
  outerFlameLayer: {
    position: 'absolute',
    alignItems: 'center'
  },
  middleFlameLayer: {
    position: 'absolute',
    alignItems: 'center',
    top: 15
  },
  innerCombustionCore: {
    position: 'absolute',
    top: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20
  },
  extinguishedIndicatorBadge: {
    position: 'absolute',
    top: -55,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: '#00F2FE'
  },
  extinguishedBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#00F2FE'
  },

  // 6. Extinguisher in World Scene
  extinguisherInWorldAnchor: {
    position: 'absolute',
    bottom: '22%',
    right: '20%',
    alignItems: 'center',
    zIndex: 30
  },
  extinguisherHaloPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 242, 254, 0.25)',
    borderWidth: 1.5,
    borderColor: '#00F2FE'
  },
  worldExtinguisherBody: {
    alignItems: 'center'
  },
  worldExtinguisherValve: {
    width: 10,
    height: 10,
    backgroundColor: '#CBD5E1',
    borderRadius: 2
  },
  worldExtinguisherCylinder: {
    width: 26,
    height: 52,
    backgroundColor: '#DC2626',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#991B1B',
    alignItems: 'center',
    justifyContent: 'center'
  },
  worldExtinguisherBand: {
    width: '100%',
    height: 10,
    backgroundColor: '#2563EB'
  },
  worldExtinguisherText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  worldExtinguisherBase: {
    width: 22,
    height: 4,
    backgroundColor: '#0F172A',
    borderRadius: 2
  },
  tapToEquipBadge: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#00F2FE'
  },
  tapToEquipText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#00F2FE'
  },

  // 7. Emergency Exit World Portal
  emergencyExitWorldPortal: {
    position: 'absolute',
    top: '12%',
    alignItems: 'center',
    zIndex: 5
  },
  exitPortalTouchBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(6, 78, 59, 0.65)',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981'
  },
  exitPortalTouchBoxReady: {
    backgroundColor: 'rgba(16, 185, 129, 0.35)',
    borderColor: '#34D399'
  },
  exitSignIlluminatedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  exitPortalSignText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1
  },
  exitDoorFrame: {
    width: 90,
    height: 110,
    borderWidth: 3,
    borderColor: '#34D399',
    marginTop: 6,
    backgroundColor: 'rgba(4, 120, 87, 0.3)',
    justifyContent: 'center',
    padding: 6
  },
  exitDoorPanel: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6EE7B7'
  },
  exitCrashBar: {
    width: '90%',
    height: 4,
    backgroundColor: '#EF4444',
    alignSelf: 'center'
  },
  exitRouteVerifyText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#6EE7B7',
    marginTop: 6
  },

  // Handheld PASS Tool & Discharge
  handheldPassToolContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 50
  },
  nozzleDischargePlume: {
    position: 'absolute',
    top: -160,
    left: '35%',
    alignItems: 'center',
    zIndex: 40
  },
  dischargeParticleCore: {
    width: 24,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 12
  },
  dischargeParticleCloud1: {
    position: 'absolute',
    top: -20,
    width: 85,
    height: 85,
    borderRadius: 42,
    backgroundColor: 'rgba(241, 245, 249, 0.7)'
  },
  dischargeParticleCloud2: {
    position: 'absolute',
    top: -45,
    width: 115,
    height: 115,
    borderRadius: 57,
    backgroundColor: 'rgba(226, 232, 240, 0.55)'
  },
  dischargeParticleCloud3: {
    position: 'absolute',
    top: -70,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(203, 213, 225, 0.35)'
  },
  passToolCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#00F2FE',
    ...SHADOWS.floating
  },
  passPillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10
  },
  passPill: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 5,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)'
  },
  passPillComplete: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: '#10B981'
  },
  passPillLetter: {
    fontSize: 12,
    fontWeight: '900',
    color: '#00F2FE'
  },
  passPillWord: {
    fontSize: 7,
    fontWeight: '800',
    color: '#94A3B8'
  },
  suppressionMeterContainer: {
    marginBottom: 10
  },
  suppressionMeterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  suppressionMeterLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8'
  },
  suppressionMeterValue: {
    fontSize: 10,
    fontWeight: '900',
    color: '#00F2FE'
  },
  suppressionTrack: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden'
  },
  suppressionFill: {
    height: '100%',
    borderRadius: 3
  },
  passActionArea: {
    gap: 8
  },
  passInstructionPrompt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0'
  },
  pullPinInteractiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    gap: 12
  },
  safetyPinPullRing: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pullRingCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#FDE047'
  },
  pullRingPinStem: {
    width: 16,
    height: 4,
    backgroundColor: '#CBD5E1'
  },
  pullPinButtonText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  aimStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  aimStatusText: {
    fontSize: 10,
    fontWeight: '800'
  },
  squeezeLeverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#00F2FE',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    gap: 10
  },
  squeezeLeverButtonActive: {
    backgroundColor: 'rgba(0, 242, 254, 0.25)',
    borderColor: '#38BDF8'
  },
  leverMechanicalArm: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  squeezeButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  squeezeButtonSub: {
    fontSize: 8,
    color: '#94A3B8',
    marginTop: 2
  },

  // Evacuation phase
  evacuationCompletionBanner: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 60
  },
  evacCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1.5,
    borderColor: '#10B981',
    gap: 10
  },
  evacHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  evacTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#10B981'
  },
  evacSub: {
    fontSize: 9,
    color: '#CBD5E1'
  },
  verifyExitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: RADIUS.md
  },
  verifyExitButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF'
  }
});
