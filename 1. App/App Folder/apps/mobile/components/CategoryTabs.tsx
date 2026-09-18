import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { useLanguage } from '../localization/i18n';

interface CategoryTabsProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CATEGORIES = [
  { key: 'ALL', labelKey: 'modules.all' },
  { key: 'FIRE_SAFETY', labelKey: 'modules.fireSafety' },
  { key: 'GAS_SAFETY', labelKey: 'modules.gasSafety' },
  { key: 'MACHINERY', labelKey: 'modules.machinery' },
  { key: 'PPE', labelKey: 'modules.ppe' },
  { key: 'EMERGENCY', labelKey: 'modules.emergency' }
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory
}) => {
  const { t } = useLanguage();
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              onPress={() => onSelectCategory(cat.key)}
              activeOpacity={0.8}
              style={[
                styles.tab,
                isActive && styles.activeTab
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.activeTabText
                ]}
              >
                {t(cat.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    gap: 8
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.full,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8E6'
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mutedText
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700'
  }
});
