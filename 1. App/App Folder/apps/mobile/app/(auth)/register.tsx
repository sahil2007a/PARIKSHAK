import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { ShieldCheck, User, Phone, Mail, Building, Briefcase, Lock, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/Button';
import { InputField } from '../../components/InputField';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { mobileApi } from '../../services/api';
import { useLanguage } from '../../localization/i18n';

export default function RegisterScreen() {
  const { t } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('Bharat Minerals & Steel');
  const [sector, setSector] = useState<'MINING' | 'STEEL' | 'MICA' | 'GENERAL'>('MINING');
  const [jobRole, setJobRole] = useState('');
  const [experienceYears, setExperienceYears] = useState('3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  const handleRegister = async () => {
    if (!fullName || !workerId || !phone || !password || !jobRole) {
      setError(t('auth.mandatoryFieldsError', 'Please fill in all mandatory worker profile fields (*)'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await mobileApi.register({
        fullName: fullName.trim(),
        workerId: workerId.toUpperCase().trim(),
        phone: phone.trim(),
        email: email ? email.trim() : undefined,
        password,
        organizationName: organizationName.trim(),
        sector,
        jobRole: jobRole.trim(),
        experienceYears: parseInt(experienceYears, 10) || 0,
        preferredLanguage: 'en'
      });
      setRegisteredUser(res.user || { workerId: workerId.toUpperCase().trim(), fullName: fullName.trim() });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (registeredUser) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.successScroll}>
          <View style={styles.successCard}>
            <View style={styles.successIconBadge}>
              <CheckCircle2 size={48} color="#FFFFFF" />
            </View>

            <Text style={styles.successTitle}>{t('auth.registrationSubmitted', 'Registration Submitted!')}</Text>
            <Text style={styles.successSubtitle}>
              {t('auth.successSubtitle', 'Your worker account has been created in the Safety Database.')}
            </Text>

            <View style={styles.statusBox}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>{t('auth.workerIdLabel', 'Worker ID:')}</Text>
                <Text style={styles.statusValue}>{registeredUser.workerId}</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>{t('auth.fullNameLabel', 'Full Name:')}</Text>
                <Text style={styles.statusValue}>{registeredUser.fullName}</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>{t('auth.accountStatusLabel', 'Account Status:')}</Text>
                <View style={styles.pendingBadge}>
                  <Clock size={12} color="#D97706" />
                  <Text style={styles.pendingBadgeText}>{t('auth.pendingApproval', 'PENDING APPROVAL')}</Text>
                </View>
              </View>
            </View>

            <View style={styles.infoNotice}>
              <Text style={styles.infoNoticeText}>
                ⚠️ <Text style={{ fontWeight: '800' }}>{t('auth.mandatoryApproval', 'Mandatory Admin Approval:')}</Text> {t('auth.mandatoryApprovalDetail', 'Before you can log in and access safety drills, your Plant Safety Administrator must verify and approve your registration from the Admin Portal.')}
              </Text>
            </View>

            <Button
              title={t('auth.returnToLogin', 'Return to Login Screen')}
              onPress={() => router.replace('/(auth)/login')}
              size="lg"
              style={styles.loginReturnButton}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

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
        <Text style={styles.title}>{t('auth.registerTitle')}</Text>
        <Text style={styles.subtitle}>{t('auth.registerSubtitle')}</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <InputField
            label={t('auth.fullName') + ' *'}
            placeholder={t('auth.fullNamePlaceholder', 'e.g. Vikram Singh Munda')}
            value={fullName}
            onChangeText={(v) => {
              setFullName(v);
              setError('');
            }}
            leftIcon={<User size={18} color={COLORS.mutedText} />}
          />

          <InputField
            label={t('auth.workerIdTagLabel', 'Worker ID (Plant / Mine Tag) *')}
            placeholder={t('auth.workerIdTagPlaceholder', 'e.g. WRK-2099')}
            value={workerId}
            onChangeText={(v) => {
              setWorkerId(v);
              setError('');
            }}
            autoCapitalize="characters"
            leftIcon={<ShieldCheck size={18} color={COLORS.mutedText} />}
          />

          <InputField
            label={t('auth.phone') + ' *'}
            placeholder={t('auth.phonePlaceholder', 'e.g. +91 98765 43210')}
            value={phone}
            onChangeText={(v) => {
              setPhone(v);
              setError('');
            }}
            keyboardType="phone-pad"
            leftIcon={<Phone size={18} color={COLORS.mutedText} />}
          />

          <InputField
            label={t('auth.email') + ' (Optional)'}
            placeholder={t('auth.emailPlaceholder', 'e.g. vikram@safety.plant')}
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={18} color={COLORS.mutedText} />}
          />

          <InputField
            label={t('auth.password') + ' *'}
            placeholder={t('auth.passwordPlaceholder', 'Minimum 8 characters')}
            value={password}
            onChangeText={(v) => {
              setPassword(v);
              setError('');
            }}
            isPassword
            leftIcon={<Lock size={18} color={COLORS.mutedText} />}
          />

          <InputField
            label={t('auth.companyLabel', 'Plant / Enterprise Name *')}
            placeholder={t('auth.companyPlaceholder', 'e.g. Bharat Minerals & Steel')}
            value={organizationName}
            onChangeText={setOrganizationName}
            leftIcon={<Building size={18} color={COLORS.mutedText} />}
          />

          <View style={styles.sectorPickerContainer}>
            <Text style={styles.fieldLabel}>{t('auth.industrySectorLabel', 'Industry Sector *')}</Text>
            <View style={styles.sectorChips}>
              {(['MINING', 'STEEL', 'MICA', 'GENERAL'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSector(s)}
                  style={[
                    styles.sectorChip,
                    sector === s && styles.sectorChipActive
                  ]}
                >
                  <Text
                    style={[
                      styles.sectorChipText,
                      sector === s && styles.sectorChipTextActive
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <InputField
            label={t('auth.jobRoleLabel', 'Designated Job Role *')}
            placeholder={t('auth.rolePlaceholder', 'e.g. Haul Truck Operator, Miner')}
            value={jobRole}
            onChangeText={(v) => {
              setJobRole(v);
              setError('');
            }}
            leftIcon={<Briefcase size={18} color={COLORS.mutedText} />}
          />

          <InputField
            label={t('auth.experienceYearsLabel', 'Industry Experience (Years)')}
            placeholder={t('auth.expPlaceholder', 'e.g. 4')}
            value={experienceYears}
            onChangeText={setExperienceYears}
            keyboardType="numeric"
          />

          <Button
            title={t('auth.submitRegistration', 'Submit Registration for Safety Approval')}
            onPress={handleRegister}
            loading={loading}
            size="lg"
            style={styles.submitButton}
          />
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>{t('auth.alreadyHaveAccountPrompt', 'Already have an approved account? ')}</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.loginLink}>{t('auth.login')}</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: SPACING.xl
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.darkText,
    letterSpacing: -0.5
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: 2,
    marginBottom: SPACING.md
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#FCA5A5'
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E8ECEF',
    ...SHADOWS.floating
  },
  sectorPickerContainer: {
    marginBottom: SPACING.md
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 6
  },
  sectorChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  sectorChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    backgroundColor: '#F0F4F3',
    borderWidth: 1,
    borderColor: '#E2E8E6'
  },
  sectorChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  sectorChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.darkText
  },
  sectorChipTextActive: {
    color: '#FFFFFF'
  },
  submitButton: {
    marginTop: SPACING.sm
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.lg
  },
  loginPrompt: {
    fontSize: 13,
    color: COLORS.mutedText
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary
  },
  successScroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    paddingVertical: 40
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8ECEF',
    ...SHADOWS.floating
  },
  successIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16A085',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.floating
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.darkText,
    textAlign: 'center'
  },
  successSubtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: SPACING.md
  },
  statusBox: {
    width: '100%',
    backgroundColor: '#F8FAF9',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E1E8E6',
    gap: 8,
    marginBottom: SPACING.md
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mutedText
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.darkText
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#F59E0B'
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E'
  },
  infoNotice: {
    backgroundColor: '#EFF6FF',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: SPACING.lg,
    width: '100%'
  },
  infoNoticeText: {
    fontSize: 11,
    color: '#1E40AF',
    lineHeight: 16
  },
  loginReturnButton: {
    width: '100%'
  }
});
