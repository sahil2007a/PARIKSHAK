import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Clock,
  Sparkles
} from 'lucide-react-native';
import { Button } from '../../components/Button';
import { SafetyChecklist } from '../../components/SafetyChecklist';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../localization/i18n';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useLanguage();
  const [checklistCompleted, setChecklistCompleted] = useState(false);

  // Comprehensive curriculum database for Module 1 (Fire) and Module 2 (Gas Leak)
  const LESSON_DATABASE: Record<string, any> = {
    m1_l1: {
      id: 'm1_l1',
      moduleId: '1',
      moduleNumber: 1,
      order: 1,
      durationMinutes: 10,
      title: 'Fire Chemistry & Industrial Classification (Classes A-D, K)',
      subHeader: 'Lesson 1: Industrial Fuel Classification',
      safetyWarning:
        'CRITICAL: Never use water on Class B (flammable liquids) or Class C (electrical) fires. Water will cause explosive steam vaporization and electrocution.',
      keyPoints: [
        {
          tag: 'Class A: Solid Combustibles',
          title: 'Wood, Paper, Rubber & Coal',
          body: 'Requires cooling agents. Extinguish with water, foam, or multipurpose ABC dry chemical powder.',
          icon: 'A'
        },
        {
          tag: 'Class B: Flammable Liquids',
          title: 'Diesel, Lube Oils & Solvents',
          body: 'Requires smothering. Smother with CO2 or dry chemical powder. NEVER spray pressurized water.',
          icon: 'B'
        },
        {
          tag: 'Class C: Electrical Equipment',
          title: 'Energized Mining Machinery & Control Panels',
          body: 'Requires non-conductive agents. De-energize breaker immediately and use carbon dioxide (CO2).',
          icon: 'C'
        },
        {
          tag: 'Class D: Reactive Metals',
          title: 'Magnesium, Lithium & Titanium Dust',
          body: 'Requires specialized dry flux or dry sand. Conventional extinguishers can intensify the fire violently.',
          icon: 'D'
        }
      ],
      checklist: [
        'Identify fuel classification before picking up extinguisher',
        'Verify wind direction: always approach with back towards fresh airflow',
        'Confirm clear secondary retreat route is behind you'
      ]
    },
    m1_l2: {
      id: 'm1_l2',
      moduleId: '1',
      moduleNumber: 1,
      order: 2,
      durationMinutes: 12,
      title: 'The PASS Technique: Step-by-Step Extinguisher Operation',
      subHeader: 'Lesson 2: PASS Extinguisher Procedure',
      safetyWarning:
        'CRITICAL: If the fire height exceeds standard waste drum size or spreads beyond 2 meters, ABORT suppression immediately, trigger alarm, and evacuate.',
      keyPoints: [
        {
          tag: 'P - Pull Pin',
          title: 'Break Tamper Seal & Pull Ring',
          body: 'Pulling the pin releases the internal lock that prevents accidental discharge while in transit.',
          icon: 'P'
        },
        {
          tag: 'A - Aim Nozzle',
          title: 'Aim at Fuel Base, NOT Rising Flames',
          body: 'Target the burning liquid/solid fuel surface. Aiming into rising smoke or flames will waste chemical agents.',
          icon: 'A'
        },
        {
          tag: 'S - Squeeze Lever',
          title: 'Smooth, Controlled Lever Pressure',
          body: 'Squeezing releases high-pressure CO2/chemical powder. Releasing immediately stops discharge.',
          icon: 'S'
        },
        {
          tag: 'S - Sweep Side-to-Side',
          title: 'Sweep 6 to 8 Feet Across the Hazard',
          body: 'Sweep horizontally across the base of the fire until all active flame combustion is suppressed.',
          icon: 'S'
        }
      ],
      checklist: [
        'Inspect pressure gauge (needle in green zone)',
        'Stand 2 to 3 meters (6-8 feet) back from the flame hazard',
        'Confirm fire class matches extinguisher code (ABC / CO2)'
      ]
    },
    m1_l3: {
      id: 'm1_l3',
      moduleId: '1',
      moduleNumber: 1,
      order: 3,
      durationMinutes: 10,
      title: 'Underground Mine Ventilation & Methane Explosion Prevention',
      subHeader: 'Lesson 3: Explosion Mitigation',
      safetyWarning:
        'DGMS MANDATE: If methane concentration in the general body of air exceeds 1.25%, cut electrical power and evacuate the section immediately.',
      keyPoints: [
        {
          tag: 'Airflow Velocity',
          title: 'Maintain 0.5 m/s Air Velocity',
          body: 'Positive airflow prevents methane layering along the roof of underground mine drifts.',
          icon: 'V'
        },
        {
          tag: 'Stone Dust Barriers',
          title: 'Dispersible Stone Dusting (75% Incombustible)',
          body: 'Stone dust absorbs combustion heat and quenches coal dust explosion wave propagation.',
          icon: 'D'
        },
        {
          tag: 'Continuous Monitoring',
          title: 'Methane & Carbon Monoxide Sensor Log',
          body: 'Continuous methanometers must be bump-tested and logged prior to production shift commencement.',
          icon: 'M'
        }
      ],
      checklist: [
        'Inspect brattice cloth ventilation partitions for tears',
        'Verify flameproof enclosure seals on high-voltage equipment',
        'Ensure stone dust barrier trays are unobstructed'
      ]
    },
    m2_l1: {
      id: 'm2_l1',
      moduleId: '2',
      moduleNumber: 2,
      order: 1,
      durationMinutes: 12,
      title: 'Atmospheric Hazards: CH4, H2S, CO & Flammability Limits (LEL/UEL)',
      subHeader: 'Lesson 1: Toxic Gases & Explosive Thresholds',
      safetyWarning:
        'CRITICAL: Hydrogen Sulfide (H2S) paralyzes olfactory nerves in seconds at high levels. NEVER rely on smell to judge atmospheric safety.',
      keyPoints: [
        {
          tag: 'LEL Combustible Limit',
          title: '10% LEL Maximum Entry Ceiling',
          body: 'Methane has 5% lower explosive limit. Any reading above 10% LEL (0.5% vol) is strictly prohibited from entry.',
          icon: 'L'
        },
        {
          tag: 'H2S Toxic Ceiling',
          title: '10 PPM Ceiling (100 PPM IDLH)',
          body: 'Heavier than air, settles in low sumps and shafts. Causes rapid pulmonary edema and cellular asphyxiation.',
          icon: 'S'
        },
        {
          tag: 'Oxygen Sufficiency',
          title: '19.5% to 23.5% Oxygen Mandatory',
          body: 'Below 19.5% oxygen leads to impaired motor function. Below 16% leads to loss of consciousness within minutes.',
          icon: 'O'
        }
      ],
      checklist: [
        'Calibrated multi-gas detector sample reading: O2 >= 19.5%',
        'LEL reading confirmed under 10% before crossing cordon',
        'Toxic gas levels zeroed in clean ambient atmospheric air'
      ]
    },
    m2_l2: {
      id: 'm2_l2',
      moduleId: '2',
      moduleNumber: 2,
      order: 2,
      durationMinutes: 10,
      title: 'Multi-Gas Detector Bump Testing & Real-time Alarm Interpretation',
      subHeader: 'Lesson 2: Gas Detection Procedures',
      safetyWarning:
        'MANDATORY: Daily bump test with certified calibration gas canister is required before entering any industrial shaft or plant zone.',
      keyPoints: [
        {
          tag: 'Bump Test Execution',
          title: 'Sensor Response Verification',
          body: 'Expose all 4 sensors to test gas to confirm audible siren, flashing LED strobes, and vibration activate within 10 seconds.',
          icon: 'B'
        },
        {
          tag: 'Stratified Sampling',
          title: 'Sample Top, Middle and Bottom Levels',
          body: 'Methane is light (rises to top), Carbon Monoxide mixes evenly, H2S is heavy (sinks to the sump floor).',
          icon: 'T'
        },
        {
          tag: 'Aspiration Draw Probe',
          title: 'Pre-Entry Remote Sampling',
          body: 'Use motorized sampling pump with 10-foot rigid probe before opening manhole cover or stepping inside.',
          icon: 'P'
        }
      ],
      checklist: [
        'Check battery status (minimum 8 hours operational runtime)',
        'Verify sensor dust/water filter is dry and uncontaminated',
        'Confirm calibration expiration date on detector chassis'
      ]
    },
    m2_l3: {
      id: 'm2_l3',
      moduleId: '2',
      moduleNumber: 2,
      order: 3,
      durationMinutes: 14,
      title: 'Confined Space Entry: SCBA Inspection, Tripod Lifeline & Buddy System',
      subHeader: 'Lesson 3: Confined Space Protocol',
      safetyWarning:
        'LIFE SAFETY RULE: Over 60% of confined space fatalities are would-be rescuers. The Standby Buddy must NEVER enter without authorized team backup.',
      keyPoints: [
        {
          tag: 'SCBA Equipment',
          title: 'Positive-Pressure Breathing Apparatus',
          body: 'Mandatory for IDLH atmospheres. Cartridge respirators do NOT supply oxygen and provide zero protection.',
          icon: 'P'
        },
        {
          tag: 'Tripod & Winch',
          title: 'Mechanical Retrieval Lifeline Attached',
          body: 'Worker wears full-body harness continuously clipped to stainless steel non-entry retrieval winch cable.',
          icon: 'W'
        },
        {
          tag: 'Buddy System',
          title: 'Dedicated Outside Standby Attendant',
          body: 'Maintains constant voice/radio contact, monitors entrant air supply, and initiates non-entry rescue on emergency.',
          icon: 'B'
        }
      ],
      checklist: [
        'SCBA cylinder pressure verified above 200 bar (90% capacity)',
        'Positive-seal facepiece check verified with regulator flow',
        'Confined space entry permit signed by supervisor and buddy'
      ]
    }
  };

  // Determine current lesson data or fallback
  const lessonKey = (id || 'm1_l2').toLowerCase();
  const lessonData =
    LESSON_DATABASE[lessonKey] ||
    (lessonKey.includes('gas') || lessonKey.startsWith('m2')
      ? LESSON_DATABASE['m2_l1']
      : LESSON_DATABASE['m1_l2']);

  const isGasLeakModule =
    lessonData.moduleId === '2' ||
    lessonKey.startsWith('m2') ||
    lessonKey.includes('gas');
  const targetModuleId = isGasLeakModule ? '2' : '1';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>{lessonData.subHeader}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lessonTitle}>{lessonData.title}</Text>

        <View style={styles.metaRow}>
          <Clock size={12} color={COLORS.mutedText} />
          <Text style={styles.metaText}>{lessonData.durationMinutes} {'mins • ' + t('lesson.verifiedCurriculumGuide', 'Verified Curriculum Guide')}</Text>
        </View>

        {/* Safety Warning Callout */}
        <View style={styles.warningBox}>
          <View style={styles.warningHeader}>
            <AlertTriangle size={16} color={COLORS.danger} />
            <Text style={styles.warningTitle}>{t('lesson.safetyRule', 'Industrial Safety Rule')}</Text>
          </View>
          <Text style={styles.warningBody}>{lessonData.safetyWarning}</Text>
        </View>

        {/* Key Safety Points */}
        <Text style={styles.sectionHeader}>{t('lesson.executionStandards', 'Procedural Execution Standards')}</Text>

        <View style={styles.pointsList}>
          {lessonData.keyPoints.map((point: any, idx: number) => (
            <View key={idx} style={styles.pointCard}>
              <View style={styles.pointIconBadge}>
                <Text style={styles.pointIconText}>{point.icon}</Text>
              </View>

              <View style={styles.pointContent}>
                <Text style={styles.pointTag}>{point.tag}</Text>
                <Text style={styles.pointTitle}>{point.title}</Text>
                <Text style={styles.pointBody}>{point.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Safety Checklist */}
        <SafetyChecklist
          title="Mandatory Pre-Action Safety Checklist"
          items={lessonData.checklist}
          onAllCompleted={() => setChecklistCompleted(true)}
        />

        {/* Bottom CTA Options */}
        <View style={styles.ctaBox}>
          <Button
            title={
              isGasLeakModule
                ? '☣️ Launch Real Camera AR Gas Leak Drill →'
                : '🔥 Launch Real Camera AR Fire Drill →'
            }
            onPress={() =>
              router.push(isGasLeakModule ? '/ar-training/2' : '/ar-training/1')
            }
            size="lg"
          />

          <TouchableOpacity
            style={styles.quizCtaButton}
            onPress={() => router.push(`/assessment/${targetModuleId}`)}
            activeOpacity={0.85}
          >
            <CheckCircle2 size={16} color={COLORS.primary} />
            <Text style={styles.quizCtaText}>{t('lesson.takeQuiz', 'Take Certification Quiz Assessment →')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 6,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9EFEF'
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.darkText
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.darkText,
    lineHeight: 26,
    marginBottom: 6
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16
  },
  metaText: {
    fontSize: 12,
    color: COLORS.mutedText,
    fontWeight: '600'
  },
  warningBox: {
    backgroundColor: '#FDEDEC',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#FADBD8',
    marginBottom: 20
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4
  },
  warningTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.danger
  },
  warningBody: {
    fontSize: 12,
    color: '#78281F',
    lineHeight: 18
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 12
  },
  pointsList: {
    gap: 12,
    marginBottom: 20
  },
  pointCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8E6',
    ...SHADOWS.sm
  },
  pointIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pointIconText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.primary
  },
  pointContent: {
    flex: 1
  },
  pointTag: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  pointTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkText,
    marginTop: 2
  },
  pointBody: {
    fontSize: 12,
    color: COLORS.mutedText,
    lineHeight: 17,
    marginTop: 4
  },
  ctaBox: {
    marginTop: 16,
    marginBottom: 20,
    gap: 10
  },
  quizCtaButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: 13,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...SHADOWS.sm
  },
  quizCtaText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary
  }
});
