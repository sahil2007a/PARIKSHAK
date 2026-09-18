import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { ShieldAlert, Award, Wrench, ArrowRight, CheckCircle2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/Button';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { t } from '../../localization/i18n';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Practice with Real-World Safety Drills',
      desc: 'Interactive 2D simulations for PASS extinguisher drills, toxic gas leak protocols, and zero-energy lockout/tagout isolations.',
      icon: Wrench,
      tag: 'PRACTICE'
    },
    {
      title: 'Prove Competency in Timed Assessments',
      desc: 'Authoritative evaluation across knowledge, hazard recognition, procedural execution, and statutory safety compliance.',
      icon: Award,
      tag: 'PROVE'
    },
    {
      title: 'Protect Yourself & Your Co-Workers',
      desc: 'Earn digitally verified QR certificates for on-site clearance and DGMS regulatory compliance.',
      icon: ShieldAlert,
      tag: 'PROTECT'
    }
  ];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const current = slides[slide];
  const Icon = current.icon;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <ShieldAlert size={22} color={COLORS.primary} />
          <Text style={styles.brandTitle}>PARISHAK</Text>
        </View>
        <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
          <Text style={styles.skipText}>{t('common.skip', 'Skip')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Visual Graphic Box */}
        <View style={styles.graphicBox}>
          <View style={styles.iconCircle}>
            <Icon size={54} color="#FFFFFF" />
          </View>
          
            {current.tag}
          
        </View>

        {/* Slide Indicators */}
        <View style={styles.indicatorRow}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                slide === idx && styles.dotActive
              ]}
            />
          ))}
        </View>

        
          <Text style={styles.slideTitle}>{current.title}</Text>
        
        <Text style={styles.slideDesc}>{current.desc}</Text>
      </View>

      <View style={styles.footer}>
        <Button
          title={slide === slides.length - 1 ? 'Get Started' : 'Next Step →'}
          onPress={handleNext}
          size="lg"
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.darkText,
    letterSpacing: 0.5
  },
  skipText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.mutedText
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  graphicBox: {
    width: 140,
    height: 140,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    ...SHADOWS.card
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.floating
  },
  indicatorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1'
  },
  dotActive: {
    width: 24,
    backgroundColor: COLORS.primary
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.darkText,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 10
  },
  slideDesc: {
    fontSize: 13,
    color: COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl
  }
});
