import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import {
  Clock,
  Award,
  BookOpen,
  Sparkles,
  ChevronRight,
  Lock,
  Flame,
  Wind,
  Bell,
  CheckCircle2,
  Calendar
} from 'lucide-react-native';
import { Header } from '../../components/Header';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { mobileApi } from '../../services/api';
import { useLanguage } from '../../localization/i18n';
import { CURRICULUM_DATA, getModuleCurriculum, normalizeModuleId } from '../../data/curriculumData';

export default function ModuleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const moduleId = normalizeModuleId(id);
  const rawId = id || moduleId;
  const { t, resolveLocalizedText, currentLanguage } = useLanguage();
  const [moduleData, setModuleData] = useState<any>(null);
  const [progressList, setProgressList] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [vocProgress, setVocProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claimingCert, setClaimingCert] = useState(false);
  const [notified, setNotified] = useState(false);

  const curriculum = getModuleCurriculum(moduleId);
  const isComingSoon = Boolean(curriculum.isComingSoon || (moduleId !== '1' && moduleId !== '2'));

  const loadModuleDetails = async () => {
    try {
      const [mod, prog, certs, voc] = await Promise.all([
        mobileApi.getModuleById(rawId).catch(() => mobileApi.getModuleById(moduleId)),
        mobileApi.getUserProgress().catch(() => []),
        mobileApi.getCertificates().catch(() => []),
        mobileApi.getVocationalProgress(moduleId).catch(() => null)
      ]);

      setModuleData(mod);
      if (prog && Array.isArray(prog)) setProgressList(prog);
      if (certs && Array.isArray(certs)) setCertificates(certs);
      if (voc) setVocProgress(voc);
    } catch {
      try {
        const mod = await mobileApi.getModuleById(moduleId);
        setModuleData(mod);
      } catch (err) {
        console.error('Error loading module', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (moduleId) {
      loadModuleDetails();
    }
  }, [moduleId]);

  // Refresh data on focus (when returning from fundamentals, ar, or assessment)
  useFocusEffect(
    useCallback(() => {
      if (moduleId && !isComingSoon) {
        mobileApi.getVocationalProgress(moduleId).then(setVocProgress).catch(() => {});
        mobileApi.getCertificates().then((certs) => {
          if (Array.isArray(certs)) setCertificates(certs);
        }).catch(() => {});
      }
    }, [moduleId, isComingSoon])
  );

  if (loading || !moduleData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const title = resolveLocalizedText(curriculum.title) || resolveLocalizedText(moduleData.title);
  const description = resolveLocalizedText(curriculum.description) || resolveLocalizedText(moduleData.description);

  // Compute Module Completion States
  const progress =
    progressList.find(
      (p: any) =>
        String(p.moduleId) === String(moduleId) || String(p.moduleNumber) === String(moduleId)
    ) || null;

  const moduleCert =
    certificates.find(
      (c: any) =>
        String(c.moduleId) === String(moduleId) ||
        (moduleId === '1' && c.moduleTitle?.toLowerCase().includes('fire')) ||
        (moduleId === '2' && c.moduleTitle?.toLowerCase().includes('gas'))
    ) || null;

  const totalLessons = moduleData.lessons?.length || curriculum.chapters?.length || 5;
  const isArDone = !!progress?.arCompleted || !!moduleCert;
  const isExamDone = !!progress?.assessmentPassed || !!moduleCert;
  const isCertEarned = !!moduleCert || !!progress?.certificateId || !!vocProgress?.isCertified;
  const certId =
    moduleCert?.id || moduleCert?.certificateId || progress?.certificateId || vocProgress?.certificateId;

  // Vocational Components Progress Counts
  const vCount = vocProgress?.completedVideos?.length || 0;
  const cCount = vocProgress?.completedChapters?.length || 0;
  const arCount = vocProgress?.completedArChapters?.length || (isArDone ? 1 : 0);
  const aCount = vocProgress?.completedAssessments?.length || (isExamDone ? 4 : 0);

  // Count learning components completed (out of 5):
  // 1. Fundamentals Videos (vCount >= 5)
  // 2. Fundamentals Chapters (cCount >= 4)
  // 3. AR Training (arCount >= 1 || isArDone)
  // 4. Assessment (aCount >= 4 || isExamDone)
  // 5. Certification (isCertEarned)
  let completedComponents = 0;
  if (vCount >= 5) completedComponents++;
  if (cCount >= 4) completedComponents++;
  if (arCount >= 1 || isArDone) completedComponents++;
  if (aCount >= 4 || isExamDone) completedComponents++;
  if (isCertEarned) completedComponents++;

  // Strict Certification Eligibility Rule (Videos >= 5 && Chapters >= 4 && Assessments >= 4)
  const isCertificateEligible = (vCount >= 5 && cCount >= 4 && aCount >= 4) || isCertEarned;

  // Progress percentage calculation
  let moduleProgressPct = 0;
  if (isCertEarned) {
    moduleProgressPct = 100;
  } else {
    moduleProgressPct = Math.min(100, Math.round((completedComponents / 5) * 100));
  }

  const handleClaimCertificate = async () => {
    if (!isCertificateEligible) {
      Alert.alert(
        t('assessment.incompleteTitle', 'Requirements Pending'),
        t('assessment.incompleteMessage', 'Please complete at least 5 videos, 4 chapters, and 4 chapter assessments to claim your credential.')
      );
      return;
    }

    try {
      setClaimingCert(true);
      const cert = await mobileApi.claimVocationalCertificate(moduleId);
      setClaimingCert(false);
      if (cert) {
        Alert.alert(
          t('certificates.issued', 'Credential Issued!'),
          t('certificates.credentialActive', 'Your verified DGMS & OSHA safety certificate has been securely recorded.')
        );
        router.push(`/certificate/${cert.certificateId || cert.id}`);
      }
    } catch (err: any) {
      setClaimingCert(false);
      Alert.alert(t('common.error', 'Notice'), err.message || 'Unable to claim certificate.');
    }
  };

  const handleNotifyMe = () => {
    setNotified(true);
    Alert.alert(
      t('comingSoon.notifyTitle', 'Subscribed'),
      t('comingSoon.notifySuccess', 'You will be notified as soon as this module goes live.')
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* 1. Common PARIKSHAK Header */}
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Module Banner Card with dynamic progress inside */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerTopHeader}>
            <Text style={styles.moduleTitle}>{title}</Text>
            {isComingSoon && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonBadgeText}>{t('comingSoon.badge', 'COMING SOON')}</Text>
              </View>
            )}
          </View>
          <Text style={styles.moduleDescription}>{description}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Clock size={13} color={COLORS.primary} />
              <Text style={styles.metaText}>{moduleData.estimatedDurationMinutes} {t('home.mins', 'mins')}</Text>
            </View>

            <View style={styles.metaItem}>
              <Award size={13} color={COLORS.primary} />
              <Text style={styles.metaText}>
                {t('assessment.passingScore', 'Pass Score')}: {moduleData.passingScore}%
              </Text>
            </View>

            <View style={styles.metaItem}>
              <BookOpen size={13} color={COLORS.primary} />
              <Text style={styles.metaText}>
                {totalLessons} {t('modules.lessons', 'Lessons')}
              </Text>
            </View>
          </View>

          {/* Dynamic Progress Bar inside Banner Card (only for active modules) */}
          {!isComingSoon && (
            <View style={styles.bannerProgressSection}>
              <View style={styles.progressHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.progressSectionTitle}>
                    {title} {t('common.progress', 'Progress')}
                  </Text>
                  <Text style={styles.progressSectionSub}>
                    {t('moduleDetail.completedComponents', 'Completed: {completed} / {total} learning components', {
                      completed: completedComponents,
                      total: 5
                    })}
                  </Text>
                </View>
                <View
                  style={[
                    styles.progressBadge,
                    moduleProgressPct === 100 && styles.progressBadgeDone
                  ]}
                >
                  <Text
                    style={[
                      styles.progressBadgeText,
                      moduleProgressPct === 100 && styles.progressBadgeTextDone
                    ]}
                  >
                    {moduleProgressPct}%
                  </Text>
                </View>
              </View>

              {/* Progress Bar Track */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarIndicator,
                    {
                      width: `${moduleProgressPct}%`,
                      backgroundColor: moduleProgressPct === 100 ? '#10B981' : '#0284C7'
                    }
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        {/* COMING SOON VIEW FOR MODULES 3, 4, 5 */}
        {isComingSoon ? (
          <View style={styles.comingSoonContainer}>
            <View style={styles.comingSoonCard}>
              <View style={styles.comingSoonIconWrap}>
                <Sparkles size={36} color="#F59E0B" />
              </View>

              <Text style={styles.comingSoonHeading}>{t('comingSoon.title', 'Curriculum in Development')}</Text>
              <Text style={styles.comingSoonSub}>{t('comingSoon.subtitle', 'This training module is currently being authored to industrial safety compliance standards.')}</Text>

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

              <TouchableOpacity
                style={[styles.notifyBtn, notified && styles.notifyBtnActive]}
                onPress={handleNotifyMe}
                disabled={notified}
                activeOpacity={0.85}
              >
                <Bell size={18} color="#FFFFFF" fill={notified ? '#FFFFFF' : 'none'} />
                <Text style={styles.notifyBtnText}>
                  {notified ? t('comingSoon.notificationSet', 'Notification Enabled') : t('comingSoon.notifyMe', 'Notify Me When Live')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* 4 Large Independent Learning Sections in exact order: Fundamentals, AR, Assessment, Certification */
          <View style={styles.largeSectionsContainer}>
            {/* SECTION 1: FUNDAMENTALS */}
            <View style={styles.largeSectionCard}>
              <View style={styles.largeSectionTop}>
                <View style={[styles.largeIconBox, { backgroundColor: moduleId === '2' ? '#E0F2FE' : '#FFEDD5' }]}>
                  {moduleId === '2' ? <Wind size={26} color="#0284C7" /> : <Flame size={26} color="#EA580C" />}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.largeSectionTitle}>
                      {moduleId === '2' ? '💨 ' : '🔥 '}
                      {t('moduleDetail.fundamentalsTitle', 'Fundamentals')}
                    </Text>
                    <View
                      style={[
                        styles.sectionStatusPill,
                        vCount >= 5 && cCount >= 4
                          ? styles.statusPillDone
                          : vCount > 0 || cCount > 0
                          ? styles.statusPillActive
                          : styles.statusPillNotStarted
                      ]}
                    >
                      <Text
                        style={[
                          styles.sectionStatusText,
                          vCount >= 5 && cCount >= 4
                            ? styles.statusTextDone
                            : vCount > 0 || cCount > 0
                            ? styles.statusTextActive
                            : styles.statusTextNotStarted
                        ]}
                      >
                        {vCount >= 5 && cCount >= 4
                          ? `✓ ${t('common.completed', 'COMPLETED')}`
                          : vCount > 0 || cCount > 0
                          ? t('common.inProgress', 'IN PROGRESS')
                          : `○ ${t('common.notStarted', 'NOT STARTED')}`}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.largeSectionSub}>
                    {curriculum.chapters?.[0]
                      ? resolveLocalizedText(curriculum.chapters[0].description)
                      : t('moduleDetail.fundamentalsDesc', 'Learn core safety fundamentals, hazard identification, and standard operating procedures.')}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionMetricsRow}>
                <Text style={styles.sectionMetricsText}>
                  • {vCount} {t('common.of', 'of')} {curriculum.videos?.length || 8} {t('moduleDetail.videosWatched', 'videos watched')} • {cCount} {t('common.of', 'of')} {curriculum.chapters?.length || 5} {t('moduleDetail.chaptersCompleted', 'chapters completed')}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.sectionActionBtn}
                onPress={() => router.push(`/module/fundamentals/${moduleId}`)}
                activeOpacity={0.85}
              >
                <Text style={styles.sectionActionBtnText}>
                  {vCount >= 5 && cCount >= 4
                    ? t('moduleDetail.reviewFundamentals', 'Review Fundamentals →')
                    : t('moduleDetail.openFundamentals', 'Open Fundamentals →')}
                </Text>
                <ChevronRight size={18} color="#047857" />
              </TouchableOpacity>
            </View>

            {/* SECTION 2: AR TRAINING */}
            <View style={styles.largeSectionCard}>
              <View style={styles.largeSectionTop}>
                <View style={[styles.largeIconBox, { backgroundColor: '#E0F2FE' }]}>
                  <Sparkles size={26} color="#0284C7" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.largeSectionTitle}>🥽 {t('moduleDetail.arTrainingTitle', 'AR Training')}</Text>
                    <View
                      style={[
                        styles.sectionStatusPill,
                        arCount >= 1 || isArDone
                          ? styles.statusPillDone
                          : styles.statusPillNotStarted
                      ]}
                    >
                      <Text
                        style={[
                          styles.sectionStatusText,
                          arCount >= 1 || isArDone
                            ? styles.statusTextDone
                            : styles.statusTextNotStarted
                        ]}
                      >
                        {arCount >= 1 || isArDone
                          ? `✓ ${t('common.completed', 'COMPLETED')}`
                          : `○ ${t('common.notStarted', 'NOT STARTED')}`}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.largeSectionSub}>
                    {curriculum.arDrills?.[0]
                      ? resolveLocalizedText(curriculum.arDrills[0].drillObjective)
                      : t('moduleDetail.arTrainingDesc', 'Practice safety scenarios: 5 interactive AR chapter drills from hazard detection to emergency response.')}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionMetricsRow}>
                <Text style={styles.sectionMetricsText}>
                  • {arCount} {t('common.of', 'of')} {curriculum.arDrills?.length || 5} {t('moduleDetail.arDrillsCompleted', 'chapter AR drills completed')}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.sectionActionBtn}
                onPress={() => router.push(`/module/ar/${moduleId}`)}
                activeOpacity={0.85}
              >
                <Text style={styles.sectionActionBtnText}>
                  {arCount >= 1 || isArDone
                    ? t('moduleDetail.reviewArTraining', 'Review AR Training →')
                    : t('moduleDetail.openArTraining', 'Open AR Training →')}
                </Text>
                <ChevronRight size={18} color="#047857" />
              </TouchableOpacity>
            </View>

            {/* SECTION 3: ASSESSMENT */}
            <View style={styles.largeSectionCard}>
              <View style={styles.largeSectionTop}>
                <View style={[styles.largeIconBox, { backgroundColor: '#FEF3C7' }]}>
                  <BookOpen size={26} color="#D97706" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.largeSectionTitle}>📝 {t('moduleDetail.assessmentTitle', 'Assessment')}</Text>
                    <View
                      style={[
                        styles.sectionStatusPill,
                        aCount >= 4
                          ? styles.statusPillDone
                          : aCount > 0
                          ? styles.statusPillActive
                          : styles.statusPillNotStarted
                      ]}
                    >
                      <Text
                        style={[
                          styles.sectionStatusText,
                          aCount >= 4
                            ? styles.statusTextDone
                            : aCount > 0
                            ? styles.statusTextActive
                            : styles.statusTextNotStarted
                        ]}
                      >
                        {aCount >= 4
                          ? `✓ ${t('common.completed', 'COMPLETED')}`
                          : aCount > 0
                          ? `${aCount}/5 ${t('common.passed', 'PASSED')}`
                          : `○ ${t('common.notStarted', 'NOT STARTED')}`}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.largeSectionSub}>
                    {t('moduleDetail.assessmentDesc', 'Test your chapter knowledge with 5 dedicated chapter-wise assessment quizzes. At least 4 required for certification.')}
                  </Text>
                </View>
              </View>

              <View style={styles.sectionMetricsRow}>
                <Text style={styles.sectionMetricsText}>
                  • {aCount} {t('common.of', 'of')} 5 {t('moduleDetail.assessmentsPassed', 'chapter assessments passed (Target: 4)')}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.sectionActionBtn}
                onPress={() => router.push(`/module/assessment/${moduleId}`)}
                activeOpacity={0.85}
              >
                <Text style={styles.sectionActionBtnText}>
                  {aCount >= 4
                    ? t('moduleDetail.reviewAssessment', 'Review Assessment →')
                    : t('moduleDetail.openAssessment', 'Open Assessment →')}
                </Text>
                <ChevronRight size={18} color="#047857" />
              </TouchableOpacity>
            </View>

            {/* SECTION 4: CERTIFICATION */}
            <View style={[styles.largeSectionCard, isCertEarned && styles.certificationCardEarned]}>
              <View style={styles.largeSectionTop}>
                <View style={[styles.largeIconBox, { backgroundColor: isCertEarned ? '#10B981' : '#F1F5F9' }]}>
                  <Award size={26} color={isCertEarned ? '#FFFFFF' : '#64748B'} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.largeSectionTitle}>🏆 {t('moduleDetail.certificationTitle', 'Certification')}</Text>
                    <View
                      style={[
                        styles.sectionStatusPill,
                        isCertEarned
                          ? styles.statusPillDone
                          : isCertificateEligible
                          ? styles.statusPillReady
                          : styles.statusPillLocked
                      ]}
                    >
                      <Text
                        style={[
                          styles.sectionStatusText,
                          isCertEarned
                            ? styles.statusTextDone
                            : isCertificateEligible
                            ? styles.statusTextReady
                            : styles.statusTextLocked
                        ]}
                      >
                        {isCertEarned
                          ? `✓ ${t('certificates.issued', 'ISSUED')}`
                          : isCertificateEligible
                          ? t('common.unlocked', 'UNLOCKED')
                          : t('common.locked', 'LOCKED')}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.largeSectionSub}>
                    {isCertEarned
                      ? `${t('certificates.credentialActive', 'Credential Active')}: ${certId}`
                      : t('moduleDetail.certificationSub', 'Track your certificate eligibility and claim your verified safety credential.')}
                  </Text>
                </View>
              </View>

              {/* Certification Condition Metrics */}
              <View style={styles.eligibilityBox}>
                <View style={styles.eligibilityRow}>
                  <Text style={styles.eligibilityLabel}>{t('fundamentals.videos', 'Videos')}</Text>
                  <Text style={[styles.eligibilityValue, vCount >= 5 && { color: '#16A34A', fontWeight: '800' }]}>
                    {vCount} / {curriculum.videos?.length || 8} {vCount >= 5 ? `✓ (${t('moduleDetail.fiveRequired', '5 required')})` : `(${t('moduleDetail.fiveRequired', '5 required')})`}
                  </Text>
                </View>
                <View style={styles.eligibilityRow}>
                  <Text style={styles.eligibilityLabel}>{t('fundamentals.chapters', 'Chapters')}</Text>
                  <Text style={[styles.eligibilityValue, cCount >= 4 && { color: '#16A34A', fontWeight: '800' }]}>
                    {cCount} / {curriculum.chapters?.length || 5} {cCount >= 4 ? `✓ (${t('moduleDetail.fourRequired', '4 required')})` : `(${t('moduleDetail.fourRequired', '4 required')})`}
                  </Text>
                </View>
                <View style={styles.eligibilityRow}>
                  <Text style={styles.eligibilityLabel}>{t('fundamentals.assessments', 'Assessments')}</Text>
                  <Text style={[styles.eligibilityValue, aCount >= 4 && { color: '#16A34A', fontWeight: '800' }]}>
                    {aCount} / 5 {aCount >= 4 ? `✓ (${t('moduleDetail.fourRequired', '4 required')})` : `(${t('moduleDetail.fourRequired', '4 required')})`}
                  </Text>
                </View>
              </View>

              {isCertEarned ? (
                <TouchableOpacity
                  style={styles.claimCertBtnActive}
                  onPress={() => router.push(`/certificate/${certId}`)}
                  activeOpacity={0.85}
                >
                  <Award size={18} color="#FFFFFF" />
                  <Text style={styles.claimCertBtnText}>{t('certificates.viewCertificate', 'View Official Safety Certificate →')}</Text>
                </TouchableOpacity>
              ) : isCertificateEligible ? (
                <TouchableOpacity
                  style={styles.claimCertBtnActive}
                  onPress={handleClaimCertificate}
                  disabled={claimingCert}
                  activeOpacity={0.85}
                >
                  {claimingCert ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Award size={18} color="#FFFFFF" />
                      <Text style={styles.claimCertBtnText}>{t('certificates.claimCertificate', '✓ Claim Certificate')}</Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : (
                <View style={styles.certLockedBox}>
                  <Lock size={15} color="#94A3B8" />
                  <Text style={styles.certLockedText}>
                    {t('certificates.lockedReqs', 'Certificate Locked (Complete 5 videos, 4 chapters, 4 assessments)')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContent: {
    paddingBottom: 40
  },
  bannerCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: SPACING.md,
    marginTop: 12,
    borderRadius: 20,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm
  },
  bannerTopHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6
  },
  moduleTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A'
  },
  comingSoonBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full
  },
  comingSoonBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706'
  },
  moduleDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 14
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B'
  },
  bannerProgressSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 14,
    paddingTop: 12
  },
  progressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  progressSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A'
  },
  progressSectionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  progressBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  progressBadgeDone: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC'
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7'
  },
  progressBadgeTextDone: {
    color: '#16A34A'
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden'
  },
  progressBarIndicator: {
    height: '100%',
    borderRadius: 4
  },
  comingSoonContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: 18
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
    marginBottom: 20
  },
  releaseDateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B'
  },
  notifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D97706',
    width: '100%',
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    ...SHADOWS.sm
  },
  notifyBtnActive: {
    backgroundColor: '#16A34A'
  },
  notifyBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  largeSectionsContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: 18,
    marginBottom: 40,
    gap: 16
  },
  largeSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.md
  },
  largeSectionTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14
  },
  largeIconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4
  },
  largeSectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A'
  },
  sectionStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  statusPillNotStarted: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  statusPillActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE'
  },
  statusPillDone: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC'
  },
  statusPillReady: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  statusPillLocked: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  sectionStatusText: {
    fontSize: 10,
    fontWeight: '800'
  },
  statusTextNotStarted: {
    color: '#94A3B8'
  },
  statusTextActive: {
    color: '#2563EB'
  },
  statusTextDone: {
    color: '#16A34A'
  },
  statusTextReady: {
    color: '#D97706'
  },
  statusTextLocked: {
    color: '#94A3B8'
  },
  largeSectionSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginTop: 2
  },
  sectionMetricsRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9'
  },
  sectionMetricsText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7'
  },
  sectionActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: RADIUS.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 12
  },
  sectionActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857'
  },
  certificationCardEarned: {
    borderColor: '#86EFAC',
    backgroundColor: '#F0FDF4'
  },
  eligibilityBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    gap: 6,
    marginTop: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  eligibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  eligibilityLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600'
  },
  eligibilityValue: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600'
  },
  claimCertBtnActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16A34A',
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    ...SHADOWS.sm
  },
  claimCertBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  certLockedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: RADIUS.md
  },
  certLockedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B'
  }
});
