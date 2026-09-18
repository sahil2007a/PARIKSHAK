import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
  Linking,
  Image
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  Award,
  ShieldCheck,
  QrCode,
  Share2,
  Calendar,
  Building,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  RotateCcw
} from 'lucide-react-native';
import { mobileApi } from '../../services/api';
import { Certificate } from '@parishak/shared';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../localization/i18n';

export default function CertificateDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useLanguage();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);

  const fetchCertificate = async (attempt: number = 0) => {
    if (!id) {
      setError('No certificate identifier specified.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Direct fetch by ID
      const directMatch = await mobileApi.getCertificateById(id);
      if (directMatch) {
        setCert(directMatch);
        setLoading(false);
        return;
      }

      // 2. Lookup in worker's full certificates list
      const certs = await mobileApi.getCertificates();
      const cleanId = id.trim().toUpperCase();
      const found = certs.find(
        (c) =>
          c.id === id ||
          c.certificateId?.toUpperCase() === cleanId ||
          c.verificationToken === id ||
          (c as any).assessmentAttemptId === id
      );

      if (found) {
        setCert(found);
        setLoading(false);
        return;
      }

      // 3. If just passed exam, certificate might still be persisting to MongoDB
      if (attempt < 2) {
        setTimeout(() => {
          fetchCertificate(attempt + 1);
        }, 1200);
        return;
      }

      // 4. If not found after retries
      setError('Certificate is being generated or could not be found. Please tap Retry or view your profile certifications.');
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to load safety credential. Please check connection and retry.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificate(0);
  }, [id]);

  const handleShare = async () => {
    if (!cert) return;
    try {
      await Share.share({
        message: `PARISHAK Safety Certificate: ${cert.workerName} has achieved certified qualification in ${cert.moduleTitle} (ID: ${cert.certificateId}). Verified on PARISHAK platform.`
      });
    } catch (e: any) {
      console.log('Share error', e);
    }
  };

  // State 1: LOADING
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingTitle}>{t('certificate.loadingCredential', 'Loading Safety Credential...')}</Text>
        <Text style={styles.loadingSub}>{t('certificate.verifyingSeal', 'Verifying digital safety seal on PARIKSHAK ledger...')}</Text>
      </SafeAreaView>
    );
  }

  // State 2: ERROR / NOT FOUND (Eliminates infinite loading stuck bug!)
  if (error || !cert) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.topBar, { justifyContent: 'center' }]}>
          <Text style={styles.topBarTitle}>{t('certificate.safetyCredential', 'Safety Credential')}</Text>
        </View>

        <View style={styles.errorCardContainer}>
          <View style={styles.errorIconCircle}>
            <AlertTriangle size={36} color="#E74C3C" />
          </View>
          <Text style={styles.errorTitle}>{t('certificate.notice', 'Certificate Notice')}</Text>
          <Text style={styles.errorDescription}>
            {error || t('certificate.fetchError', 'Unable to retrieve the safety certificate. If you recently passed the exam, issuance may take a few seconds.')}
          </Text>

          <View style={styles.errorActions}>
            <Button
              title={t('certificate.retryLoading', 'Retry Loading Certificate')}
              onPress={() => fetchCertificate(0)}
              size="lg"
              style={{ width: '100%', marginBottom: 12 }}
            />

            <Button
              title={t('certificate.viewAllCertifications', 'View All My Certifications')}
              onPress={() => router.replace('/(tabs)/certificates')}
              variant="secondary"
              size="lg"
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // State 3: SUCCESS

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header />
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>{t('certificate.credentialTitle', 'Safety Credential')}</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton} activeOpacity={0.7}>
          <Share2 size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Certificate Card */}
        <View style={styles.certCard}>
          {/* Certificate Header Emblem */}
          <View style={styles.certHeader}>
            <View style={styles.emblemBadge}>
              <ShieldCheck size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.certOrgName}>{cert.organizationName}</Text>
            <Text style={styles.certStandardSubtitle}>{t('certificate.standardSubtitle', 'PARIKSHAK INDUSTRIAL SAFETY STANDARD')}</Text>
          </View>

          <View style={styles.divider} />

          {/* Certificate Body */}
          
          <Text style={styles.certMainTitle}>{t('certificate.certTitle', 'Safety Qualification Certificate')}</Text>
          <Text style={styles.certCertifiesText}>{t('certificate.certifiesText', 'This document officially certifies that')}</Text>

          <Text style={styles.workerNameText}>{cert.workerName}</Text>
          <Text style={styles.workerIdTag}>{t('profile.workerId', 'Worker ID')}: {cert.workerId}</Text>

          <Text style={styles.completionText}>
            {t('certificate.completionBody', 'has successfully passed theoretical evaluation and simulated industrial emergency execution in')}
          </Text>

          <Text style={styles.moduleNameText}>{cert.moduleTitle}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.scoreBadge}>
              <Award size={14} color={COLORS.primary} />
              <Text style={styles.scoreBadgeText}>{t('certificate.examScore', 'Examination Score')}: {cert.score}%</Text>
            </View>
            <View style={styles.statusBadge}>
              <CheckCircle2 size={14} color="#27AE60" />
              <Text style={styles.statusBadgeText}>{t('certificate.activeVerified', 'ACTIVE VERIFIED')}</Text>
            </View>
          </View>

          {/* QR Verification Section */}
          <View style={styles.qrBox}>
            <View style={styles.qrIconWrapper}>
              {cert.qrCodeDataUrl ? (
                <Image
                  source={{ uri: cert.qrCodeDataUrl }}
                  style={{ width: 130, height: 130 }}
                  resizeMode="contain"
                />
              ) : (
                <QrCode size={110} color={COLORS.darkText} />
              )}
            </View>
            <Text style={styles.certIdCode}>{cert.certificateId}</Text>
            <Text style={styles.qrVerificationNote}>
              {t('certificate.scanNote', 'Scan on-site via PARIKSHAK Mobile Scanner or public registry to verify authenticity.')}
            </Text>
          </View>

          {/* Issue Date & Status Metadata */}
          <View style={styles.metaBox}>
            <View style={styles.metaItem}>
              <Text style={styles.metaItemLabel}>{t('certificate.dateOfIssuance', 'DATE OF ISSUANCE')}</Text>
              <Text style={styles.metaItemValue}>
                {new Date(cert.issueDate).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Text style={styles.metaItemLabel}>{t('certificate.statusLabel', 'STATUS')}</Text>
              <Text style={[styles.metaItemValue, { color: cert.status === 'VALID' ? '#27AE60' : '#E74C3C', fontWeight: '800' }]}>
                {cert.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Verification & Download Actions */}
        <View style={{ gap: 10, marginTop: 16 }}>
          <Button
            title={`${t('certificate.downloadPdf', 'Download Official PDF')} 📄`}
            onPress={() => {
              const pdfUrl = `http://localhost:5000/api/v1/certificates/${cert.certificateId}/pdf`;
              Linking.openURL(pdfUrl).catch(() => {
                Alert.alert(t('certificate.downloadPdf', 'Download Official PDF'), t('common.error', 'Unable to open PDF download.'));
              });
            }}
            size="lg"
          />
          <Button
            title={`${t('certificate.openWebRegistry', 'Open Web Verification Registry')} 🌐`}
            onPress={() => {
              const url = cert.verificationUrl || `http://localhost:5173/verify/${cert.certificateId}`;
              Linking.openURL(url).catch(() => {
                router.push(`/verify/${cert.certificateId}`);
              });
            }}
            size="md"
            variant="secondary"
          />
          <Button
            title="In-App Credential Check"
            onPress={() => router.push(`/verify/${cert.certificateId}`)}
            size="md"
            variant="secondary"
          />
        </View>
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
    padding: SPACING.xl
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkText,
    marginTop: 16
  },
  loadingSub: {
    fontSize: 12,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 6
  },
  errorCardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginHorizontal: SPACING.lg
  },
  errorIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FDEDEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.darkText,
    marginBottom: 8,
    textAlign: 'center'
  },
  errorDescription: {
    fontSize: 13,
    color: COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24
  },
  errorActions: {
    width: '100%',
    alignItems: 'center'
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9EFEF'
  },
  shareButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F5F8F7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.darkText
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl
  },
  certCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4E6E1',
    ...SHADOWS.floating
  },
  certHeader: {
    alignItems: 'center',
    marginBottom: 10
  },
  emblemBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...SHADOWS.sm
  },
  certOrgName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.darkText,
    textAlign: 'center'
  },
  certStandardSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
    marginTop: 2
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8E6',
    marginVertical: 12
  },
  certMainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.darkText,
    textAlign: 'center',
    letterSpacing: 0.3
  },
  certCertifiesText: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: 4,
    marginBottom: 8
  },
  workerNameText: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primaryDark,
    textAlign: 'center'
  },
  workerIdTag: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: COLORS.mutedText,
    marginTop: 2,
    marginBottom: 10
  },
  completionText: {
    fontSize: 11,
    color: COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 10,
    marginBottom: 6
  },
  moduleNameText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.darkText,
    textAlign: 'center',
    marginBottom: 12
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm
  },
  scoreBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAFAF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#27AE60'
  },
  qrBox: {
    backgroundColor: '#F8FAF9',
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8E6'
  },
  qrIconWrapper: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: RADIUS.md,
    marginBottom: 8
  },
  certIdCode: {
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5
  },
  qrVerificationNote: {
    fontSize: 10,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 14
  },
  metaBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#F8FAF9',
    padding: 12,
    borderRadius: RADIUS.md,
    marginBottom: 12
  },
  metaItem: {
    alignItems: 'center',
    flex: 1
  },
  metaItemLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.mutedText,
    marginBottom: 2
  },
  metaItemValue: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.darkText
  },
  tokenBox: {
    width: '100%',
    backgroundColor: '#F0F4F3',
    padding: 8,
    borderRadius: RADIUS.sm
  },
  tokenLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.mutedText,
    marginBottom: 2,
    textAlign: 'center'
  },
  tokenValue: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: COLORS.darkText,
    textAlign: 'center'
  }
});
