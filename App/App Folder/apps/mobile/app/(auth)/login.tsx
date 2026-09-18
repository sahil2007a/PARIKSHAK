import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image
} from 'react-native';
import { ShieldAlert, User, Lock, Globe, Clock, CheckCircle2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { mobileApi } from '../../services/api';
import { useLanguage } from '../../localization/i18n';
import { SupportedLanguage } from '@parishak/shared';

export default function LoginScreen() {
  const { t, currentLanguage, setAppLanguage } = useLanguage();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false);

  const currentLang = currentLanguage;

  const handleCycleLanguage = () => {
    const next: SupportedLanguage =
      currentLang === 'en' ? 'hi' : currentLang === 'hi' ? 'sat' : 'en';
    setAppLanguage(next);
  };

  const handleLogin = async () => {
    if (!identifier.trim()) {
      setError(t('auth.enterWorkerId', 'Please enter your Worker ID or registered Email'));
      setIsPendingApproval(false);
      return;
    }
    if (!password) {
      setError(t('auth.enterPassword', 'Please enter your password'));
      setIsPendingApproval(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setIsPendingApproval(false);
      await mobileApi.login(identifier.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please verify credentials.';
      setError(msg);
      if (msg.toLowerCase().includes('pending') || msg.toLowerCase().includes('awaiting') || msg.toLowerCase().includes('approval')) {
        setIsPendingApproval(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      t('auth.enterpriseSSO', 'Enterprise SSO'),
      t('auth.ssoNotice', 'Sign in with Enterprise Industrial Single Sign-On is managed by plant admin.')
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Language selector bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.langBadge}
            onPress={handleCycleLanguage}
            activeOpacity={0.7}
          >
            <Globe size={14} color={COLORS.primary} />
            <Text style={styles.langText}>
              {currentLang === 'en' ? 'English' : currentLang === 'hi' ? 'हिन्दी' : 'ᱥᱟᱱᱛᱟᱲᱤ'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.brandName}>PARISHAK</Text>
          <Text style={styles.brandTagline}>Practice. Prove. Protect.</Text>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          <Text style={styles.welcomeTitle}>{t('auth.welcomeBack')}</Text>
          <Text style={styles.welcomeSubtitle}>{t('auth.loginSubtitle')}</Text>

          {/* Pending Approval Callout */}
          {isPendingApproval ? (
            <View style={styles.pendingApprovalBox}>
              <View style={styles.pendingHeader}>
                <Clock size={20} color="#D97706" />
                <Text style={styles.pendingTitle}>{t('auth.awaitingApproval', 'Awaiting Administrator Approval')}</Text>
              </View>
              <Text style={styles.pendingText}>
                {t('auth.awaitingApprovalDesc', 'Your account ({id}) was registered successfully but requires safety administrator approval before you can access training modules.', { id: identifier.toUpperCase() })}
              </Text>
              <Text style={styles.pendingSubtext}>
                {t('auth.askSupervisorApproval', 'Please ask your safety supervisor or plant administrator to approve your registration in the Admin Dashboard.')}
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <InputField
            label={t('auth.workerIdOrEmail')}
            placeholder={t('auth.workerIdPlaceholder', 'e.g. WRK-1002 or email@domain.com')}
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              setError('');
              setIsPendingApproval(false);
            }}
            autoCapitalize="none"
            leftIcon={<User size={18} color={COLORS.mutedText} />}
          />

          <InputField
            label={t('auth.password')}
            placeholder={t('auth.enterPasswordPlaceholder', 'Enter your password')}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
              setIsPendingApproval(false);
            }}
            isPassword
            leftIcon={<Lock size={18} color={COLORS.mutedText} />}
          />

          {/* Forgot Password Link */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>

          {/* Primary Login Action */}
          <Button
            title={t('auth.login')}
            onPress={handleLogin}
            loading={loading}
            size="lg"
            style={styles.loginButton}
          />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('auth.or')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register Navigation */}
          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>{t('auth.dontHaveAccount')} </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLink}>{t('auth.register')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Helper Pill */}
        <TouchableOpacity
          style={styles.demoHelper}
          onPress={() => {
            setIdentifier('WRK-1001');
            setPassword('Safety@2026');
            setError('');
            setIsPendingApproval(false);
          }}
        >
          <Text style={styles.demoHelperText}>
            {t('auth.autoFillDemo', '💡 Tap to Auto-fill WRK-1001 / Safety@2026')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    marginBottom: 8
  },
  langBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#E2E8E6'
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary
  },
  brandHeader: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginBottom: 10,
    ...SHADOWS.floating
  },
  brandName: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.darkText,
    letterSpacing: 2
  },
  brandTagline: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.mutedText,
    marginTop: 2
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E8ECEF',
    ...SHADOWS.floating
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.darkText,
    letterSpacing: -0.5
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: 4,
    marginBottom: SPACING.md
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18
  },
  pendingApprovalBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md
  },
  pendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  pendingTitle: {
    color: '#92400E',
    fontSize: 14,
    fontWeight: '800'
  },
  pendingText: {
    color: '#78350F',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18
  },
  pendingSubtext: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: SPACING.md
  },
  forgotPasswordText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700'
  },
  loginButton: {
    marginTop: SPACING.xs
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB'
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.mutedText,
    textTransform: 'uppercase'
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xs
  },
  registerPrompt: {
    fontSize: 13,
    color: COLORS.mutedText
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary
  },
  demoHelper: {
    marginTop: SPACING.lg,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#E6F7F3',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#B2E5D9'
  },
  demoHelperText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary
  }
});
