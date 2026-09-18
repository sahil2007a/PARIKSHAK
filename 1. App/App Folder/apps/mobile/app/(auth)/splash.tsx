import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { ShieldAlert } from 'lucide-react-native';
import { router } from 'expo-router';
import { COLORS, RADIUS, SHADOWS } from '../../constants/theme';
import { mobileApi } from '../../services/api';
import { useLanguage } from '../../localization/i18n';

export default function SplashScreen() {
  const { t } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true
      })
    ]).start();

    const timer = setTimeout(async () => {
      const token = await mobileApi.getAccessToken();
      if (token) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.logoBadge}>
          <ShieldAlert size={48} color="#FFFFFF" />
        </View>

        
          <Text style={styles.brandTitle}>PARISHAK</Text>
        
        <Text style={styles.tagline}>{t('app.tagline', 'Practice. Prove. Protect.')}</Text>

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>{t('auth.suiteSubtitle', 'INDUSTRIAL SAFETY & VERIFICATION SUITE')}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    alignItems: 'center'
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.floating
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.darkText,
    letterSpacing: 1.5
  },
  tagline: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.mutedText,
    letterSpacing: 0.8,
    marginTop: 4
  },
  footerNote: {
    marginTop: 40,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full
  },
  footerText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8
  }
});
