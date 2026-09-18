import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { ArrowLeft, User, KeyRound, CheckCircle2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../localization/i18n';

export default function ForgotPasswordScreen() {
  const { t } = useLanguage();
  const [identifier, setIdentifier] = useState('WRK-1001');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRequestReset = () => {
    if (!identifier.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{t('auth.passwordRecovery', 'Password Recovery')}</Text>
      <Text style={styles.subtitle}>
        {t('auth.forgotSubtitle', 'Enter your Worker ID or registered phone to receive verification code')}
      </Text>

      <View style={styles.card}>
        {submitted ? (
          <View style={styles.successBlock}>
            <View style={styles.successIcon}>
              <CheckCircle2 size={36} color={COLORS.success} />
            </View>
            <Text style={styles.successTitle}>{t('auth.resetVerificationInitiated', 'Reset Verification Initiated')}</Text>
            <Text style={styles.successText}>
              {t('auth.otpDispatched', 'A 6-digit OTP verification code has been dispatched to the registered mobile associated with {id}.', { id: identifier })}
            </Text>
            <Button
              title={t('auth.returnToLogin', 'Return to Login Screen')}
              onPress={() => router.replace('/(auth)/login')}
              size="md"
              style={{ marginTop: 16 }}
            />
          </View>
        ) : (
          <>
            <InputField
              label={t('auth.workerIdOrPhone', 'Worker ID or Phone Number')}
              placeholder={t('auth.workerIdPlaceholder', 'e.g. WRK-1001')}
              value={identifier}
              onChangeText={setIdentifier}
              leftIcon={<User size={18} color={COLORS.mutedText} />}
            />

            <Button
              title={t('auth.sendOtp', 'Send Verification OTP')}
              onPress={handleRequestReset}
              loading={loading}
              size="lg"
              style={{ marginTop: 8 }}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: SPACING.xl
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.darkText
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: 2,
    marginBottom: 18
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E2E8E6',
    ...SHADOWS.card
  },
  successBlock: {
    alignItems: 'center',
    paddingVertical: 10
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.successLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 6
  },
  successText: {
    fontSize: 12,
    color: COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 18
  }
});
