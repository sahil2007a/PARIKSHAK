import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions
} from 'react-native';
import { ShieldAlert, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useLanguage } from '../localization/i18n';

interface HeroBannerProps {
  onPressCTA: () => void;
  greetingWorkerName?: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onPressCTA,
  greetingWorkerName = 'Worker'
}) => {
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <ImageBackground
          source={require('../assets/hero_banner.jpg')}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <LinearGradient
            colors={[
              'rgba(11, 27, 49, 0.94)',
              'rgba(11, 27, 49, 0.82)',
              'rgba(11, 27, 49, 0.40)'
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradientOverlay}
          >
            <View style={styles.heroContent}>
              {/* Priority Pill Badge */}
              <View style={styles.priorityBadge}>
                <ShieldAlert size={12} color="#FFFFFF" />
                <Text style={styles.priorityBadgeText}>{t('common.priority', 'PRIORITY')}</Text>
              </View>

              {/* Bold Headline */}
              <Text style={styles.heroTitle}>
                {t('home.heroTitle', 'TRAIN TODAY.\nSTAY SAFE\nTOMORROW.')}
              </Text>

              {/* Subtitle */}
              <Text style={styles.heroSubtitle}>
                {t('home.heroSubtitle', 'Build practical skills to respond safely in real situations.')}
              </Text>

              {/* Pill Action Button */}
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={onPressCTA}
                activeOpacity={0.85}
              >
                <Text style={styles.ctaButtonText}>{t('home.continueTraining')}</Text>
                <ArrowRight size={15} color="#065F46" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#0B1B31',
    minHeight: 220,
    ...SHADOWS.floating
  },
  imageBackground: {
    width: '100%',
    minHeight: 220
  },
  gradientOverlay: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center'
  },
  heroContent: {
    maxWidth: '78%'
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EA580C',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    marginBottom: 12
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 28,
    letterSpacing: 0.3
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.86)',
    lineHeight: 17,
    marginTop: 8,
    marginBottom: 16
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    ...SHADOWS.sm
  },
  ctaButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46'
  }
});

