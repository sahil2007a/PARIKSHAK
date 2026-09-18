import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Check
} from 'lucide-react-native';
import { Header } from '../../../components/Header';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../../constants/theme';
import { mobileApi } from '../../../services/api';
import { getChapterAssessments, ChapterAssessmentItem } from '../../../data/chapterAssessments';
import { normalizeModuleId } from '../../../data/curriculumData';
import { useLanguage } from '../../../localization/i18n';

export default function DedicatedChapterAssessmentScreen() {
  const { chapterId, moduleId } = useLocalSearchParams<{ chapterId: string; moduleId?: string }>();
  const activeModuleId = normalizeModuleId(moduleId);
  const { t, resolveLocalizedText, currentLanguage } = useLanguage();

  // Parse chapterId which could be '1' or 'chapter-1'
  const parsedId = parseInt((chapterId || '1').replace('chapter-', ''), 10) || 1;

  const assessments = getChapterAssessments(activeModuleId);
  const assessment: ChapterAssessmentItem =
    assessments.find((a) => a.chapterId === parsedId) || assessments[0];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [savingProgress, setSavingProgress] = useState(false);

  // Check if already completed from backend progress
  useEffect(() => {
    if (!assessment) return;
    mobileApi.getVocationalProgress(activeModuleId).then((prog) => {
      if (prog && Array.isArray(prog.completedAssessments)) {
        if (prog.completedAssessments.includes(parsedId)) {
          // It was previously completed
          setIsCompleted(true);
          setScore(assessment.questions.length);
        }
      }
    }).catch(() => {});
  }, [parsedId, activeModuleId, assessment]);

  if (!assessment) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <Header />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#64748B' }}>
            {t('comingSoon.title', 'Curriculum in Development')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const questions = assessment.questions || [];
  const currentQ = questions[currentQIndex];

  const handleSelectOption = (optId: string) => {
    if (isCompleted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optId
    }));
  };

  const handleNextOrSubmit = async () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      return;
    }

    // Submit and auto-evaluate
    let calculatedScore = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setIsCompleted(true);

    // Persist completion automatically
    try {
      setSavingProgress(true);
      const prog = await mobileApi.getVocationalProgress(activeModuleId).catch(() => null);
      const existing = prog?.completedAssessments || [];
      if (!existing.includes(parsedId)) {
        const updated = [...existing, parsedId];
        await mobileApi.updateVocationalProgress(activeModuleId, { completedAssessments: updated });
      }
    } catch (e) {
      console.warn('Failed to update assessment progress', e);
    } finally {
      setSavingProgress(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQIndex(0);
    setIsCompleted(false);
  };

  const isLastQuestion = currentQIndex === questions.length - 1;
  const hasSelectedCurrent = !!selectedAnswers[currentQ?.id];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* 1. Common PARIKSHAK Header */}
      <Header />

      {/* Chapter Tag Bar (No manual back button) */}
      <View style={[styles.topBar, { justifyContent: 'flex-end' }]}>
        <View style={[styles.crumbBadge, { backgroundColor: assessment.color }]}>
          <Text style={styles.crumbBadgeText} numberOfLines={1}>{resolveLocalizedText(assessment.title)}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isCompleted ? (
          /* Assessment Completed Screen */
          <View style={styles.completionContainer}>
            <View style={styles.resultCard}>
              <View style={styles.successIconBox}>
                <CheckCircle2 size={48} color="#16A34A" />
              </View>

              <Text style={styles.completedHeadline}>
                {t('assessment.completedHeadline', '✓ Assessment Completed')}
              </Text>
              <Text style={styles.chapterCompletedText}>
                {t('assessment.chapterCompletedMsg', 'Assessment ({title}) has been verified.', {
                  title: resolveLocalizedText(assessment.title)
                })}
              </Text>

              <View style={styles.scoreRow}>
                <Text style={styles.scoreNumber}>
                  {t('assessment.correctScore', '{score} / {total} Correct', {
                    score,
                    total: questions.length
                  })}
                </Text>
                <Text style={styles.scorePct}>
                  {t('assessment.scorePct', '{pct}% Score', {
                    pct: Math.round((score / Math.max(1, questions.length)) * 100)
                  })}
                </Text>
              </View>

              {savingProgress && (
                <View style={styles.savingRow}>
                  <ActivityIndicator size="small" color="#047857" />
                  <Text style={styles.savingText}>
                    {t('assessment.savingScore', 'Recording verified score...')}
                  </Text>
                </View>
              )}

              {/* Review Questions & Answers */}
              <View style={styles.reviewSection}>
                <Text style={styles.reviewHeading}>
                  {t('assessment.questionReview', 'Question Review:')}
                </Text>
                {questions.map((q, idx) => {
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  const correctOption = q.options.find((o) => o.id === q.correctAnswer);

                  return (
                    <View key={q.id} style={styles.reviewItem}>
                      <View style={styles.reviewItemHeader}>
                        <Text style={styles.reviewQIndex}>Q{idx + 1}.</Text>
                        <Text style={styles.reviewQPrompt}>{resolveLocalizedText(q.prompt)}</Text>
                      </View>
                      <View style={styles.reviewAnsRow}>
                        <Text style={[styles.reviewBadge, isCorrect ? styles.badgeCorrect : styles.badgeWrong]}>
                          {isCorrect ? t('assessment.correct', '✓ Correct') : t('assessment.reviewWrong', '✕ Review')}
                        </Text>
                        <Text style={styles.correctAnswerText}>
                          {t('assessment.correctAnswerLabel', 'Correct: {ans}', {
                            ans: resolveLocalizedText(correctOption?.text)
                          })}
                        </Text>
                      </View>
                      <Text style={styles.reviewExplanation}>
                        {resolveLocalizedText(q.explanation)}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Actions */}
              <View style={styles.completedActions}>
                <TouchableOpacity
                  style={styles.retakeBtn}
                  onPress={handleRetake}
                  activeOpacity={0.7}
                >
                  <RotateCcw size={14} color="#64748B" />
                  <Text style={styles.retakeBtnText}>{t('assessment.retakeQuiz', 'Retake Quiz')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          /* Active Question Step Screen */
          <View style={styles.questionContainer}>
            {/* Chapter Header Card */}
            <View style={styles.chapterInfoCard}>
              <Text style={styles.chapterTitle}>{resolveLocalizedText(assessment.title)}</Text>
              <Text style={styles.chapterSubtitle}>{resolveLocalizedText(assessment.subtitle)}</Text>
              <View style={styles.questionProgressRow}>
                <Text style={styles.questionProgressText}>
                  {t('assessment.questionOf', 'Question {current} of {total}', {
                    current: currentQIndex + 1,
                    total: questions.length
                  })}
                </Text>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${((currentQIndex + 1) / questions.length) * 100}%` }
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Question Card */}
            <View style={styles.card}>
              <View style={styles.promptRow}>
                <HelpCircle size={18} color={assessment.color} style={{ marginTop: 2 }} />
                <Text style={styles.questionPrompt}>{resolveLocalizedText(currentQ?.prompt)}</Text>
              </View>

              {/* Option Radio Tiles */}
              <View style={styles.optionsList}>
                {currentQ?.options.map((opt, oIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.id;
                  const letter = String.fromCharCode(65 + oIdx);

                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[styles.optionTile, isSelected && styles.optionTileSelected]}
                      onPress={() => handleSelectOption(opt.id)}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleSelected
                        ]}
                      >
                        {isSelected ? (
                          <Check size={12} color="#FFFFFF" strokeWidth={3} />
                        ) : (
                          <Text style={styles.radioLetter}>{letter}</Text>
                        )}
                      </View>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected
                        ]}
                      >
                        {resolveLocalizedText(opt.text)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Next / Submit Button */}
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                !hasSelectedCurrent && styles.primaryBtnDisabled
              ]}
              disabled={!hasSelectedCurrent}
              onPress={handleNextOrSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {isLastQuestion
                  ? t('assessment.submitAssessment', '✓ Submit Assessment')
                  : t('assessment.nextQuestion', 'Next Question →')}
              </Text>
            </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0'
  },
  crumbBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full
  },
  crumbBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  scrollContent: {
    paddingBottom: 40
  },
  questionContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: 16
  },
  chapterInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...SHADOWS.sm
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4
  },
  chapterSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12
  },
  questionProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  questionProgressText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7'
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0284C7',
    borderRadius: 3
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    ...SHADOWS.md
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16
  },
  questionPrompt: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20
  },
  optionsList: {
    gap: 10
  },
  optionTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0'
  },
  optionTileSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6'
  },
  radioCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF'
  },
  radioCircleSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6'
  },
  radioLetter: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B'
  },
  optionText: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '500'
  },
  optionTextSelected: {
    color: '#1D4ED8',
    fontWeight: '700'
  },
  primaryBtn: {
    backgroundColor: '#047857',
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm
  },
  primaryBtnDisabled: {
    backgroundColor: '#CBD5E1',
    elevation: 0
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  completionContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: 16
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    ...SHADOWS.md
  },
  successIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14
  },
  completedHeadline: {
    fontSize: 18,
    fontWeight: '900',
    color: '#16A34A',
    marginBottom: 6
  },
  chapterCompletedText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    marginBottom: 14
  },
  scoreNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16A34A'
  },
  scorePct: {
    fontSize: 13,
    fontWeight: '800',
    color: '#047857'
  },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14
  },
  savingText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600'
  },
  reviewSection: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
    marginBottom: 16
  },
  reviewHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12
  },
  reviewItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  reviewItemHeader: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6
  },
  reviewQIndex: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7'
  },
  reviewQPrompt: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 16
  },
  reviewAnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  reviewBadge: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  badgeCorrect: {
    backgroundColor: '#DCFCE7',
    color: '#16A34A'
  },
  badgeWrong: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626'
  },
  correctAnswerText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600'
  },
  reviewExplanation: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    fontStyle: 'italic'
  },
  completedActions: {
    width: '100%',
    gap: 10
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: RADIUS.full
  },
  retakeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569'
  }
});
