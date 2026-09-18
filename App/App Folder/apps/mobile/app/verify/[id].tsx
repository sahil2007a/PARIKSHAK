import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
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
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  Calendar,
  Award
} from 'lucide-react-native';
import { mobileApi } from '../../services/api';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { CertificateVerificationResult } from '@parishak/shared';
import { useLanguage } from '../../localization/i18n';

export default function VerifyResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useLanguage();
  const [data, setData] = useState<CertificateVerificationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      mobileApi.verifyCertificate(id).then((res) => {
        setData(res);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{t('verify.verifying', 'Verifying with PARIKSHAK Registry...')}</Text>
      </SafeAreaView>
    );
  }

  const isValid = data?.isValid && data?.status === 'VALID';
  const isRevoked = data?.status === 'REVOKED';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>{t('verify.registryVerification', 'Registry Verification')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {isValid ? (
          <View style={styles.verifiedCard}>
            <View style={styles.iconCircleSuccess}>
              <ShieldCheck size={44} color="#27AE60" />
            </View>

            <Text style={styles.verifiedTitle}>{t('verify.officialVerified', 'Official Credential Verified')}</Text>
            <Text style={styles.verifiedSub}>
              {t('verify.verifiedSub', 'This digital certificate is active and authenticated directly against central PARIKSHAK records.')}
            </Text>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('profile.fullName', 'Worker Name')}</Text>
                <Text style={styles.infoValue}>{data.workerName || t('verify.certifiedWorker', 'Certified Worker')}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('profile.workerId', 'Worker ID')}</Text>
                <Text style={[styles.infoValue, { fontFamily: 'monospace', color: COLORS.primary }]}>
                  {data.workerIdMasked || '***'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('verify.qualification', 'Qualification')}</Text>
                <Text style={styles.infoValue}>{data.moduleTitle}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('profile.plantLocation', 'Organization')}</Text>
                <Text style={styles.infoValue}>{data.organizationName}</Text>
              </View>

              {data.score !== undefined && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('common.score', 'Score')}</Text>
                  <Text style={[styles.infoValue, { color: '#27AE60', fontWeight: '800' }]}>
                    {data.score}%
                  </Text>
                </View>
              )}

              {data.issueDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('certificate.dateOfIssuance', 'Issue Date')}</Text>
                  <Text style={styles.infoValue}>
                    {new Date(data.issueDate).toLocaleDateString()}
                  </Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t('verify.certId', 'Certificate ID')}</Text>
                <Text style={[styles.infoValue, { fontFamily: 'monospace', color: COLORS.primary }]}>
                  {data.certificateId}
                </Text>
              </View>
            </View>
          </View>
        ) : isRevoked ? (
          <View style={styles.invalidCard}>
            <View style={styles.iconCircleWarning}>
              <AlertCircle size={44} color="#D97706" />
            </View>
            <Text style={[styles.invalidTitle, { color: '#D97706' }]}>{t('verify.certRevoked', 'Certificate Revoked')}</Text>
            <Text style={styles.invalidSub}>
              {data?.message || t('verify.revokedSub', 'This safety certificate was revoked by an administrator.')}
            </Text>

            {data?.certificateId && (
              <View style={[styles.infoBox, { marginTop: 16 }]}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('verify.certId', 'Certificate ID')}</Text>
                  <Text style={styles.infoValue}>{data.certificateId}</Text>
                </View>
                {data.moduleTitle && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{t('verify.qualification', 'Qualification')}</Text>
                    <Text style={styles.infoValue}>{data.moduleTitle}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.invalidCard}>
            <View style={styles.iconCircleDanger}>
              <AlertCircle size={44} color="#E74C3C" />
            </View>
            <Text style={styles.invalidTitle}>{t('verify.noCertFound', 'No Certificate Found')}</Text>
            <Text style={styles.invalidSub}>
              {t('verify.notFoundSub', 'No active certificate matching this ID exists in the PARIKSHAK verification registry.')}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkText
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 6,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9EFEF'
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.darkText
  },
  scrollContent: {
    padding: SPACING.md
  },
  verifiedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4E2DE',
    ...SHADOWS.card
  },
  iconCircleSuccess: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EAFAF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md
  },
  iconCircleWarning: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md
  },
  verifiedTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.darkText,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  verifiedSub: {
    fontSize: 12,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: SPACING.sm
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#F8FAF9',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E9EFEF',
    gap: 12
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.mutedText,
    fontWeight: '700',
    textTransform: 'uppercase'
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkText,
    textAlign: 'right',
    maxWidth: '65%'
  },
  invalidCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FADBD8',
    ...SHADOWS.card
  },
  iconCircleDanger: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FDEDEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md
  },
  invalidTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#E74C3C',
    textAlign: 'center'
  },
  invalidSub: {
    fontSize: 12,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18
  }
});
