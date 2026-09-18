import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  Flame,
  Wind,
  Settings,
  HardHat,
  AlertTriangle,
  Clock,
  Award,
  ChevronRight
} from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { TrainingModule } from '@parishak/shared';
import { useLanguage } from '../localization/i18n';
import { router } from 'expo-router';

interface TrainingCardProps {
  module: TrainingModule;
  onPress?: () => void;
}

const getModuleIcon = (iconName: string) => {
  switch (iconName) {
    case 'flame':
      return <Flame size={20} color={COLORS.primary} />;
    case 'wind':
      return <Wind size={20} color={COLORS.primary} />;
    case 'settings':
      return <Settings size={20} color={COLORS.primary} />;
    case 'hard-hat':
      return <HardHat size={20} color={COLORS.primary} />;
    default:
      return <AlertTriangle size={20} color={COLORS.primary} />;
  }
};

export const TrainingCard: React.FC<TrainingCardProps> = ({ module, onPress }) => {
  const { t, resolveLocalizedText } = useLanguage();
  const title = resolveLocalizedText(module.title);
  const description = resolveLocalizedText(module.description);
  const progress = module.progressPercentage || 0;
  const isCertified = module.isCertified;

  const handlePress = () => {
    if (onPress) onPress();
    else {
      const targetId = module.moduleNumber ? String(module.moduleNumber) : module.id;
      router.push(`/module/${targetId}`);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={handlePress}
    >
      <View style={styles.topRow}>
        <View style={styles.iconContainer}>
          {getModuleIcon(module.iconName)}
        </View>

        <View style={styles.metaBadges}>
          {(String(module.moduleNumber) === '1' || String(module.moduleNumber) === '2' || module.id === '1' || module.id === '2' || module.id === '6a9853c6b2fbf166c48ee678' || module.id === '6a9853c6b2fbf166c48ee699') ? (
            <View style={styles.arBadge}>
              <Text style={styles.arBadgeText}>{t('common.cameraAr', 'CAMERA AR')}</Text>
            </View>
          ) : (
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonBadgeText}>{t('comingSoon.badge', 'COMING SOON')}</Text>
            </View>
          )}
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {t(`modules.${module.category.toLowerCase()}`, module.category.replace('_', ' '))}
            </Text>
          </View>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {t(`common.${module.difficulty.toLowerCase()}`, module.difficulty)}
            </Text>
          </View>

          {isCertified && (
            <View style={styles.certifiedBadge}>
              <Award size={12} color="#27AE60" />
              <Text style={styles.certifiedText}>{t('home.certified', 'Certified')}</Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      {/* Progress & Duration Row */}
      <View style={styles.progressSection}>
        <View style={styles.durationRow}>
          <Clock size={12} color={COLORS.mutedText} />
          <Text style={styles.durationText}>
            {module.estimatedDurationMinutes} {t('home.mins', 'mins')} • {module.lessonsCount} {t('modules.lessons', 'Lessons')}
          </Text>
        </View>

        {progress > 0 && (
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress}%` },
                  isCertified && { backgroundColor: '#27AE60' }
                ]}
              />
            </View>
            <Text style={styles.progressPercentText}>{progress}%</Text>
          </View>
        )}
      </View>

      {/* Footer Explore Action */}
      <View style={styles.footerRow}>
        <Text style={styles.exploreText}>
          {!(module.id === '1' || module.id === '2' || module.moduleNumber === 1 || module.moduleNumber === 2)
            ? `${t('comingSoon.badge', 'COMING SOON')} →`
            : progress > 0 && progress < 100
            ? t('modules.continueTraining', 'Continue Training')
            : progress === 100
            ? t('assessment.retrain', 'Retrain')
            : t('home.explore', 'Explore Module')}
        </Text>
        <ChevronRight size={14} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8E6',
    ...SHADOWS.card
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  metaBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  arBadge: {
    backgroundColor: 'rgba(0, 168, 150, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 150, 0.3)'
  },
  arBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5
  },
  comingSoonBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: '#FDE68A'
  },
  comingSoonBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5
  },
  difficultyBadge: {
    backgroundColor: '#F0F4F3',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.mutedText,
    textTransform: 'uppercase'
  },
  certifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EAFAF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm
  },
  certifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#27AE60'
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.darkText,
    lineHeight: 20,
    marginBottom: 4
  },
  description: {
    fontSize: 12,
    color: COLORS.mutedText,
    lineHeight: 17,
    marginBottom: 12
  },
  progressSection: {
    marginBottom: 10
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6
  },
  durationText: {
    fontSize: 11,
    color: COLORS.mutedText,
    fontWeight: '500'
  },
  progressBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  progressBarBg: {
    flex: 1,
    height: 5,
    backgroundColor: '#EEF3F2',
    borderRadius: RADIUS.full,
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full
  },
  progressPercentText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.darkText
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F5F4'
  },
  exploreText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary
  }
});
