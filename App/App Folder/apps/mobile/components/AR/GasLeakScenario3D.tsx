import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  Wind,
  ShieldAlert,
  Users,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { ARActionType } from '@parishak/shared';
import { GasEnvironment3D } from './GasEnvironment3D';
import { GasSafetyController } from '../../engine/GasSafetyController';

interface GasLeakScenario3DProps {
  currentStepIndex: number;
  onExecuteAction: (actionType: ARActionType, isSafe: boolean) => void;
  language: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const GasLeakScenario3D: React.FC<GasLeakScenario3DProps> = ({
  currentStepIndex,
  onExecuteAction,
  language
}) => {
  const [gasController] = useState(() => new GasSafetyController());

  const handleStepCompleteFrom3D = (stepKey: string, isSafe: boolean) => {
    if (stepKey === 'INSPECT_GAS_DETECTOR') {
      onExecuteAction('INSPECT_GAS_DETECTOR', isSafe);
    } else if (stepKey === 'PROHIBIT_UNSAFE_ENTRY') {
      onExecuteAction('PROHIBIT_UNSAFE_ENTRY', isSafe);
    } else if (stepKey === 'EQUIP_SCBA_PPE') {
      onExecuteAction('EQUIP_SCBA_PPE', isSafe);
    } else if (stepKey === 'ACTIVATE_BUDDY_SYSTEM') {
      onExecuteAction('ACTIVATE_BUDDY_SYSTEM', isSafe);
    } else if (stepKey === 'SAFE_MUSTER_RETREAT') {
      onExecuteAction('SAFE_MUSTER_RETREAT', isSafe);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Full Spatial 3D Gas Environment Anchored to Plane */}
      <GasEnvironment3D
        gasController={gasController}
        currentStepIndex={currentStepIndex}
        onStepComplete={handleStepCompleteFrom3D}
        language={language}
      />

      {/* 2. Step 2: Hazard Decision / Confined Space Prohibit Unsafe Entry Decision Modal */}
      {currentStepIndex === 2 && (
        <View style={styles.actionModal}>
          <View style={styles.modalHeaderRow}>
            <AlertTriangle size={18} color="#EF4444" />
            <Text style={styles.actionModalTitle}>Step 3: Confined Space Entry Decision</Text>
          </View>
          <Text style={styles.actionModalSub}>
            Atmosphere is severely toxic (LEL: 14% &gt; 10% limit, H2S: 35 PPM &gt; 10 PPM ceiling). What is the authoritative safety command?
          </Text>

          <View style={styles.modalButtonsColumn}>
            <TouchableOpacity
              style={styles.actionOptionButton}
              onPress={() => onExecuteAction('PROHIBIT_UNSAFE_ENTRY', true)}
              activeOpacity={0.8}
            >
              <CheckCircle2 size={16} color="#FFFFFF" />
              <Text style={styles.actionOptionText}>
                PROHIBIT ENTRY: Cordon Zone, Cut Power & Notify Control Room
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionOptionButton, styles.dangerOptionButton]}
              onPress={() => onExecuteAction('PROHIBIT_UNSAFE_ENTRY', false)}
              activeOpacity={0.8}
            >
              <Text style={styles.dangerOptionText}>
                Enter quickly without SCBA to close the valve (FATAL ERROR)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill as any,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionModal: {
    position: 'absolute',
    top: 90,
    width: SCREEN_WIDTH - 32,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: RADIUS.lg,
    padding: 14,
    ...SHADOWS.card
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  actionModalTitle: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  actionModalSub: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10
  },
  modalButtonsColumn: {
    gap: 8
  },
  actionOptionButton: {
    backgroundColor: '#0EA5E9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  actionOptionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    flex: 1
  },
  dangerOptionButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444'
  },
  dangerOptionText: {
    color: '#FCA5A5',
    fontSize: 10,
    fontWeight: '700',
    flex: 1
  }
});
