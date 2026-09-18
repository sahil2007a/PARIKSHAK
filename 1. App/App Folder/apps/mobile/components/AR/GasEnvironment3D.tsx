import React, { useEffect, useRef, useState } from 'react';
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
  Wind,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Users,
  CheckCircle2,
  HardHat,
  Lock,
  ArrowRight,
  Sparkles,
  Layers,
  Volume2,
  Sliders,
  Check
} from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import {
  GasSafetyController,
  GasAtmosphereState,
  PPEEquippedState
} from '../../engine/GasSafetyController';
import { GAS_SCENARIO_LAYOUT } from '../../engine/MiningScenarioSpawner';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GasEnvironment3DProps {
  gasController: GasSafetyController;
  currentStepIndex: number;
  onStepComplete: (stepKey: string, isSafe: boolean) => void;
  language: string;
}

export const GasEnvironment3D: React.FC<GasEnvironment3DProps> = ({
  gasController,
  currentStepIndex,
  onStepComplete,
  language
}) => {
  const [atmosphere, setAtmosphere] = useState<GasAtmosphereState>(
    gasController.getAtmosphereState()
  );
  const [ppe, setPpe] = useState<PPEEquippedState>(gasController.getPPEState());
  const [isDetectorInspected, setIsDetectorInspected] = useState(false);
  const [isBuddyPaired, setIsBuddyPaired] = useState(false);
  const [isCordonDeployed, setIsCordonDeployed] = useState(false);
  const [entryBlockedMsg, setEntryBlockedMsg] = useState<string | null>(null);

  // Animations
  const gasVaporScale1 = useRef(new Animated.Value(1)).current;
  const gasVaporScale2 = useRef(new Animated.Value(0.85)).current;
  const gasDrift = useRef(new Animated.Value(0)).current;
  const zoneCordonPulse = useRef(new Animated.Value(1)).current;
  const alarmLedPulse = useRef(new Animated.Value(1)).current;
  const lifelinePulse = useRef(new Animated.Value(0.6)).current;

  // 1. Subscribe to GasSafetyController
  useEffect(() => {
    const unsubscribe = gasController.subscribe((state, ppeState) => {
      setAtmosphere({ ...state });
      setPpe({ ...ppeState });
    });
    return unsubscribe;
  }, [gasController]);

  // 2. Gas vapor swirling & atmosphere animation loop
  useEffect(() => {
    // Vapor Cloud 1 expansion
    Animated.loop(
      Animated.sequence([
        Animated.timing(gasVaporScale1, { toValue: 1.28, duration: 900, useNativeDriver: true }),
        Animated.timing(gasVaporScale1, { toValue: 0.92, duration: 900, useNativeDriver: true })
      ])
    ).start();

    // Vapor Cloud 2 turbulent swirling
    Animated.loop(
      Animated.sequence([
        Animated.timing(gasVaporScale2, { toValue: 0.8, duration: 750, useNativeDriver: true }),
        Animated.timing(gasVaporScale2, { toValue: 1.22, duration: 750, useNativeDriver: true })
      ])
    ).start();

    // Gas rising & drifting horizontally
    Animated.loop(
      Animated.sequence([
        Animated.timing(gasDrift, { toValue: -35, duration: 1700, useNativeDriver: true }),
        Animated.timing(gasDrift, { toValue: 0, duration: 80, useNativeDriver: true })
      ])
    ).start();

    // IDLH hazard perimeter pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(zoneCordonPulse, { toValue: 1.12, duration: 800, useNativeDriver: true }),
        Animated.timing(zoneCordonPulse, { toValue: 0.94, duration: 800, useNativeDriver: true })
      ])
    ).start();

    // Detector High Alarm LED blinking
    Animated.loop(
      Animated.sequence([
        Animated.timing(alarmLedPulse, { toValue: 0.2, duration: 350, useNativeDriver: true }),
        Animated.timing(alarmLedPulse, { toValue: 1, duration: 350, useNativeDriver: true })
      ])
    ).start();

    // Lifeline glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(lifelinePulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(lifelinePulse, { toValue: 0.5, duration: 900, useNativeDriver: true })
      ])
    ).start();
  }, []);

  // Handlers
  const handleInspectDetector = () => {
    setIsDetectorInspected(true);
    gasController.equipPPE('gasDetector');
    if (Platform.OS !== 'web') Vibration.vibrate(60);
    onStepComplete('INSPECT_GAS_DETECTOR', true);
  };

  const handleEquipPPEItem = (item: keyof PPEEquippedState) => {
    gasController.equipPPE(item);
    if (Platform.OS !== 'web') Vibration.vibrate(40);
    if (item === 'scbaRespirator') {
      onStepComplete('EQUIP_SCBA_PPE', true);
    }
  };

  const handlePairBuddy = () => {
    setIsBuddyPaired(true);
    gasController.connectBuddyLifeline();
    if (Platform.OS !== 'web') Vibration.vibrate([0, 60, 40, 60]);
    onStepComplete('ACTIVATE_BUDDY_SYSTEM', true);
  };

  const handleTryConfinedSpaceEntry = () => {
    const check = gasController.canEnterConfinedSpace();
    if (!check.permitted) {
      setEntryBlockedMsg(check.reason);
      if (Platform.OS !== 'web') Vibration.vibrate(200);
      setTimeout(() => setEntryBlockedMsg(null), 3000);
      onStepComplete('PROHIBIT_UNSAFE_ENTRY', true); // User recognized entry is unsafe
    } else {
      onStepComplete('SAFE_MUSTER_RETREAT', true);
    }
  };

  const handleDeployCordonAndEvacuate = () => {
    setIsCordonDeployed(true);
    gasController.triggerIsolationAndVentilation();
    if (Platform.OS !== 'web') Vibration.vibrate(100);
    onStepComplete('SAFE_MUSTER_RETREAT', true);
  };

  const cloudOpacity = Math.max(0.15, atmosphere.leakIntensity * 0.75);

  return (
    <View style={styles.worldContainer} pointerEvents="box-none">
      {/* ========================================================================= */}
      {/* 3D PERSPECTIVE ENVIRONMENT (ANCHORED ROOT TO PLANE)                      */}
      {/* ========================================================================= */}
      <View style={styles.anchored3DWorld} pointerEvents="box-none">
        {/* 1. Concentric Hazard Zone Rings on Floor Platform */}
        <View style={styles.concentricHazardZones}>
          {/* Outer Safe Zone (Green) */}
          <View style={styles.outerSafeZoneRing}>
            <Text style={styles.zoneRingLabel}>/// SAFE MUSTER ZONE ///</Text>
          </View>

          {/* Middle Caution Zone (Amber) */}
          <View style={styles.middleCautionZoneRing}>
            <Text style={styles.cautionRingLabel}>CAUTION: 10% LEL BOUNDARY</Text>
          </View>

          {/* Inner IDLH Exclusion Zone (Red/Black Chevrons) */}
          <Animated.View
            style={[
              styles.innerIdlhZoneRing,
              {
                borderColor: atmosphere.hazardStatus === 'SAFE' ? '#10B981' : '#EF4444',
                transform: [{ scale: zoneCordonPulse }]
              }
            ]}
          >
            <Text style={styles.idlhRingLabel}>
              {atmosphere.isLeakActive
                ? '⚠️ IDLH EXCLUSION ZONE — DO NOT ENTER WITHOUT SCBA & PERMIT ⚠️'
                : '/// PIPELINE ISOLATED & VENTILATION IN PROGRESS ///'}
            </Text>
          </Animated.View>
        </View>

        {/* 2. LEAKING HIGH-PRESSURE PIPE FLANGE & VALVE MANIFOLD ({ x: 0, z: -1.6 }) */}
        <View style={styles.leakingPipeContainer}>
          {/* Steel Manifold Structure */}
          <View style={styles.pipeSegmentH} />
          <View style={styles.flangeAssembly}>
            <View style={styles.flangePlateLeft} />
            <View style={styles.flangeGasketGap} />
            <View style={styles.flangePlateRight} />
            <View style={styles.boltNutTop} />
            <View style={styles.boltNutBottom} />
          </View>

          {/* High-Pressure Wheel Valve */}
          <TouchableOpacity
            style={[
              styles.valveWheelCircle,
              isCordonDeployed && styles.valveWheelIsolated
            ]}
            onPress={handleDeployCordonAndEvacuate}
            activeOpacity={0.8}
          >
            <View style={styles.valveSpokeH} />
            <View style={styles.valveSpokeV} />
            <Text style={styles.valveWheelText}>
              {isCordonDeployed ? 'ISOLATED' : 'VALVE #2'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.pipeGroundTag}>HIGH-PRESSURE SULFUR/CH4 PIPELINE</Text>

          {/* =================================================================== */}
          {/* VOLUMETRIC-LOOKING TOXIC GAS PLUME (SWIRLING IN 3D SPACE)           */}
          {/* =================================================================== */}
          {atmosphere.isLeakActive && (
            <View style={styles.gasCloudAnchor} pointerEvents="none">
              {/* Outer Translucent Sulfur Vapor Cloud */}
              <Animated.View
                style={[
                  styles.outerVaporHaze,
                  {
                    opacity: cloudOpacity,
                    transform: [
                      { scale: gasVaporScale1 },
                      { translateY: gasDrift }
                    ]
                  }
                ]}
              >
                <View style={styles.sulfurVaporParticle1} />
                <View style={styles.sulfurVaporParticle2} />
              </Animated.View>

              {/* Inner Swirling Toxic Mist */}
              <Animated.View
                style={[
                  styles.innerToxicMist,
                  {
                    opacity: cloudOpacity * 1.2,
                    transform: [
                      { scale: gasVaporScale2 },
                      { translateY: Animated.multiply(gasDrift, 0.7) }
                    ]
                  }
                ]}
              >
                <View style={styles.toxicMistPuff} />
                <View style={styles.toxicMistPuff2} />
              </Animated.View>

              {/* Warning Hazard Beacon */}
              <View style={styles.gasLeakWarningPill}>
                <Wind size={12} color="#EF4444" />
                <Text style={styles.gasLeakPillText}>CH4 / H2S LEAK: 35 PPM</Text>
              </View>
            </View>
          )}
        </View>

        {/* 3. CONFINED SPACE ENTRANCE SHAFT ({ x: -1.3, z: -2.0 }) */}
        <TouchableOpacity
          style={styles.confinedShaftContainer}
          onPress={handleTryConfinedSpaceEntry}
          activeOpacity={0.85}
        >
          {/* Shaft Collar Rim */}
          <View style={styles.shaftCollarRim}>
            <View style={styles.shaftInnerDarkness}>
              <View style={styles.ladderRung1} />
              <View style={styles.ladderRung2} />
              <View style={styles.ladderRung3} />
            </View>
          </View>

          {/* Manhole Heavy Safety Sign */}
          <View style={styles.confinedSpaceSign}>
            <Lock size={12} color="#FFD700" />
            <Text style={styles.confinedSignHeader}>DANGER</Text>
            <Text style={styles.confinedSignSub}>CONFINED SPACE</Text>
            <Text style={styles.confinedSignMicro}>PERMIT REQUIRED FOR ENTRY</Text>
          </View>

          {entryBlockedMsg && (
            <View style={styles.entryRefusedPopup}>
              <AlertTriangle size={14} color="#FFFFFF" />
              <Text style={styles.entryRefusedText}>{entryBlockedMsg}</Text>
            </View>
          )}

          <Text style={styles.assetGroundLabel}>VENTILATION SHAFT #7</Text>
        </TouchableOpacity>

        {/* 4. 3D STANDBY BUDDY WORKER AVATAR ({ x: 1.3, z: 0.2 }) */}
        <TouchableOpacity
          style={styles.buddyWorkerContainer}
          onPress={handlePairBuddy}
          activeOpacity={0.85}
        >
          {/* High-Vis Hard Hat */}
          <View style={styles.buddyHardHat}>
            <View style={styles.hardHatBrim} />
          </View>

          {/* Avatar Face / Eyes */}
          <View style={styles.buddyHead} />

          {/* High-Vis Reflective Vest & Torso */}
          <View style={styles.buddyTorso}>
            <View style={styles.buddyReflectiveStripeH} />
            <View style={styles.buddyReflectiveStripeV1} />
            <View style={styles.buddyReflectiveStripeV2} />
            <Radio size={12} color="#00F2FE" style={styles.buddyRadioIcon} />
          </View>

          {/* Standing Legs */}
          <View style={styles.buddyLegsRow}>
            <View style={styles.buddyLeg} />
            <View style={styles.buddyLeg} />
          </View>

          {/* Safety Tether Lifeline Cable connecting to Trainee */}
          <Animated.View
            style={[
              styles.lifelineTetherCable,
              { opacity: lifelinePulse, borderColor: isBuddyPaired ? '#10B981' : '#F59E0B' }
            ]}
          />

          <View style={[styles.buddyBadge, isBuddyPaired && styles.buddyBadgeActive]}>
            <Users size={12} color="#FFFFFF" />
            <Text style={styles.buddyBadgeText}>
              {isBuddyPaired ? 'BUDDY PAIRED · COMMS ACTIVE' : 'TAP TO PAIR BUDDY'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* 5. 3D PPE EMERGENCY GEAR LOCKER ({ x: 1.4, z: -1.4 }) */}
        <View style={styles.ppeLockerContainer}>
          <View style={styles.lockerHeaderRoof}>
            <Text style={styles.lockerHeaderText}>PPE STATION</Text>
          </View>

          <View style={styles.lockerCompartments}>
            {/* Hard Hat Shelf */}
            <TouchableOpacity
              style={[styles.ppeShelfItem, ppe.hardHat && styles.ppeShelfItemEquipped]}
              onPress={() => handleEquipPPEItem('hardHat')}
              activeOpacity={0.8}
            >
              <HardHat size={16} color={ppe.hardHat ? '#10B981' : '#FFD700'} />
              <Text style={styles.ppeItemLabel}>HELMET</Text>
              {ppe.hardHat && <Check size={12} color="#10B981" />}
            </TouchableOpacity>

            {/* Safety Goggles / High-Vis Vest */}
            <TouchableOpacity
              style={[styles.ppeShelfItem, ppe.highVisVest && styles.ppeShelfItemEquipped]}
              onPress={() => handleEquipPPEItem('highVisVest')}
              activeOpacity={0.8}
            >
              <ShieldCheck size={16} color={ppe.highVisVest ? '#10B981' : '#00F2FE'} />
              <Text style={styles.ppeItemLabel}>VEST</Text>
              {ppe.highVisVest && <Check size={12} color="#10B981" />}
            </TouchableOpacity>

            {/* SCBA Breathing Apparatus */}
            <TouchableOpacity
              style={[styles.ppeShelfItem, ppe.scbaRespirator && styles.ppeShelfItemEquipped]}
              onPress={() => handleEquipPPEItem('scbaRespirator')}
              activeOpacity={0.8}
            >
              <ShieldAlert size={16} color={ppe.scbaRespirator ? '#10B981' : '#EF4444'} />
              <Text style={styles.ppeItemLabel}>SCBA</Text>
              {ppe.scbaRespirator && <Check size={12} color="#10B981" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. 3D PORTABLE MULTI-GAS DETECTOR ({ x: 0.6, z: -0.6 }) */}
        {!isDetectorInspected && (
          <TouchableOpacity
            style={styles.worldGasDetectorAnchor}
            onPress={handleInspectDetector}
            activeOpacity={0.85}
          >
            <View style={styles.detectorSnifferBody}>
              <View style={styles.detectorProbeTip} />
              <View style={styles.detectorLcdWindow}>
                <Text style={styles.detectorLcdText}>18.2%</Text>
              </View>
            </View>
            <View style={styles.detectorTapCallout}>
              <Radio size={12} color="#00F2FE" />
              <Text style={styles.detectorTapText}>TAP 4-GAS DETECTOR</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* ========================================================================= */}
      {/* HANDHELD 4-GAS TELEMETRY MONITOR (ACTIVE WHEN INSPECTED)                 */}
      {/* ========================================================================= */}
      {isDetectorInspected && (
        <View style={styles.handheldDetectorDock}>
          <View style={styles.detectorCardHeader}>
            <View style={styles.detectorTitleRow}>
              <Radio size={16} color="#00F2FE" />
              <Text style={styles.detectorDeviceName}>MSA ALTAIR 4XR · MULTI-GAS</Text>
            </View>
            <Animated.View
              style={[
                styles.highAlarmBlinker,
                { opacity: alarmLedPulse }
              ]}
            >
              <Text style={styles.highAlarmText}>
                {atmosphere.hazardStatus}
              </Text>
            </Animated.View>
          </View>

          {/* 4-Gas Telemetry Grid */}
          <View style={styles.telemetryQuadGrid}>
            {/* O2 Cell */}
            <View
              style={[
                styles.telemetryCell,
                atmosphere.oxygenPercent < 19.5 && styles.telemetryCellDanger
              ]}
            >
              <Text style={styles.gasFormulaText}>O2</Text>
              <Text style={styles.gasValueText}>{atmosphere.oxygenPercent}%</Text>
              <Text style={styles.gasNormText}>SAFE: 19.5-23.5%</Text>
            </View>

            {/* LEL Cell */}
            <View
              style={[
                styles.telemetryCell,
                atmosphere.lelPercent >= 10 && styles.telemetryCellDanger
              ]}
            >
              <Text style={styles.gasFormulaText}>LEL</Text>
              <Text style={styles.gasValueText}>{atmosphere.lelPercent}%</Text>
              <Text style={styles.gasNormText}>LIMIT: &lt;10%</Text>
            </View>

            {/* H2S Cell */}
            <View
              style={[
                styles.telemetryCell,
                atmosphere.h2sPpm >= 10 && styles.telemetryCellDanger
              ]}
            >
              <Text style={styles.gasFormulaText}>H2S</Text>
              <Text style={styles.gasValueText}>{atmosphere.h2sPpm} PPM</Text>
              <Text style={styles.gasNormText}>CEILING: 10 PPM</Text>
            </View>

            {/* CO Cell */}
            <View style={styles.telemetryCell}>
              <Text style={styles.gasFormulaText}>CO</Text>
              <Text style={styles.gasValueText}>{atmosphere.coPpm} PPM</Text>
              <Text style={styles.gasNormText}>WARNING: 35 PPM</Text>
            </View>
          </View>

          {/* Decision Buttons */}
          <View style={styles.detectorActionRow}>
            <TouchableOpacity
              style={styles.prohibitEntryBtn}
              onPress={handleDeployCordonAndEvacuate}
              activeOpacity={0.85}
            >
              <AlertTriangle size={16} color="#FFFFFF" />
              <Text style={styles.prohibitEntryText}>
                PROHIBIT ENTRY · CORDON & EVACUATE UPWIND
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
    justifyContent: 'center',
    overflow: 'hidden'
  },
  anchored3DWorld: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [
      { perspective: 900 },
      { rotateX: '52deg' },
      { translateY: 100 }
    ]
  },
  concentricHazardZones: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  outerSafeZoneRing: {
    width: 380,
    height: 380,
    borderRadius: 190,
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10
  },
  zoneRingLabel: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2
  },
  middleCautionZoneRing: {
    position: 'absolute',
    width: 290,
    height: 290,
    borderRadius: 145,
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8
  },
  cautionRingLabel: {
    color: '#F59E0B',
    fontSize: 8,
    fontWeight: '800'
  },
  innerIdlhZoneRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8
  },
  idlhRingLabel: {
    color: '#EF4444',
    fontSize: 7,
    fontWeight: '900',
    textAlign: 'center'
  },
  leakingPipeContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pipeSegmentH: {
    width: 140,
    height: 26,
    backgroundColor: '#475569',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#334155'
  },
  flangeAssembly: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flangePlateLeft: {
    width: 8,
    height: 48,
    backgroundColor: '#64748B',
    borderRadius: 2
  },
  flangeGasketGap: {
    width: 4,
    height: 44,
    backgroundColor: '#EF4444'
  },
  flangePlateRight: {
    width: 8,
    height: 48,
    backgroundColor: '#64748B',
    borderRadius: 2
  },
  boltNutTop: {
    position: 'absolute',
    top: -4,
    width: 8,
    height: 8,
    backgroundColor: '#CBD5E1',
    borderRadius: 4
  },
  boltNutBottom: {
    position: 'absolute',
    bottom: -4,
    width: 8,
    height: 8,
    backgroundColor: '#CBD5E1',
    borderRadius: 4
  },
  valveWheelCircle: {
    position: 'absolute',
    top: -46,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#EF4444',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  valveWheelIsolated: {
    borderColor: '#10B981'
  },
  valveSpokeH: {
    position: 'absolute',
    width: 32,
    height: 3,
    backgroundColor: '#CBD5E1'
  },
  valveSpokeV: {
    position: 'absolute',
    width: 3,
    height: 32,
    backgroundColor: '#CBD5E1'
  },
  valveWheelText: {
    position: 'absolute',
    bottom: -16,
    color: '#F8FAFC',
    fontSize: 8,
    fontWeight: '800'
  },
  pipeGroundTag: {
    marginTop: 38,
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  gasCloudAnchor: {
    position: 'absolute',
    top: -50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  outerVaporHaze: {
    position: 'absolute',
    width: 140,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(234, 179, 8, 0.35)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sulfurVaporParticle1: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(234, 179, 8, 0.45)'
  },
  sulfurVaporParticle2: {
    position: 'absolute',
    width: 95,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(34, 211, 238, 0.25)'
  },
  innerToxicMist: {
    position: 'absolute',
    width: 80,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(239, 68, 68, 0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  toxicMistPuff: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)'
  },
  toxicMistPuff2: {
    position: 'absolute',
    width: 55,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(245, 158, 11, 0.5)'
  },
  gasLeakWarningPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: -80
  },
  gasLeakPillText: {
    color: '#EF4444',
    fontSize: 9,
    fontWeight: '900'
  },
  confinedShaftContainer: {
    position: 'absolute',
    left: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shaftCollarRim: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: '#EAB308',
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card
  },
  shaftInnerDarkness: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ladderRung1: {
    width: 32,
    height: 3,
    backgroundColor: '#64748B',
    marginBottom: 6
  },
  ladderRung2: {
    width: 32,
    height: 3,
    backgroundColor: '#64748B',
    marginBottom: 6
  },
  ladderRung3: {
    width: 32,
    height: 3,
    backgroundColor: '#64748B'
  },
  confinedSpaceSign: {
    marginTop: 8,
    backgroundColor: '#7F1D1D',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center'
  },
  confinedSignHeader: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900'
  },
  confinedSignSub: {
    color: '#FDE047',
    fontSize: 8,
    fontWeight: '800'
  },
  confinedSignMicro: {
    color: '#E2E8F0',
    fontSize: 6,
    fontWeight: '700'
  },
  entryRefusedPopup: {
    position: 'absolute',
    top: -50,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 170,
    zIndex: 30
  },
  entryRefusedText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    flex: 1
  },
  assetGroundLabel: {
    marginTop: 6,
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '700'
  },
  buddyWorkerContainer: {
    position: 'absolute',
    right: 25,
    top: '38%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buddyHardHat: {
    width: 22,
    height: 14,
    backgroundColor: '#EAB308',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center'
  },
  hardHatBrim: {
    width: 26,
    height: 3,
    backgroundColor: '#CA8A04',
    position: 'absolute',
    bottom: 0
  },
  buddyHead: {
    width: 14,
    height: 12,
    backgroundColor: '#FBCFE8',
    borderRadius: 4
  },
  buddyTorso: {
    width: 32,
    height: 40,
    backgroundColor: '#EA580C',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buddyReflectiveStripeH: {
    width: 32,
    height: 5,
    backgroundColor: '#FEF08A'
  },
  buddyReflectiveStripeV1: {
    position: 'absolute',
    left: 6,
    width: 4,
    height: 40,
    backgroundColor: '#FEF08A'
  },
  buddyReflectiveStripeV2: {
    position: 'absolute',
    right: 6,
    width: 4,
    height: 40,
    backgroundColor: '#FEF08A'
  },
  buddyRadioIcon: {
    position: 'absolute',
    top: 4,
    right: 2
  },
  buddyLegsRow: {
    flexDirection: 'row',
    gap: 6
  },
  buddyLeg: {
    width: 10,
    height: 35,
    backgroundColor: '#1E293B'
  },
  lifelineTetherCable: {
    position: 'absolute',
    width: 100,
    height: 3,
    borderWidth: 1,
    borderStyle: 'dashed',
    top: 35,
    left: -90
  },
  buddyBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderWidth: 1,
    borderColor: '#00F2FE',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  buddyBadgeActive: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)'
  },
  buddyBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800'
  },
  ppeLockerContainer: {
    position: 'absolute',
    right: 20,
    top: '12%',
    width: 75,
    backgroundColor: '#334155',
    borderWidth: 2,
    borderColor: '#475569',
    borderRadius: 6,
    padding: 4
  },
  lockerHeaderRoof: {
    backgroundColor: '#1E293B',
    paddingVertical: 2,
    alignItems: 'center',
    borderRadius: 3,
    marginBottom: 4
  },
  lockerHeaderText: {
    color: '#94A3B8',
    fontSize: 7,
    fontWeight: '900'
  },
  lockerCompartments: {
    gap: 4
  },
  ppeShelfItem: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 4,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2
  },
  ppeShelfItemEquipped: {
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.15)'
  },
  ppeItemLabel: {
    color: '#E2E8F0',
    fontSize: 7,
    fontWeight: '800'
  },
  worldGasDetectorAnchor: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  detectorSnifferBody: {
    width: 34,
    height: 48,
    backgroundColor: '#EAB308',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0F172A',
    alignItems: 'center',
    padding: 3
  },
  detectorProbeTip: {
    width: 8,
    height: 6,
    backgroundColor: '#0F172A',
    borderRadius: 2
  },
  detectorLcdWindow: {
    width: 24,
    height: 16,
    backgroundColor: '#0F172A',
    borderRadius: 3,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  detectorLcdText: {
    color: '#00F2FE',
    fontSize: 8,
    fontWeight: '900'
  },
  detectorTapCallout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: '#00F2FE',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6
  },
  detectorTapText: {
    color: '#00F2FE',
    fontSize: 8,
    fontWeight: '800'
  },
  handheldDetectorDock: {
    position: 'absolute',
    bottom: 25,
    width: SCREEN_WIDTH - 32,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    borderRadius: RADIUS.lg,
    padding: 14,
    ...SHADOWS.card
  },
  detectorCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  detectorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  detectorDeviceName: {
    color: '#00F2FE',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8
  },
  highAlarmBlinker: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  highAlarmText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900'
  },
  telemetryQuadGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  telemetryCell: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center'
  },
  telemetryCellDanger: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.18)'
  },
  gasFormulaText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800'
  },
  gasValueText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '900',
    marginVertical: 2
  },
  gasNormText: {
    color: '#64748B',
    fontSize: 6,
    fontWeight: '700'
  },
  detectorActionRow: {
    flexDirection: 'row'
  },
  prohibitEntryBtn: {
    flex: 1,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8
  },
  prohibitEntryText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5
  }
});
