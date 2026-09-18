import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { CategoryTabs } from '../../components/CategoryTabs';
import { TrainingCard } from '../../components/TrainingCard';
import { Header } from '../../components/Header';
import { COLORS, SPACING } from '../../constants/theme';
import { mobileApi } from '../../services/api';
import { TrainingModule } from '@parishak/shared';
import { useLanguage } from '../../localization/i18n';

export default function TrainingCatalogScreen() {
  const { t } = useLanguage();
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    mobileApi.getModules().then(setModules);
  }, []);

  const filtered = modules.filter(
    (m) => activeCategory === 'ALL' || m.category === activeCategory
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('training.title')}</Text>
        <Text style={styles.headerSubtitle}>
          {t('training.subtitle')}
        </Text>
      </View>

      <CategoryTabs
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
    marginTop: 2
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 24
  }
});
