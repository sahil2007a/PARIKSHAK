import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Award, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useLanguage } from '../localization/i18n';
import { router } from 'expo-router';

interface ProgressCardProps {
  progressPercentage?: number;
  completedCount?: number;
  totalCount?: number;
  isCertified?: boolean;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  progressPercentage = 68,
  completedCount = 4,
  totalCount = 5,
  isCertified = true
}) => {
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/progress')}
      >
        
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.cardTitle}>{t('home.overallProgress')}</Text>
            <Text style={styles.subtitle}>
              {completedCount} of {totalCount} modules {t('home.modulesCompleted')}
            </Text>
          </View>

          <View style={styles.percentBadge}>
            <Text style={styles.percentText}>{progressPercentage}%</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.min(100, progressPercentage)}%` }
            ]}
          />
        </View>

        {/* Footer Status */}
        <View style={styles.footerRow}>
          <View style={styles.certBadge}>
            <Award size={13} color={COLORS.primary} />
            <Text style={styles.certText}>
              {isCertified ? t('home.certified') : 'In Progress'}
            </Text>
          </View>

          <View style={styles.detailsLink}>
            <Text style={styles.detailsText}>View Breakdown</Text>
            <ChevronRight size={13} color={COLORS.primary} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkText
  },
  subtitle: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: 2
  },
  percentBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.md
  },
  percentText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#EEF3F2',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: 12
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  certText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },
  detailsText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary
  }
});
