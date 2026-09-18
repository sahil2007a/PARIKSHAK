import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  HelpCircle,
  FileCheck2,
  RotateCcw
} from 'lucide-react-native';
import { mobileApi } from '../../services/api';
import { AssessmentConfig, AssessmentQuestion, AssessmentResult } from '@parishak/shared';
import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { resolveLocalizedText, t } from '../../localization/i18n';

export default function AssessmentExamScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [assessment, setAssessment] = useState<AssessmentConfig | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(600); // 10 mins
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    if (id) {
      mobileApi.getAssessment(id).then((data: AssessmentConfig) => {
        setAssessment(data);
        setTimeRemainingSeconds((data.timeLimitMinutes || 10) * 60);
        setLoading(false);
      });
    }
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (loading || result) return;
    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, result, selectedAnswers]);

  const handleSelectOption = (questionId: string, optionId: string, isSequence = false) => {
    if (isSequence) {
      const currentSeq = (selectedAnswers[questionId] as string[]) || [];
      let nextSeq: string[];
      if (currentSeq.includes(optionId)) {
        nextSeq = currentSeq.filter((o) => o !== optionId);
      } else {
        nextSeq = [...currentSeq, optionId];
      }
      setSelectedAnswers({ ...selectedAnswers, [questionId]: nextSeq });
    } else {
      setSelectedAnswers({ ...selectedAnswers, [questionId]: optionId });
    }
  };

  const handleSubmitExam = async () => {
    if (!assessment) return;

    try {
      setSubmitting(true);
      const answersPayload = (assessment.questions || []).map((q) => ({
        questionId: q.questionId,
        selectedOption: selectedAnswers[q.questionId] || '',
        timeSpentSeconds: 15
      }));

      const res = await mobileApi.submitAssessment(assessment.id, {
        assessmentId: assessment.id,
        moduleId: assessment.moduleId,
        answers: answersPayload,
        timeSpentTotalSeconds: (assessment.timeLimitMinutes || 10) * 60 - timeRemainingSeconds,
        idempotencyKey: `mobile-attempt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
      });

      setResult(res);
    } catch (e: any) {
      Alert.alert(t('common.notice', 'Submission Notice'), e.message || 'Saved offline.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !assessment || !assessment.questions) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{t('assessment.loadingExam', 'Loading Certification Exam...')}</Text>
      </SafeAreaView>
    );
  }

  const currentQ: AssessmentQuestion = assessment.questions[currentIndex];
  const questionTitle = resolveLocalizedText(currentQ.question);
  const isSequenceQuestion = currentQ.type === 'PROCEDURE_ORDERING';
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const timerDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      {/* Header */}
      <View style={[styles.topBar, { justifyContent: 'center' }]}>
        <View style={styles.timerBadge}>
          <Clock size={14} color={timeRemainingSeconds < 120 ? '#E74C3C' : COLORS.primary} />
          <Text
            style={[
              styles.timerText,
              timeRemainingSeconds < 120 && { color: '#E74C3C' }
            ]}
          >
            {timerDisplay}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {result ? (
          /* Assessment Result Outcome View */
          <View style={styles.resultCard}>
            <View
              style={[
                styles.resultIconCircle,
                result.passed ? { backgroundColor: '#27AE60' } : { backgroundColor: '#E74C3C' }
              ]}
            >
              {result.passed ? (
                <Award size={48} color="#FFFFFF" />
              ) : (
                <AlertTriangle size={48} color="#FFFFFF" />
              )}
            </View>

            
              <Text style={styles.resultTitle}>
                {result.passed ? t('assessment.passedTitle') : t('assessment.failedTitle')}
              </Text>
            

            <Text style={styles.resultScoreNumber}>{result.percentage}%</Text>
            <Text style={styles.resultScoreLabel}>{t('assessment.passingThreshold', 'Passing Threshold: {score}%').replace('{score}', String(result.passingScore))}</Text>

            <Text style={styles.resultFeedbackText}>{result.feedback}</Text>

            {/* Competency domain breakdown */}
            <View style={styles.competencyBox}>
              <Text style={styles.competencyTitle}>{t('assessment.domainPerformance', 'Competency Domain Performance')}</Text>
              <View style={styles.competencyGrid}>
                <View style={styles.compItem}>
                  <Text style={styles.compNum}>{result.competency.knowledge}%</Text>
                  <Text style={styles.compLabel}>{t('assessment.domainKnowledge', 'Knowledge')}</Text>
                </View>
                <View style={styles.compItem}>
                  <Text style={styles.compNum}>{result.competency.procedure}%</Text>
                  <Text style={styles.compLabel}>{t('assessment.domainProcedure', 'Procedure')}</Text>
                </View>
                <View style={styles.compItem}>
                  <Text style={styles.compNum}>{result.competency.safetyCompliance}%</Text>
                  <Text style={styles.compLabel}>{t('assessment.domainCompliance', 'Compliance')}</Text>
                </View>
              </View>
            </View>

            {/* Certification Requirements Status Checklist */}
            <View style={styles.requirementsChecklistBox}>
              <Text style={styles.requirementsTitle}>{t('assessment.certStatusTitle', 'Certification Completion Status')}</Text>
              
              <View style={styles.requirementRow}>
                <View style={styles.reqLeft}>
                  <CheckCircle2 size={15} color="#10B981" />
                  <Text style={styles.reqText}>{t('assessment.reqLessons', 'Curriculum Lessons')}</Text>
                </View>
                <Text style={styles.reqStatusDone}>✓ {t('common.completed', 'Completed')}</Text>
              </View>

              <View style={styles.requirementRow}>
                <View style={styles.reqLeft}>
                  {result.arCompleted !== false ? (
                    <CheckCircle2 size={15} color="#10B981" />
                  ) : (
                    <AlertTriangle size={15} color="#F59E0B" />
                  )}
                  <Text style={styles.reqText}>{t('assessment.reqArDrill', 'AR Safety Training Drill')}</Text>
                </View>
                <Text style={result.arCompleted !== false ? styles.reqStatusDone : styles.reqStatusPending}>
                  {result.arCompleted !== false ? `✓ ${t('common.completed', 'Completed')}` : `○ ${t('assessment.pendingDrill', 'Pending Drill')}`}
                </Text>
              </View>

              <View style={styles.requirementRow}>
                <View style={styles.reqLeft}>
                  <CheckCircle2 size={15} color="#10B981" />
                  <Text style={styles.reqText}>{t('assessment.reqExam', 'Certification Exam')}</Text>
                </View>
                <Text style={styles.reqStatusDone}>✓ {t('assessment.passed', 'Passed')} ({result.percentage}%)</Text>
              </View>

              <View style={[styles.requirementRow, { borderBottomWidth: 0 }]}>
                <View style={styles.reqLeft}>
                  {result.certificateId ? (
                    <Award size={15} color="#10B981" />
                  ) : (
                    <AlertTriangle size={15} color="#94A3B8" />
                  )}
                  <Text style={styles.reqText}>{t('assessment.reqCert', 'Official Safety Certificate')}</Text>
                </View>
                <Text style={result.certificateId ? styles.reqStatusDone : styles.reqStatusLocked}>
                  {result.certificateId ? `✓ ${t('assessment.readyToView', 'Ready to View')}` : `🔒 ${t('assessment.requiresAr', 'Requires AR Drill')}`}
                </Text>
              </View>
            </View>

            {result.passed ? (
              result.certificateId ? (
                <Button
                  title={`${t('assessment.viewOfficialCert', 'View Official Certificate')} →`}
                  onPress={() => router.replace(`/certificate/${result.certificateId}`)}
                  size="lg"
                  style={{ width: '100%', marginTop: 20 }}
                />
              ) : (
                <View style={{ width: '100%', marginTop: 20 }}>
                  <Button
                    title={`${t('assessment.launchArDrill', 'Launch AR Safety Drill')} →`}
                    onPress={() => router.replace('/ar-training/1')}
                    size="lg"
                  />
                </View>
              )
            ) : (
              <Button
                title={t('assessment.reviewAndRetrain', 'Review Module & Retrain')}
                onPress={() => router.replace(`/module/${id}`)}
                size="lg"
                variant="secondary"
                style={{ width: '100%', marginTop: 20 }}
              />
            )}
          </View>
        ) : (
          <>
            {/* Question Counter & Progress */}
            <View style={styles.questionHeader}>
              <Text style={styles.questionCounterText}>
                {t('assessment.question')} {currentIndex + 1} {t('assessment.of')}{' '}
                {assessment.questions.length}
              </Text>
              <Text style={styles.domainBadge}>
                Domain: {currentQ.competencyDomain}
              </Text>
            </View>

            {/* Question Text Box */}
            <View style={styles.questionCard}>
              <Text style={styles.questionPrompt}>{questionTitle}</Text>
              {isSequenceQuestion && (
                <Text style={styles.sequenceHelper}>
                  Select the steps in the exact sequential order from first to last.
                </Text>
              )}
            </View>

            {/* Options List */}
            <View style={styles.optionsList}>
              {currentQ.options.map((opt) => {
                const optText = resolveLocalizedText(opt.text);
                const currentAnswer = selectedAnswers[currentQ.questionId];
                const isSelected = isSequenceQuestion
                  ? Array.isArray(currentAnswer) && currentAnswer.includes(opt.id)
                  : currentAnswer === opt.id;

                const seqIndex = isSequenceQuestion && Array.isArray(currentAnswer)
                  ? currentAnswer.indexOf(opt.id)
                  : -1;

                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                    onPress={() =>
                      handleSelectOption(currentQ.questionId, opt.id, isSequenceQuestion)
                    }
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.optionCircle,
                        isSelected && styles.optionCircleSelected
                      ]}
                    >
                      {isSequenceQuestion && seqIndex !== -1 ? (
                        <Text style={styles.seqBadgeText}>{seqIndex + 1}</Text>
                      ) : isSelected ? (
                        <CheckCircle2 size={16} color="#FFFFFF" />
                      ) : null}
                    </View>

                    <Text
                      style={[
                        styles.optionItemText,
                        isSelected && styles.optionItemTextSelected
                      ]}
                    >
                      {optText}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Navigation Buttons (Next / Submit) */}
            <View style={styles.navRow}>
              {currentIndex > 0 ? (
                <TouchableOpacity
                  style={styles.prevButton}
                  onPress={() => setCurrentIndex((prev) => prev - 1)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.prevButtonText}>{t('common.previous', 'Previous')}</Text>
                </TouchableOpacity>
              ) : <View />}

              {currentIndex < assessment.questions.length - 1 ? (
                <Button
                  title={t('assessment.next')}
                  onPress={() => setCurrentIndex((prev) => prev + 1)}
                  size="md"
                />
              ) : (
                <Button
                  title={t('assessment.submit')}
                  onPress={handleSubmitExam}
                  loading={submitting}
                  size="md"
                />
              )}
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
    backgroundColor: COLORS.background
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkText
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9EFEF'
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F5F8F7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F8F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#E2E8E6'
  },
  timerText: {
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: COLORS.primary
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  questionCounterText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.mutedText,
    textTransform: 'uppercase'
  },
  domainBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E2E8E6',
    marginBottom: 16,
    ...SHADOWS.card
  },
  questionPrompt: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkText,
    lineHeight: 23
  },
  sequenceHelper: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 8
  },
  optionsList: {
    gap: 10,
    marginBottom: 20
  },
  optionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8E6',
    ...SHADOWS.sm
  },
  optionItemSelected: {
    backgroundColor: '#E8F8F5',
    borderColor: COLORS.primary
  },
  optionCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  optionCircleSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  seqBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12
  },
  optionItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.darkText,
    flex: 1,
    lineHeight: 18
  },
  optionItemTextSelected: {
    color: COLORS.primaryDark,
    fontWeight: '700'
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },
  prevButton: {
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  prevButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.mutedText
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8E6',
    marginTop: SPACING.sm,
    ...SHADOWS.card
  },
  resultIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.floating
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.darkText,
    textAlign: 'center',
    marginBottom: 4
  },
  resultScoreNumber: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 4
  },
  resultScoreLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.mutedText,
    textTransform: 'uppercase',
    marginBottom: 12
  },
  resultFeedbackText: {
    fontSize: 12,
    color: COLORS.darkText,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 10
  },
  competencyBox: {
    width: '100%',
    backgroundColor: '#F8FAF9',
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8E6'
  },
  competencyTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 8,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  competencyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  compItem: {
    alignItems: 'center'
  },
  compNum: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary
  },
  compLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.mutedText,
    marginTop: 2
  },
  requirementsChecklistBox: {
    width: '100%',
    backgroundColor: '#F8FAF9',
    borderRadius: RADIUS.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8E6',
    marginTop: 14
  },
  requirementsTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 10,
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F0'
  },
  reqLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  reqText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.darkText
  },
  reqStatusDone: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10B981'
  },
  reqStatusPending: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B'
  },
  reqStatusLocked: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8'
  }
});
