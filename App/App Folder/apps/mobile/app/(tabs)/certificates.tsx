import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Award, QrCode, CheckCircle2, ChevronRight, ShieldCheck, ExternalLink } from 'lucide-react-native';
import { Header } from '../../components/Header';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { mobileApi } from '../../services/api';
import { Certificate } from '@parishak/shared';
import { router } from 'expo-router';
import { useLanguage } from '../../localization/i18n';

export default function CertificatesScreen() {
  const { t } = useLanguage();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadCerts = async () => {
    try {
      const data = await mobileApi.getCertificates();
      setCertificates(data);
    } catch (e) {
      console.error('Failed to load certificates', e);
    }
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCerts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t('certificates.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('certificates.subtitle')}
          </Text>
        </View>

        {/* Scan QR Button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => router.push('/qr-scanner')}
          activeOpacity={0.8}
        >
          <QrCode size={16} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>{t('certificates.verifyQr')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {certificates.length === 0 ? (
          <View style={styles.emptyCard}>
            <Award size={44} color={COLORS.mutedText} />
            <Text style={styles.emptyTitle}>{t('certificates.noCertTitle')}</Text>
            <Text style={styles.emptyDesc}>
              {t('certificates.noCertDesc')}
            </Text>
          </View>
        ) : (
          certificates.map((cert) => (
            <TouchableOpacity
              key={cert.id}
              style={styles.certCard}
              activeOpacity={0.85}
              onPress={() => router.push(`/certificate/${cert.id}`)}
            >
              
              <View style={styles.certTopRow}>
                <View style={styles.badgeIcon}>
                  <ShieldCheck size={22} color={COLORS.primary} />
                </View>
                <View style={styles.statusPill}>
                  <CheckCircle2 size={12} color="#27AE60" />
                  <Text style={styles.statusText}>{cert.status}</Text>
                </View>
              </View>

              <Text style={styles.certModuleTitle}>{cert.moduleTitle}</Text>
              <Text style={styles.certCode}>{cert.certificateId}</Text>

              <View style={styles.metaRow}>
                <View>
                  <Text style={styles.metaLabel}>{t('certificates.issueDate')}</Text>
                  <Text style={styles.metaValue}>
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </Text>
                </View>

                <View>
                  <Text style={styles.metaLabel}>{t('common.status', 'Status')}</Text>
                  <Text style={[styles.metaValue, { color: cert.status === 'VALID' ? '#27AE60' : '#E74C3C', fontWeight: '800' }]}>
                    {cert.status}
                  </Text>
                </View>

                <View>
                  <Text style={styles.metaLabel}>{t('assessment.score', 'Score')}</Text>
                  <Text style={[styles.metaValue, { color: COLORS.primary, fontWeight: '800' }]}>
                    {cert.score}%
                  </Text>
                </View>
              </View>

              <View style={styles.adminVerifiedRow}>
                <CheckCircle2 size={13} color="#16A34A" />
                <Text style={styles.adminVerifiedText}>
                  {t('certificates.officialBadge')}
                </Text>
              </View>

              <View style={styles.certFooter}>
                <Text style={styles.viewDetailsText}>{t('certificates.view')} & QR</Text>
                <ChevronRight size={15} color={COLORS.primary} />
              </View>
            </TouchableOpacity>
          ))
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
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.darkText
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 2,
    maxWidth: 220
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    ...SHADOWS.sm
  },
  scanButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: 24
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#E2E8E6',
    marginTop: SPACING.md
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.darkText,
    marginTop: 12
  },
  emptyDesc: {
    fontSize: 12,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18
  },
  certCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.md + 2,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8E6',
    ...SHADOWS.card
  },
  certTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAFAF1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.sm
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#27AE60'
  },
  certModuleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 2
  },
  certCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAF9',
    padding: 10,
    borderRadius: RADIUS.md,
    marginBottom: 10
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.mutedText,
    marginBottom: 2
  },
  metaValue: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.darkText
  },
  adminVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: RADIUS.sm,
    marginBottom: 8
  },
  adminVerifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#16A34A'
  },
  certFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F2F5F4'
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary
  }
});
