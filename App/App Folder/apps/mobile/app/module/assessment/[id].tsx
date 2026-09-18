import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground
} from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import {
  CheckCircle2,
  Circle,
  FileCheck2,
  Award,
  ChevronRight,
  Calendar,
  Sparkles
} from 'lucide-react-native';
import { Header } from '../../../components/Header';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../../constants/theme';
import { mobileApi } from '../../../services/api';
import { getChapterAssessments, ChapterAssessmentItem } from '../../../data/chapterAssessments';
import { CURRICULUM_DATA, getModuleCurriculum, normalizeModuleId } from '../../../data/curriculumData';
import { useLanguage } from '../../../localization/i18n';

export default function ChapterAssessmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const moduleId = normalizeModuleId(id);
  const { t, resolveLocalizedText, currentLanguage } = useLanguage();

  const curriculum = getModuleCurriculum(moduleId);
  const assessments = getChapterAssessments(moduleId);
  const isComingSoon = Boolean(curriculum.isComingSoon || (moduleId !== '1' && moduleId !== '2') || assessments.length === 0);

  const [loading, setLoading] = useState(true);
  const [completedAssessments, setCompletedAssessments] = useState<number[]>([]);

  const loadProgress = async () => {
    try {
      const data = await mobileApi.getVocationalProgress(moduleId);
      if (data && Array.isArray(data.completedAssessments)) {
        setCompletedAssessments(data.completedAssessments);
      }
    } catch {
      // offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [moduleId]);

  // Auto update when returning from dedicated chapter assessment page
  useFocusEffect(
    useCallback(() => {
      loadProgress();
    }, [moduleId])
  );

  const completedCount = completedAssessments.length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* 1. Common Application Header */}
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Assessment Hero Card */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require('../../../assets/hero_banner.jpg')}
            style={styles.heroImageBg}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.heroTopRow}>
                <View style={styles.pillBadge}>
                  <FileCheck2 size={12} color="#FFFFFF" />
                  <Text style={styles.pillBadgeText}>
                    {isComingSoon ? t('comingSoon.badge', 'COMING SOON') : t('assessment.heroBadge', 'CHAPTER-WISE ASSESSMENT EXAMS')}
                  </Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>
                {resolveLocalizedText(curriculum.title)} {t('assessment.knowledgeVerification', 'Knowledge Verification')}
              </Text>
              <Text style={styles.heroDesc}>
                {isComingSoon ? resolveLocalizedText(curriculum.description) : t('assessment.heroSubtitle', 'Demonstrate your mastery across all 5 safety competency domains. Each chapter exam evaluates real industrial protocols.')}
              </Text>

              {/* Persistent Qualification Status */}
              {!isComingSoon && (
                <View style={styles.statusPanel}>
                  <View style={styles.statusPanelItem}>
                    <Text style={styles.statusPanelNum}>{completedCount} / 5</Text>
                    <Text style={styles.statusPanelLabel}>
                      {t('assessment.assessmentsDone', 'Assessments Done')}
                    </Text>
                  </View>
                  <View style={styles.statusDivider} />
                  <View style={styles.statusPanelItem}>
                    <Text style={styles.statusPanelNum}>4 / 5</Text>
                    <Text style={styles.statusPanelLabel}>
                      {t('assessment.requiredForCert', 'Required for Cert')}
                    </Text>
                  </View>
                  <View style={styles.statusDivider} />
                  <View style={styles.statusPanelItem}>
                    <Text
                      style={[
                        styles.statusPanelNum,
                        completedCount >= 4 && { color: '#34D399' }
                      ]}
                    >
                      {completedCount >= 4 ? t('common.ready', 'READY') : t('common.onTrack', 'ON TRACK')}
                    </Text>
                    <Text style={styles.statusPanelLabel}>
                      {t('fundamentals.qualification', 'Status')}
                    </Text>
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
            {/* List Header */}
            <View style={styles.listHeaderRow}>
              <Text style={styles.listTitle}>{t('assessment.competencyQuizzes', '5 Chapter Competency Quizzes')}</Text>
              <Text style={styles.listSub}>{t('assessment.minReqCert', 'Min. 4 required to claim official credential')}</Text>
            </View>

            <View style={styles.assessmentsList}>
              {assessments.map((item) => {
                const isDone = completedAssessments.includes(item.chapterId);

                return (
                  <View
                    key={item.chapterId}
                    style={[styles.assessCard, isDone && styles.assessCardDone]}
                  >
                    <View style={[styles.assessCardTop, { justifyContent: 'flex-end' }]}>
                      {/* Completion State on Right Side */}
                      {isDone ? (
                        <View style={styles.completedBadge}>
                          <CheckCircle2 size={15} color="#16A34A" />
                          <Text style={styles.completedBadgeText}>
                            ✓ {t('common.completed', 'Completed')}
                          </Text>
                        </View>
                      ) : (
                        <View style={styles.pendingBadge}>
                          <Circle size={14} color="#64748B" />
                          <Text style={styles.pendingBadgeText}>
                            {t('common.notStarted', 'Not Started')}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text style={styles.assessCardTitle}>{resolveLocalizedText(item.title)}</Text>
                    <Text style={styles.assessCardSubtitle}>{resolveLocalizedText(item.subtitle)}</Text>

                    <View style={styles.assessCardFooter}>
                      <Text style={styles.metaInfoText}>
                        {item.questionsCount} {t('assessment.questionsCount', 'questions')} • {t('assessment.passingScore', 'Passing')}: {item.passingPercentage}%
                      </Text>
                      <TouchableOpacity
                        style={[styles.takeExamBtn, isDone && styles.takeExamBtnRetake]}
                        onPress={() =>
                          router.push({
                            pathname: `/assessment/fire-safety/${item.chapterId}`,
                            params: { moduleId }
                          })
                        }
                        activeOpacity={0.85}
                      >
                        <Text style={[styles.takeExamBtnText, isDone && styles.takeExamBtnRetakeText]}>
                          {isDone ? t('assessment.retakeExam', 'Retake Exam') : `${t('assessment.startExam', 'Start Exam')} →`}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
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
  heroTopRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(217, 119, 6, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm
  },
  pillBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FCD34D',
    letterSpacing: 0.5
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
    lineHeight: 24
  },
  heroDesc: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 16
  },
  statusPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14
  },
  statusPanelItem: {
    flex: 1,
    alignItems: 'center'
  },
  statusPanelNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  statusPanelLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2
  },
  statusDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)'
  },
  listHeaderRow: {
    paddingHorizontal: SPACING.md,
    marginTop: 22,
    marginBottom: 12
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A'
  },
  listSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  assessmentsList: {
    paddingHorizontal: SPACING.md,
    gap: 12
  },
  assessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm
  },
  assessCardDone: {
    borderColor: '#86EFAC'
  },
  assessCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  chapterTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  chapterTagText: {
    fontSize: 10,
    fontWeight: '800'
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  completedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16A34A'
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B'
  },
  assessCardTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 2
  },
  assessCardSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 12
  },
  assessCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10
  },
  metaInfoText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600'
  },
  takeExamBtn: {
    backgroundColor: '#047857',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md
  },
  takeExamBtnRetake: {
    backgroundColor: '#F1F5F9'
  },
  takeExamBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  takeExamBtnRetakeText: {
    color: '#0F172A'
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
