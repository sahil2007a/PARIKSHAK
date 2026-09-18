import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Award, Brain, CheckCircle2, Eye, ShieldCheck, Wrench, ShieldAlert } from 'lucide-react-native';
import { Header } from '../../components/Header';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { mobileApi } from '../../services/api';
import { TrainingModule, Certificate } from '@parishak/shared';
import { useLanguage } from '../../localization/i18n';

export default function ProgressScreen() {
  const { t } = useLanguage();
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [mods, certs] = await Promise.all([
        mobileApi.getModules(),
        mobileApi.getCertificates()
      ]);
      setModules(mods);
      setCertificates(certs);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const completedCount = modules.filter((m) => m.isCertified || (m.progressPercentage && m.progressPercentage >= 100)).length;
  const progressRatio = modules.length > 0 ? completedCount / modules.length : 0;
  const overallPercentage = Math.round(progressRatio * 100);

  // Dynamic competency domains based on actual progress
  const baseScore = overallPercentage;
  const competencyDomains = [
    {
      name: t('progress.hazardDomain'),
      score: completedCount > 0 ? Math.min(100, Math.round(baseScore * 1.05)) : 0,
      desc: t('progress.hazardDomainDesc'),
      icon: Eye,
      color: '#16A085'
    },
    {
      name: t('progress.proceduralDomain'),
      score: completedCount > 0 ? Math.min(100, Math.round(baseScore * 0.95)) : 0,
      desc: t('progress.proceduralDomainDesc'),
      icon: Wrench,
      color: '#0E6655'
    },
    {
      name: t('progress.complianceDomain'),
      score: completedCount > 0 ? Math.min(100, Math.round(baseScore * 1.0)) : 0,
      desc: t('progress.complianceDomainDesc'),
      icon: ShieldCheck,
      color: '#27AE60'
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('progress.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('progress.subtitle')}
          </Text>
        </View>

        {/* Overall Score Circle Card */}
        <View style={styles.scoreHeroCard}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreBigNumber}>{overallPercentage}%</Text>
            <Text style={styles.scoreCircleLabel}>{t('progress.overallIndex')}</Text>
          </View>

          <View style={styles.scoreHeroDetails}>
            <View style={[styles.statusBadge, { backgroundColor: overallPercentage >= 75 ? '#27AE60' : overallPercentage > 0 ? '#F39C12' : '#7A8793' }]}>
              <Award size={14} color="#FFFFFF" />
              <Text style={styles.statusBadgeText}>
                {overallPercentage >= 75 ? t('home.certified') : overallPercentage > 0 ? t('profile.inProgress') : t('progress.overallIndex')}
              </Text>
            </View>
            <Text style={styles.scoreHeroTitle}>
              {overallPercentage >= 75
                ? t('progress.highCompetency', 'High Safety Competency')
                : overallPercentage > 0
                ? t('progress.developingCompetency', 'Developing Competency')
                : t('progress.newWorkerInduction', 'New Worker Induction')}
            </Text>
            <Text style={styles.scoreHeroDesc}>
              {overallPercentage > 0
                ? t('progress.modulesCompletedSummary', '{completed} of {total} modules completed. {certs} digital certificates issued.', {
                    completed: completedCount,
                    total: modules.length,
                    certs: certificates.length
                  })
                : t('progress.startFirstModule', 'Start your first training module to establish your verified industrial safety competency record.')}
            </Text>
          </View>
        </View>

        {/* Competency Breakdown Cards */}
        <Text style={styles.sectionTitle}>{t('progress.competencyBreakdown', 'Competency Domain Breakdown')}</Text>

        <View style={styles.domainsList}>
          {competencyDomains.map((domain, idx) => {
            const Icon = domain.icon;
            return (
              <View key={idx} style={styles.domainCard}>
                <View style={styles.domainHeader}>
                  <View style={styles.domainLeft}>
                    <View
                      style={[
                        styles.domainIconContainer,
                        { backgroundColor: `${domain.color}15` }
                      ]}
                    >
                      <Icon size={18} color={domain.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.domainName}>{domain.name}</Text>
                      <Text style={styles.domainDesc}>{domain.desc}</Text>
                    </View>
                  </View>

                  <Text style={[styles.domainScore, { color: domain.color }]}>
                    {domain.score}%
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${domain.score}%`, backgroundColor: domain.color }
                    ]}
                  />
                </View>
              </View>
            );
          })}
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
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: 24
  },
  header: {
    marginBottom: SPACING.md
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.darkText,
    letterSpacing: -0.5
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: 4
  },
  scoreHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: '#E8ECEF',
    marginBottom: SPACING.lg,
    ...SHADOWS.floating
  },
  scoreCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#16A085',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#E8F8F5'
  },
  scoreBigNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  scoreCircleLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    textTransform: 'uppercase'
  },
  scoreHeroDetails: {
    flex: 1
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#16A085',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: 6
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  scoreHeroTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkText
  },
  scoreHeroDesc: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: 2,
    lineHeight: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: SPACING.sm
  },
  domainsList: {
    gap: SPACING.sm
  },
  domainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E8ECEF'
  },
  domainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm
  },
  domainLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1
  },
  domainIconContainer: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  domainName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkText
  },
  domainDesc: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: 1
  },
  domainScore: {
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 8
  },
  barBg: {
    height: 6,
    backgroundColor: '#F0F4F3',
    borderRadius: RADIUS.full,
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: RADIUS.full
  }
});
