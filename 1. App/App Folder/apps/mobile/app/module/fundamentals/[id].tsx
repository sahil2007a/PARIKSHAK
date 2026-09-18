import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  Play,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Sparkles,
  X,
  Flame,
  Wind,
  ShieldCheck,
  Check,
  AlertTriangle,
  Award,
  ChevronRight,
  Calendar
} from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { Header } from '../../../components/Header';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../../constants/theme';
import { mobileApi } from '../../../services/api';
import { useLanguage } from '../../../localization/i18n';
import { CURRICULUM_DATA, getModuleCurriculum, normalizeModuleId, VideoData, ChapterData } from '../../../data/curriculumData';

export default function FundamentalsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const moduleId = normalizeModuleId(id);
  const { t, resolveLocalizedText, currentLanguage } = useLanguage();

  const curriculum = getModuleCurriculum(moduleId);
  const isComingSoon = Boolean(curriculum.isComingSoon || (moduleId !== '1' && moduleId !== '2'));

  const [loading, setLoading] = useState(true);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoData | null>(null);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [activeChapterDetail, setActiveChapterDetail] = useState<ChapterData | null>(null);

  const loadProgress = async () => {
    try {
      const data = await mobileApi.getVocationalProgress(moduleId);
      if (data) {
        if (Array.isArray(data.completedVideos)) setCompletedVideos(data.completedVideos);
        if (Array.isArray(data.completedChapters)) setCompletedChapters(data.completedChapters);
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

  const handleOpenVideo = (video: VideoData) => {
    setActiveVideo(video);
    setIsVideoModalVisible(true);
  };

  const handleMarkVideoCompleted = async (videoId: string) => {
    const updated = Array.from(new Set([...completedVideos, videoId]));
    setCompletedVideos(updated);
    try {
      await mobileApi.updateVocationalProgress(moduleId, { completedVideos: [videoId] });
    } catch {
      // offline handled
    }
  };

  const handleToggleChapter = async (chapterId: number) => {
    let updated: number[];
    if (completedChapters.includes(chapterId)) {
      updated = completedChapters.filter((c) => c !== chapterId);
    } else {
      updated = [...completedChapters, chapterId];
    }
    setCompletedChapters(updated);
    try {
      await mobileApi.updateVocationalProgress(moduleId, { completedChapters: updated });
    } catch {
      // offline handled
    }
  };

  const videosCount = completedVideos.length;
  const chaptersCount = completedChapters.length;
  const totalVideos = curriculum.videos?.length || 8;
  const totalChapters = curriculum.chapters?.length || 5;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* 1. Common Application Header */}
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Fundamentals Hero Area */}
        <View style={styles.heroContainer}>
          <ImageBackground
            source={require('../../../assets/hero_banner.jpg')}
            style={styles.heroImageBg}
            imageStyle={{ borderRadius: 20 }}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.heroBadgeRow}>
                <View style={styles.vocationalBadge}>
                  <BookOpen size={12} color="#FFFFFF" />
                  <Text style={styles.vocationalBadgeText}>
                    {isComingSoon ? t('comingSoon.badge', 'COMING SOON') : t('fundamentals.heroBadge', 'VOCATIONAL SAFETY CURRICULUM')}
                  </Text>
                </View>
              </View>

              <Text style={styles.heroHeadline}>
                {resolveLocalizedText(curriculum.title)} {t('fundamentals.heroSuffix', 'Fundamentals')}
              </Text>

              <Text style={styles.heroSubheadline}>
                {resolveLocalizedText(curriculum.description)}
              </Text>

              {/* Learning Progress Summary Strip */}
              {!isComingSoon && (
                <View style={styles.summaryStrip}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryNum}>{videosCount} / {totalVideos}</Text>
                    <Text style={styles.summaryLabel}>
                      {t('fundamentals.videos', 'Videos')} (5 {t('common.req', 'Req.')})
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryNum}>{chaptersCount} / {totalChapters}</Text>
                    <Text style={styles.summaryLabel}>
                      {t('fundamentals.chapters', 'Chapters')} (4 {t('common.req', 'Req.')})
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text
                      style={[
                        styles.summaryNum,
                        videosCount >= 5 && chaptersCount >= 4 && { color: '#34D399' }
                      ]}
                    >
                      {videosCount >= 5 && chaptersCount >= 4 ? t('common.ready', 'READY') : t('common.onTrack', 'ON TRACK')}
                    </Text>
                    <Text style={styles.summaryLabel}>{t('fundamentals.qualification', 'Qualification')}</Text>
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
            {/* 3. Horizontal YouTube Video Learning Section */}
            <View style={styles.sectionHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>{t('fundamentals.videoCurriculum', 'Video Learning Curriculum')}</Text>
                <Text style={styles.sectionSubtitle}>
                  {t('fundamentals.watchMinReq', 'Watch at least 5 of 8 videos to qualify for certified competency')}
                </Text>
              </View>
              <View style={[styles.reqBadge, videosCount >= 5 && styles.reqBadgeSuccess]}>
                <Text style={[styles.reqBadgeText, videosCount >= 5 && styles.reqBadgeTextSuccess]}>
                  {videosCount >= 5 ? `✓ 5/${totalVideos} ${t('common.done', 'DONE')}` : `${videosCount}/${totalVideos} ${t('common.watched', 'Watched')}`}
                </Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalVideoScrollView}
              contentContainerStyle={styles.horizontalVideoScroll}
            >
              {curriculum.videos?.map((video) => {
                const isWatched = completedVideos.includes(video.id);

                return (
                  <TouchableOpacity
                    key={video.id}
                    style={[styles.videoCard, isWatched && styles.videoCardWatched]}
                    onPress={() => handleOpenVideo(video)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.thumbnailWrapper}>
                      <Image
                        source={{ uri: video.thumbnail }}
                        style={styles.thumbnailImg}
                        resizeMode="cover"
                      />
                      <View style={styles.playIconCircle}>
                        <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
                      </View>
                      <View style={styles.durationPill}>
                        <Text style={styles.durationText}>{video.duration}</Text>
                      </View>

                      {isWatched && (
                        <View style={styles.watchedCornerBadge}>
                          <Check size={12} color="#FFFFFF" strokeWidth={3} />
                        </View>
                      )}
                    </View>

                    <View style={styles.videoMeta}>
                      <Text style={styles.videoTitle} numberOfLines={2}>
                        {resolveLocalizedText(video.title)}
                      </Text>
                      <Text style={styles.videoDesc} numberOfLines={2}>
                        {resolveLocalizedText(video.description)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* 4. Interactive Chapter Modules */}
            <View style={styles.sectionHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>{t('fundamentals.chapterModules', 'Interactive Chapter Modules')}</Text>
                <Text style={styles.sectionSubtitle}>
                  {t('fundamentals.completeChaptersReq', 'Complete at least 4 chapters before taking the final exam')}
                </Text>
              </View>
              <View style={[styles.reqBadge, chaptersCount >= 4 && styles.reqBadgeSuccess]}>
                <Text style={[styles.reqBadgeText, chaptersCount >= 4 && styles.reqBadgeTextSuccess]}>
                  {chaptersCount >= 4 ? `✓ 4/${totalChapters} ${t('common.done', 'DONE')}` : `${chaptersCount}/${totalChapters} ${t('common.completed', 'Completed')}`}
                </Text>
              </View>
            </View>

            <View style={styles.chaptersList}>
              {curriculum.chapters?.map((chapter) => {
                const isCompleted = completedChapters.includes(chapter.id);

                return (
                  <TouchableOpacity
                    key={chapter.id}
                    style={[styles.chapterCard, isCompleted && styles.chapterCardCompleted]}
                    onPress={() => setActiveChapterDetail(chapter)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.chapterCardImageWrap}>
                      <BookOpen size={24} color="#64748B" />
                      <Image
                        source={{ uri: chapter.image }}
                        style={styles.chapterCardImage}
                        resizeMode="cover"
                      />
                    </View>

                    <View style={styles.chapterCardContent}>
                      <View style={styles.chapterTopRow}>
                        <Text style={styles.chapterCardSubtitle} numberOfLines={1}>
                          {resolveLocalizedText(chapter.subtitle)}
                        </Text>
                        {isCompleted ? (
                          <View style={styles.statusDoneTag}>
                            <CheckCircle2 size={12} color="#16A34A" />
                            <Text style={styles.statusDoneTagText}>{t('common.completed', 'COMPLETED')}</Text>
                          </View>
                        ) : (
                          <View style={styles.statusPendingTag}>
                            <Circle size={12} color="#94A3B8" />
                            <Text style={styles.statusPendingTagText}>{t('common.notStarted', 'NOT STARTED')}</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.chapterCardTitle} numberOfLines={2}>
                        {resolveLocalizedText(chapter.title)}
                      </Text>
                      <Text style={styles.chapterCardDescription} numberOfLines={2}>
                        {resolveLocalizedText(chapter.description)}
                      </Text>

                      <View style={styles.chapterCardActions}>
                        <Text style={styles.studyText}>{t('fundamentals.studyChapter', 'Study Chapter →')}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Video Player Modal */}
        <Modal
          visible={isVideoModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsVideoModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.videoModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {activeVideo ? resolveLocalizedText(activeVideo.title) : ''}
                </Text>
                <TouchableOpacity
                  onPress={() => setIsVideoModalVisible(false)}
                  style={styles.closeBtn}
                >
                  <X size={20} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <View style={styles.playerWrapper}>
                {activeVideo && (
                  <WebView
                    source={{ uri: activeVideo.embedUrl || activeVideo.videoUrl || 'https://www.youtube.com/embed/Vc7ZqtGNmTY' }}
                    style={styles.webviewPlayer}
                    javaScriptEnabled
                    domStorageEnabled
                    allowsFullscreenVideo
                  />
                )}
              </View>

              <View style={styles.modalFooter}>
                <Text style={styles.modalDesc}>
                  {activeVideo ? resolveLocalizedText(activeVideo.description) : ''}
                </Text>

                {activeVideo && (
                  <TouchableOpacity
                    style={[
                      styles.markWatchedBtn,
                      completedVideos.includes(activeVideo.id) && styles.markWatchedBtnDone
                    ]}
                    onPress={() => handleMarkVideoCompleted(activeVideo.id)}
                    activeOpacity={0.8}
                  >
                    <CheckCircle2
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text style={styles.markWatchedBtnText}>
                      {completedVideos.includes(activeVideo.id)
                        ? t('fundamentals.videoCompleted', '✓ Video Completed')
                        : t('fundamentals.markVideoCompleted', 'Mark as Completed')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* Chapter Detail Reading Modal */}
        <Modal
          visible={!!activeChapterDetail}
          transparent
          animationType="slide"
          onRequestClose={() => setActiveChapterDetail(null)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.chapterModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {activeChapterDetail ? resolveLocalizedText(activeChapterDetail.title) : ''}
                </Text>
                <TouchableOpacity
                  onPress={() => setActiveChapterDetail(null)}
                  style={styles.closeBtn}
                >
                  <X size={20} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.chapterModalScroll}
              >
                {activeChapterDetail && (
                  <>
                    <Image
                      source={{ uri: activeChapterDetail.image }}
                      style={styles.chapterModalImage}
                    />

                    <Text style={styles.chapterModalSub}>
                      {resolveLocalizedText(activeChapterDetail.subtitle)}
                    </Text>
                    <Text style={styles.chapterModalMainTitle}>
                      {resolveLocalizedText(activeChapterDetail.title)}
                    </Text>
                    <Text style={styles.chapterModalBody}>
                      {resolveLocalizedText(activeChapterDetail.description)}
                    </Text>

                    {activeChapterDetail.keyTakeaways && (
                      <View style={styles.takeawayCard}>
                        <Text style={styles.takeawayHeading}>
                          {t('fundamentals.keyTakeaways', 'Key Safety Takeaways')}
                        </Text>
                        {activeChapterDetail.keyTakeaways.map((item: any, idx: number) => (
                          <View key={idx} style={styles.takeawayRow}>
                            <View style={styles.bulletDot} />
                            <Text style={styles.takeawayText}>{resolveLocalizedText(item)}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {activeChapterDetail.regulationRef && (
                      <View style={styles.regCard}>
                        <ShieldCheck size={18} color="#0284C7" />
                        <Text style={styles.regText}>
                          {t('fundamentals.regulationRef', 'Regulatory Compliance Standard')}: {resolveLocalizedText(activeChapterDetail.regulationRef)}
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={[
                        styles.toggleChapterBtn,
                        completedChapters.includes(activeChapterDetail.id) && styles.toggleChapterBtnDone
                      ]}
                      onPress={() => handleToggleChapter(activeChapterDetail.id)}
                      activeOpacity={0.85}
                    >
                      <CheckCircle2 size={18} color="#FFFFFF" />
                      <Text style={styles.toggleChapterBtnText}>
                        {completedChapters.includes(activeChapterDetail.id)
                          ? t('fundamentals.chapterCompleted', '✓ Chapter Completed')
                          : t('fundamentals.markChapterCompleted', 'Mark Chapter Completed')}
                      </Text>
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
  vocationalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm
  },
  vocationalBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
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
  horizontalVideoScrollView: {
    minHeight: 185,
    marginVertical: 4
  },
  horizontalVideoScroll: {
    paddingHorizontal: SPACING.md,
    gap: 12,
    paddingBottom: 4
  },
  videoCard: {
    width: 200,
    height: 180,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    ...SHADOWS.sm
  },
  videoCardWatched: {
    borderColor: '#86EFAC'
  },
  thumbnailWrapper: {
    width: '100%',
    height: 105,
    position: 'relative',
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  playIconCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -18 }, { translateY: -18 }],
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  durationPill: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2
  },
  durationText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  watchedCornerBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#16A34A',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2
  },
  videoMeta: {
    padding: 10
  },
  videoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 16,
    marginBottom: 3
  },
  videoDesc: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 13
  },
  chaptersList: {
    paddingHorizontal: SPACING.md,
    gap: 12
  },
  chapterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...SHADOWS.sm
  },
  chapterCardCompleted: {
    borderColor: '#86EFAC'
  },
  chapterCardImageWrap: {
    width: 86,
    height: 86,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  chapterCardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  chapterIdBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2
  },
  chapterIdBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  chapterCardContent: {
    flex: 1,
    padding: 0
  },
  chapterTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
    gap: 6
  },
  chapterCardSubtitle: {
    flex: 1,
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  statusDoneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  statusDoneTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#16A34A'
  },
  statusPendingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  statusPendingTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8'
  },
  chapterCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 17,
    marginBottom: 3
  },
  chapterCardDescription: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginBottom: 6
  },
  chapterCardActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  studyText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#047857'
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  videoModalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
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
  playerWrapper: {
    width: '100%',
    height: 220,
    backgroundColor: '#000000'
  },
  webviewPlayer: {
    flex: 1
  },
  modalFooter: {
    padding: 16
  },
  modalDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14
  },
  markWatchedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: RADIUS.full
  },
  markWatchedBtnDone: {
    backgroundColor: '#16A34A'
  },
  markWatchedBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  chapterModalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    ...SHADOWS.floating
  },
  chapterModalScroll: {
    padding: 18
  },
  chapterModalImage: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    marginBottom: 14
  },
  chapterModalSub: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  chapterModalMainTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 22,
    marginBottom: 10
  },
  chapterModalBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16
  },
  takeawayCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14
  },
  takeawayHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0284C7',
    marginTop: 6
  },
  takeawayText: {
    flex: 1,
    fontSize: 12,
    color: '#334155',
    lineHeight: 17
  },
  regCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginBottom: 18
  },
  regText: {
    flex: 1,
    fontSize: 11,
    color: '#0369A1',
    fontWeight: '600'
  },
  toggleChapterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#047857',
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    ...SHADOWS.sm
  },
  toggleChapterBtnDone: {
    backgroundColor: '#16A34A'
  },
  toggleChapterBtnText: {
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
