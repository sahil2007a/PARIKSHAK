import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  Flame,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  DoorOpen,
  LogOut,
  Wind
} from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { ARActionType } from '@parishak/shared';
import { MiningEnvironment3D } from './MiningEnvironment3D';
import { FireController } from '../../engine/FireController';

interface FireScenario3DProps {
  currentStepIndex: number;
  onExecuteAction: (actionType: ARActionType, isSafe: boolean) => void;
  language: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const FireScenario3D: React.FC<FireScenario3DProps> = ({
  currentStepIndex,
  onExecuteAction,
  language
}) => {
  const [fireController] = useState(() => new FireController(1.0));

  const handleStepCompleteFrom3D = (stepKey: string, isSafe: boolean) => {
    if (stepKey === 'SELECT_EXTINGUISHER') {
      onExecuteAction('SELECT_EXTINGUISHER', isSafe);
    } else if (stepKey === 'PASS_SWEEP_FLAME') {
      onExecuteAction('PASS_SWEEP_FLAME', isSafe);
    } else if (stepKey === 'REACH_ASSEMBLY_POINT') {
      onExecuteAction('REACH_ASSEMBLY_POINT', isSafe);
    } else if (stepKey === 'IDENTIFY_EMERGENCY_EXIT') {
      onExecuteAction('IDENTIFY_EMERGENCY_EXIT', isSafe);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Full Spatial 3D Mining Environment Anchored to Plane */}
      <MiningEnvironment3D
        fireController={fireController}
        currentStepIndex={currentStepIndex}
        onStepComplete={handleStepCompleteFrom3D}
        language={language}
      />

      {/* 2. Step 1: Emergency Exit Spatial Verification Prompt */}
      {currentStepIndex === 1 && (
        <View style={styles.actionModal}>
          <View style={styles.modalHeaderRow}>
            <DoorOpen size={18} color="#00F2FE" />
            <Text style={styles.actionModalTitle}>Step 2: Emergency Exit Verification</Text>
          </View>
          <Text style={styles.actionModalSub}>
            Mining & Industrial Rule #1: Before tackling any fire, always identify your escape route so you cannot be trapped!
          </Text>

          <View style={styles.modalButtonsColumn}>
            <TouchableOpacity
              style={styles.actionOptionButton}
              onPress={() => onExecuteAction('IDENTIFY_EMERGENCY_EXIT', true)}
              activeOpacity={0.85}
            >
              <CheckCircle2 size={16} color="#FFFFFF" />
              <Text style={styles.actionOptionText}>
                Confirm Emergency Exit Behind Me is Clear & Unobstructed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionOptionButton, styles.dangerOptionButton]}
              onPress={() => onExecuteAction('IDENTIFY_EMERGENCY_EXIT', false)}
              activeOpacity={0.8}
            >
              <AlertOctagon size={16} color="#EF4444" />
              <Text style={styles.dangerOptionText}>
                Ignore exit, rush into corner without retreat route (FATAL ERROR)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 3. Step 2: Extinguisher Agent Type Confirmation Card */}
      {currentStepIndex === 2 && (
        <View style={styles.extinguisherRack}>
          <Text style={styles.rackTitle}>Step 3: Select Extinguisher from Rack / 3D Scene</Text>
          <Text style={styles.rackSub}>
            Burning diesel is Class B (Flammable Liquid). Tap the ABC extinguisher in the 3D scene or choose below:
          </Text>
          <View style={styles.rackRow}>
            {/* ABC Dry Chemical Extinguisher */}
            <TouchableOpacity
              style={[styles.extinguisherCard, styles.extinguisherCardSelected]}
              onPress={() => onExecuteAction('SELECT_EXTINGUISHER', true)}
              activeOpacity={0.8}
            >
              <View style={[styles.extinguisherCylinder, { backgroundColor: '#C0392B' }]}>
                <View style={styles.blueBand} />
                <Text style={styles.cylinderLabel}>ABC POWDER</Text>
              </View>
              <Text style={styles.extinguisherName}>ABC Dry Powder</Text>
              <Text style={styles.extinguisherSub}>Smothers Liquid & Electrical</Text>
            </TouchableOpacity>

            {/* Pressurized Water Extinguisher */}
            <TouchableOpacity
              style={[styles.extinguisherCard, styles.extinguisherCardDanger]}
              onPress={() => onExecuteAction('SELECT_EXTINGUISHER', false)}
              activeOpacity={0.8}
            >
              <View style={[styles.extinguisherCylinder, { backgroundColor: '#2980B9' }]}>
                <Text style={styles.cylinderLabel}>WATER</Text>
              </View>
              <Text style={styles.extinguisherName}>Water Type</Text>
              <Text style={[styles.extinguisherSub, { color: '#EF4444' }]}>
                Prohibited for Class B!
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
    borderColor: 'rgba(0, 242, 254, 0.35)',
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
    color: '#00F2FE',
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
  },
  extinguisherRack: {
    position: 'absolute',
    top: 90,
    width: SCREEN_WIDTH - 32,
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    borderRadius: RADIUS.lg,
    padding: 14,
    ...SHADOWS.card
  },
  rackTitle: {
    color: '#00F2FE',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2
  },
  rackSub: {
    color: '#94A3B8',
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 10
  },
  rackRow: {
    flexDirection: 'row',
    gap: 10
  },
  extinguisherCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center'
  },
  extinguisherCardSelected: {
    borderColor: '#00F2FE',
    backgroundColor: 'rgba(0, 242, 254, 0.1)'
  },
  extinguisherCardDanger: {
    borderColor: 'rgba(239, 68, 68, 0.4)'
  },
  extinguisherCylinder: {
    width: 32,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  blueBand: {
    position: 'absolute',
    width: 32,
    height: 10,
    backgroundColor: '#0284C7'
  },
  cylinderLabel: {
    color: '#FFFFFF',
    fontSize: 6,
    fontWeight: '900',
    textAlign: 'center'
  },
  extinguisherName: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '800'
  },
  extinguisherSub: {
    color: '#94A3B8',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 2
  }
});
