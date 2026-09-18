import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import {
  Search,
  Award,
  BookOpen,
  FileCheck2,
  PhoneCall,
  Play
} from 'lucide-react-native';
import { Header } from '../../components/Header';
import { HeroBanner } from '../../components/HeroBanner';
import { CategoryTabs } from '../../components/CategoryTabs';
import { TrainingCard } from '../../components/TrainingCard';
import { OfflineBanner } from '../../components/OfflineBanner';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { mobileApi } from '../../services/api';
import { offlineStorage } from '../../services/offlineStorage';
import { TrainingModule, UserProfile } from '@parishak/shared';
import { router } from 'expo-router';
import { useLanguage } from '../../localization/i18n';

export default function HomeScreen() {
  const { currentLanguage, t, resolveLocalizedText } = useLanguage();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const u = await offlineStorage.getUser();
      if (u) setUser(u);

      const mods = await mobileApi.getModules();
      setModules(mods);
    } catch (e) {
      console.error('Failed to load dashboard data', e);
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

  const filteredModules = useMemo(() => {
    return modules.filter((m) => {
      const matchesCategory =
        activeCategory === 'ALL' || m.category === activeCategory;

      const title = resolveLocalizedText(m.title).toLowerCase();
      const desc = resolveLocalizedText(m.description).toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || title.includes(q) || desc.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [modules, activeCategory, searchQuery, currentLanguage]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <OfflineBanner />
      <Header workerName={user?.fullName?.split(' ')[0]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* Hero Section with Industrial Worker Visual */}
        <HeroBanner
          greetingWorkerName={user?.fullName?.split(' ')[0] || t('common.worker', 'Worker')}
          onPressCTA={() => router.push('/module/1')}
        />

        {/* Quick Actions Section (Modern 2-Column Cards) */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionHeading}>{t('home.quickActions')}</Text>
          <View style={styles.quickActionsGrid}>
            {/* Action 1: Continue / Resume Fire Module */}
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/ar-training/1')}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#FFF1EC' }]}>
                <Play size={20} color="#F97316" fill="#F97316" />
              </View>
              <Text style={styles.actionCardTitle}>{t('home.continueTraining') || t('common.continue', 'Continue')}</Text>
              <Text style={styles.actionCardSubtitle}>{t('home.resumeFireModule')}</Text>
            </TouchableOpacity>

            {/* Action 2: Certificates */}
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/(tabs)/certificates')}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#E8F8F0' }]}>
                <Award size={22} color="#10B981" />
              </View>
              <Text style={styles.actionCardTitle}>{t('home.myCertificates') || t('tabs.certificates', 'Certificates')}</Text>
              <Text style={styles.actionCardSubtitle}>{t('home.verifiedBadges')}</Text>
            </TouchableOpacity>

            {/* Action 3: Assessment */}
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/assessment/1')}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#E0F7F6' }]}>
                <FileCheck2 size={22} color="#0891B2" />
              </View>
              <Text style={styles.actionCardTitle}>{t('home.assessment') || t('tabs.assessment', 'Assessment')}</Text>
              <Text style={styles.actionCardSubtitle}>{t('home.takeExam')}</Text>
            </TouchableOpacity>

            {/* Action 4: Resources */}
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => router.push('/help')}
              activeOpacity={0.75}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7' }]}>
                <BookOpen size={22} color="#D97706" />
              </View>
              <Text style={styles.actionCardTitle}>{t('home.safetyResources') || t('home.resources', 'Resources')}</Text>
              <Text style={styles.actionCardSubtitle}>{t('home.safetyTopics')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={17} color={COLORS.mutedText} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('home.searchPlaceholder')}
              placeholderTextColor={COLORS.mutedText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Horizontal Category Tabs */}
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Training Modules List */}
        <View style={styles.modulesSection}>
          <View style={styles.modulesHeaderRow}>
            <Text style={styles.sectionHeading}>{t('home.industrialSafetyModules')}</Text>
            <Text style={styles.modulesCountText}>{filteredModules.length} {t('home.available')}</Text>
          </View>

          {filteredModules.map((module) => (
            <TrainingCard key={module.id} module={module} />
          ))}
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
    paddingBottom: 80
  },
  quickActionsContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md + 4
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: 0.2
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8EFF2',
    ...SHADOWS.sm
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  actionCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2
  },
  actionCardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B'
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8E6',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    height: 44,
    gap: 8,
    ...SHADOWS.sm
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.darkText,
    fontWeight: '500'
  },
  modulesSection: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md
  },
  modulesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  modulesCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.mutedText
  }
});

