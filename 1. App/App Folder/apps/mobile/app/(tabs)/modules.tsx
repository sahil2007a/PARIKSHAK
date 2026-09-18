import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { Search, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { CategoryTabs } from '../../components/CategoryTabs';
import { TrainingCard } from '../../components/TrainingCard';
import { Header } from '../../components/Header';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { mobileApi } from '../../services/api';
import { TrainingModule } from '@parishak/shared';
import { useLanguage } from '../../localization/i18n';

export default function ModulesCatalogScreen() {
  const { t, resolveLocalizedText } = useLanguage();
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadModules = async () => {
    try {
      const data = await mobileApi.getModules();
      setModules(data);
    } catch (e) {
      console.error('Failed to load modules', e);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadModules();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    return modules.filter((m) => {
      const matchesCategory =
        activeCategory === 'ALL' || m.category === activeCategory;
      const title = resolveLocalizedText(m.title).toLowerCase();
      const desc = resolveLocalizedText(m.description).toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || title.includes(q) || desc.includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [modules, activeCategory, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('modules.catalogTitle', 'Industrial Safety Modules')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('modules.catalogSubtitle', 'Mandatory compliance, standard operating procedures, and 3D simulation drills.')}
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={17} color={COLORS.mutedText} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('home.searchPlaceholder') || 'Search safety modules...'}
            placeholderTextColor={COLORS.mutedText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <CategoryTabs
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        <View style={styles.modulesHeaderRow}>
          <Text style={styles.modulesCountText}>
            {filtered.length} {t('home.available') || 'available'}
          </Text>
        </View>

        {filtered.map((mod) => (
          <TrainingCard key={mod.id} module={mod} />
        ))}
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
    paddingBottom: SPACING.xs
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
    lineHeight: 16
  },
  searchContainer: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xs
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8E6',
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    height: 42,
    gap: 8,
    ...SHADOWS.sm
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.darkText,
    fontWeight: '500'
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 40
  },
  modulesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
    marginTop: 4
  },
  modulesCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.mutedText
  }
});
