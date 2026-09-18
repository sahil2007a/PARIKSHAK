import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ImageBackground
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Eye,
  Flame,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Compass,
  X,
  Info,
  Layers,
  Check,
  Calendar
} from 'lucide-react-native';
import { Header } from '../../../components/Header';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../../constants/theme';
import { mobileApi } from '../../../services/api';
import { useLanguage } from '../../../localization/i18n';
import { CURRICULUM_DATA, getModuleCurriculum, normalizeModuleId, ARDrillData } from '../../../data/curriculumData';

export default function ARTrainingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const moduleId = normalizeModuleId(id);
  const { t, resolveLocalizedText, currentLanguage } = useLanguage();

  const curriculum = getModuleCurriculum(moduleId);
  const isComingSoon = Boolean(curriculum.isComingSoon || (moduleId !== '1' && moduleId !== '2'));

  const [loading, setLoading] = useState(true);
  const [completedArList, setCompletedArList] = useState<number[]>([]);
  const [activeDrillModal, setActiveDrillModal] = useState<ARDrillData | null>(null);

  const loadProgress = async () => {
    try {
      const data = await mobileApi.getVocationalProgress(moduleId);
      if (data && Array.isArray(data.completedArChapters)) {
        setCompletedArList(data.completedArChapters);
      }
    } catch {
      // safe fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [moduleId]);

  const handleToggleArCompletion = async (chapterId: number) => {
    let updated: number[];
    if (completedArList.includes(chapterId)) {
      updated = completedArList.filter((c) => c !== chapterId);
    } else {
      updated = [...completedArList, chapterId];
    }
    setCompletedArList(updated);
    try {
      await mobileApi.updateVocationalProgress(moduleId, { completedArChapters: updated });
    } catch {
      // offline handled
    }
  };

  const totalDrills = curriculum.arDrills?.length || 5;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* 1. Common Application Header */}
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. AR Hero Area */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require('../../../assets/hero_banner.jpg')}
            style={styles.heroImageBg}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.arBadge}>
                  <Sparkles size={12} color="#FFFFFF" />
                  <Text style={styles.arBadgeText}>
                    {isComingSoon ? t('comingSoon.badge', 'COMING SOON') : t('ar.heroBadge', 'SPATIAL AUGMENTED REALITY DRILLS')}
                  </Text>
                </View>
              </View>

              <Text style={styles.heroHeadline}>
                {resolveLocalizedText(curriculum.title)} {t('ar.heroTitleSuffix', 'AR Training Simulator')}
              </Text>

              <Text style={styles.heroSubheadline}>
                {isComingSoon ? resolveLocalizedText(curriculum.description) : t('ar.heroSubtitle', 'Practice hands-on emergency drills with real-time camera tracking and interactive spatial overlays.')}
              </Text>

              {/* AR Qualification Summary Strip */}
              {!isComingSoon && (
                <View style={styles.summaryStrip}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryNum}>{completedArList.length} / {totalDrills}</Text>
                    <Text style={styles.summaryLabel}>{t('ar.drillsCompleted', 'Drills Done')}</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryNum}>1 / {totalDrills}</Text>
                    <Text style={styles.summaryLabel}>{t('common.req', 'Required')}</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text
                      style={[
                        styles.summaryNum,
                        completedArList.length >= 1 && { color: '#34D399' }
                      ]}
                    >
                      {completedArList.length >= 1 ? t('common.ready', 'READY') : t('common.onTrack', 'ON TRACK')}
                    </Text>
                    <Text style={styles.summaryLabel}>{t('fundamentals.qualification', 'Status')}</Text>
                  </View>
                </View>
              )}
            </View>
          </ImageBackground>
        </View>

        {isComingSoon ? (
          <View style={styles.comingSoonContainer}>
            <View style={styles.comingSoonCard}>
              <View style={styles.comingSoonIconWrap}>
                <Sparkles size={36} color="#F59E0B" />
              </View>

              <Text style={styles.comingSoonHeading}>
                {t('comingSoon.title', 'Curriculum in Development')}
              </Text>
              <Text style={styles.comingSoonSub}>
                {t('comingSoon.subtitle', 'This training module is currently being authored to industrial safety compliance standards.')}
              </Text>

              {(() => {
                const highlights = curriculum.syllabusHighlights || curriculum.comingSoonDetails?.syllabusHighlights;
                if (!highlights || highlights.length === 0) return null;
                return (
                  <View style={styles.syllabusBox}>
                    <Text style={styles.syllabusTitle}>{t('comingSoon.plannedTopics', 'Planned Topics & AR Drills')}</Text>
                    {highlights.map((topic: any, idx: number) => (
                      <View key={idx} style={styles.topicRow}>
                        <View style={styles.topicBullet} />
                        <Text style={styles.topicText}>{resolveLocalizedText(topic)}</Text>
                      </View>
                    ))}
                  </View>
                );
              })()}

              <View style={styles.releaseDateRow}>
                <Calendar size={15} color="#64748B" />
                <Text style={styles.releaseDateText}>{t('comingSoon.estimatedRelease', 'Expected Q3 2026')}</Text>
              </View>
            </View>
          </View>
        ) : (
          <>
            {/* 3. AR Drills Section Header */}
            <View style={styles.sectionHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>{t('ar.chapterDrills', '5 Chapter AR Drills')}</Text>
                <Text style={styles.sectionSubtitle}>
                  {t('ar.completeToQualify', 'Complete chapter simulation drills to build muscle memory.')}
                </Text>
              </View>
              <View style={[styles.reqBadge, completedArList.length >= 1 && styles.reqBadgeSuccess]}>
                <Text style={[styles.reqBadgeText, completedArList.length >= 1 && styles.reqBadgeTextSuccess]}>
                  {completedArList.length >= 1
                    ? `✓ ${completedArList.length}/${totalDrills} ${t('common.done', 'DONE')}`
                    : `${completedArList.length}/${totalDrills} ${t('common.completed', 'Completed')}`}
                </Text>
              </View>
            </View>

            {/* 4. List of Chapter AR Blocks */}
            <View style={styles.drillsList}>
              {curriculum.arDrills?.map((drill) => {
                const chapterTitle = resolveLocalizedText(drill.chapterTitle || drill.title);
                const description = resolveLocalizedText(drill.drillObjective);

                return (
                  <View
                    key={drill.chapterId}
                    style={styles.drillCard}
                  >
                    <View style={styles.drillTopRow}>
                      <Text style={styles.drillTitle}>
                        {chapterTitle}
                      </Text>
                    </View>

                    <Text style={styles.objectiveText}>
                      {description}
                    </Text>

                    {/* AR Training / Drill Option (Disabled) */}
                    <View style={styles.drillActionRow}>
                      <View
                        style={styles.disabledArBtn}
                        accessibilityRole="button"
                        accessibilityState={{ disabled: true }}
                      >
                        <Sparkles size={16} color="#94A3B8" />
                        <Text style={styles.disabledArBtnText}>
                          {t('ar.trainingDrill', 'AR Training / Drill')}
                        </Text>
                        <View style={styles.inactiveBadge}>
                          <Text style={styles.inactiveBadgeText}>
                            {t('common.inactive', 'Inactive')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Drill Briefing Modal */}
        <Modal
          visible={!!activeDrillModal}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveDrillModal(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {activeDrillModal ? resolveLocalizedText(activeDrillModal.title) : ''}
                </Text>
                <TouchableOpacity
                  onPress={() => setActiveDrillModal(null)}
                  style={styles.closeBtn}
                >
                  <X size={20} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScroll}
              >
                {activeDrillModal && (
                  <>
                    <View style={styles.briefingSection}>
                      <Text style={styles.briefingHeading}>{t('ar.simulationObjective', 'Simulation Objective')}</Text>
                      <Text style={styles.briefingText}>
                        {resolveLocalizedText(activeDrillModal.drillObjective)}
                      </Text>
                    </View>

                    <View style={styles.briefingSection}>
                      <Text style={styles.briefingHeading}>{t('ar.virtualEquipment', 'Virtual Equipment')}</Text>
                      <Text style={styles.briefingText}>
                        {resolveLocalizedText(activeDrillModal.virtualEquipment)}
                      </Text>
                    </View>

                    <View style={styles.briefingSection}>
                      <Text style={styles.briefingHeading}>{t('ar.interactionMode', 'Spatial Interaction Mode')}</Text>
                      <Text style={styles.briefingText}>
                        {resolveLocalizedText(activeDrillModal.interactionType)}
                      </Text>
                    </View>

                    {activeDrillModal.safetyTip && (
                      <View style={styles.safetyTipCard}>
                        <ShieldCheck size={18} color="#047857" />
                        <Text style={styles.safetyTipText}>
                          {resolveLocalizedText(activeDrillModal.safetyTip)}
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={[
                        styles.toggleDrillBtn,
                        completedArList.includes(activeDrillModal.chapterId) && styles.toggleDrillBtnDone
                      ]}
                      onPress={() => handleToggleArCompletion(activeDrillModal.chapterId)}
                      activeOpacity={0.85}
                    >
                      <CheckCircle2 size={18} color="#FFFFFF" />
                      <Text style={styles.toggleDrillBtnText}>
                        {completedArList.includes(activeDrillModal.chapterId)
                          ? t('ar.drillCompleted', '✓ Drill Completed')
                          : t('ar.markDrillCompleted', 'Mark Drill Completed')}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalLaunchBtn}
                      onPress={() => {
                        setActiveDrillModal(null);
                        router.push(`/ar-training/${moduleId}`);
                      }}
                      activeOpacity={0.85}
                    >
                      <Sparkles size={16} color="#FFFFFF" />
                      <Text style={styles.modalLaunchBtnText}>{t('ar.launchDrill', 'Launch Live AR Camera Drill')}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  scrollContent: {
    paddingBottom: 40
  },
  heroContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: 12
  },
  heroImageBg: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden'
  },
  heroOverlay: {
    padding: SPACING.lg,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderRadius: 20
  },
  heroBadgeRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  arBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(2, 132, 199, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm
  },
  arBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5
  },
  heroHeadline: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 24
  },
  heroSubheadline: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 16
  },
  summaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center'
  },
  summaryNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  summaryLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2
  },
  summaryDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginTop: 22,
    marginBottom: 12,
    gap: 8
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A'
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  reqBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  reqBadgeSuccess: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC'
  },
  reqBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B'
  },
  reqBadgeTextSuccess: {
    color: '#16A34A'
  },
  drillsList: {
    paddingHorizontal: SPACING.md,
    gap: 12
  },
  drillCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm
  },
  drillCardDone: {
    borderColor: '#86EFAC'
  },
  drillTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  drillTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  chapterBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  chapterBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0284C7'
  },
  drillTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A'
  },
  doneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  doneBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A'
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8'
  },
  objectiveText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12
  },
  metaBadgeList: {
    gap: 6,
    marginBottom: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8
  },
  metaBadgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  metaBadgeLabel: {
    flex: 1,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600'
  },
  drillActionRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12
  },
  disabledArBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    opacity: 0.9
  },
  disabledArBtnText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginLeft: 8
  },
  inactiveBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full
  },
  inactiveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  drillDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8
  },
  drillDetailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7'
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0284C7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.full
  },
  launchBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    ...SHADOWS.floating
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  modalTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 8
  },
  closeBtn: {
    padding: 4
  },
  modalScroll: {
    padding: 18
  },
  briefingSection: {
    marginBottom: 14
  },
  briefingHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  briefingText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18
  },
  safetyTipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: 16
  },
  safetyTipText: {
    flex: 1,
    fontSize: 12,
    color: '#15803D',
    lineHeight: 17,
    fontWeight: '600'
  },
  toggleDrillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    marginBottom: 10
  },
  toggleDrillBtnDone: {
    backgroundColor: '#16A34A'
  },
  toggleDrillBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  modalLaunchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    borderRadius: RADIUS.full
  },
  modalLaunchBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  comingSoonContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: 18,
    marginBottom: 24
  },
  comingSoonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    ...SHADOWS.md
  },
  comingSoonIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  comingSoonHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center'
  },
  comingSoonSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20
  },
  syllabusBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20
  },
  syllabusTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8
  },
  topicBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B'
  },
  topicText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600'
  },
  releaseDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8
  },
  releaseDateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  }
});
