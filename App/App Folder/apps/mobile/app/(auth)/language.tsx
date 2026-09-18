import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { ArrowLeft, Globe, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '../../components/Button';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { SupportedLanguage } from '@parishak/shared';
import { useLanguage } from '../../localization/i18n';
import { offlineStorage } from '../../services/offlineStorage';

export default function LanguageScreen() {
  const { t, currentLanguage, setAppLanguage } = useLanguage();
  const [selected, setSelected] = useState<SupportedLanguage>(currentLanguage);

  const languages: { code: SupportedLanguage; label: string; script: string; region: string }[] = [
    { code: 'en', label: 'English', script: 'English Standard', region: 'Global / Enterprise' },
    { code: 'hi', label: 'हिन्दी', script: 'Hindi Devanagari', region: 'Jharkhand, Chhattisgarh, MP, UP' },
    { code: 'sat', label: 'ᱥᱟᱱᱛᱟᱲᱤ', script: 'Santali Ol Chiki', region: 'Mining & Tribal Belt, Jharkhand, WB, Odisha' }
  ];

  const handleSave = async () => {
    setAppLanguage(selected);
    await offlineStorage.saveLanguage(selected);
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>{t('auth.selectSafetyLanguage', 'Select Safety Language')}</Text>
      </View>

      <View style={styles.content}>
        
        <View style={styles.iconCircle}>
          <Globe size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>{t('auth.preferredDialect', 'Preferred Industrial Dialect')}</Text>
        <Text style={styles.subtitle}>
          {t('auth.languageAdaptiveDesc', 'All instructions, PASS simulations, voice guidance cues, and checklists will adapt to your selected language.')}
        </Text>

        <View style={styles.langList}>
          {languages.map((lang) => {
            const isSelected = selected === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langCard, isSelected && styles.langCardSelected]}
                onPress={() => setSelected(lang.code)}
                activeOpacity={0.8}
              >
                <View style={styles.langLeft}>
                  <Text style={[styles.langLabel, isSelected && styles.langLabelSelected]}>
                    {lang.label}
                  </Text>
                  <Text style={styles.langScript}>{lang.script}</Text>
                  <Text style={styles.langRegion}>{lang.region}</Text>
                </View>

                {isSelected ? (
                  <View style={styles.checkCircle}>
                    <Check size={16} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={styles.emptyCheckCircle} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title={t('auth.confirmLanguage', 'Confirm Language Selection')}
          onPress={handleSave}
          size="lg"
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
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
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.darkText,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.mutedText,
    lineHeight: 18,
    marginBottom: 20
  },
  langList: {
    gap: 12
  },
  langCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E2E8E6',
    ...SHADOWS.sm
  },
  langCardSelected: {
    backgroundColor: '#E8F8F5',
    borderColor: COLORS.primary
  },
  langLeft: {
    flex: 1
  },
  langLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 2
  },
  langLabelSelected: {
    color: COLORS.primaryDark
  },
  langScript: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mutedText
  },
  langRegion: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#CBD5E1'
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl
  }
});
