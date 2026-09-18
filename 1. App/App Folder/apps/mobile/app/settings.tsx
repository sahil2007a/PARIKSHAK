import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Bell, Globe, Shield, Moon, Sun, Monitor, ChevronRight, User, Edit3 } from 'lucide-react-native';
import { router } from 'expo-router';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { getAppLanguage, useLanguage } from '../localization/i18n';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { EditProfileModal } from '../components/EditProfileModal';
import { mobileApi } from '../services/api';
import { offlineStorage } from '../services/offlineStorage';
import { UserProfile } from '@parishak/shared';

export default function SettingsScreen() {
  const { t, currentLanguage } = useLanguage();
  const currentLang = currentLanguage;
  const { themeMode, setThemeMode, colors, isDark } = useTheme();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    offlineStorage.getUser().then((u) => {
      if (u) setUser(u);
    });
    mobileApi.getProfile().then((u) => {
      if (u) setUser(u);
    });
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.topBarTitle, { color: colors.darkText }]}>{t('settings.title', 'Application Settings')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account & Profile Section */}
        <Text style={[styles.sectionHeader, { color: colors.darkText }]}>{t('settings.workerAccount', 'Worker Account & Identity')}</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 16 }]}>
          <TouchableOpacity
            style={[styles.settingRow, { borderBottomWidth: 0 }]}
            onPress={() => setIsEditModalVisible(true)}
            activeOpacity={0.75}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.profileIconCircle, { backgroundColor: isDark ? '#134E4A' : '#E8F8F5' }]}>
                <User size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.settingTitle, { color: colors.darkText }]}>
                  {user?.fullName || 'Worker Profile'}
                </Text>
                <Text style={[styles.settingSub, { color: colors.mutedText }]}>
                  {user?.workerId || 'WRK-ID'} • {user?.jobRole || 'Safety Trainee'}
                </Text>
              </View>
            </View>
            <View style={styles.editBadge}>
              <Edit3 size={14} color={colors.primary} />
              <Text style={[styles.editBadgeText, { color: colors.primary }]}>{t('common.edit', 'Edit')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Appearance & Theming */}
        <Text style={[styles.sectionHeader, { color: colors.darkText }]}>{t('settings.appearance', 'Appearance & Theme')}</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 16 }]}>
          <Text style={[styles.settingTitle, { color: colors.darkText, paddingTop: 14, paddingBottom: 10 }]}>
            {t('settings.displayTheme', 'Display Theme')}
          </Text>
          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border, backgroundColor: isDark ? '#1E293B' : '#F8FAF9' },
                themeMode === 'light' && { borderColor: colors.primary, backgroundColor: isDark ? '#134E4A' : '#E8F8F5' }
              ]}
              onPress={() => setThemeMode('light')}
              activeOpacity={0.8}
            >
              <Sun size={18} color={themeMode === 'light' ? colors.primary : colors.mutedText} />
              <Text
                style={[
                  styles.themeButtonText,
                  { color: themeMode === 'light' ? colors.primary : colors.mutedText }
                ]}
              >
                {t('settings.lightMode', 'Light')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border, backgroundColor: isDark ? '#1E293B' : '#F8FAF9' },
                themeMode === 'dark' && { borderColor: colors.primary, backgroundColor: isDark ? '#134E4A' : '#E8F8F5' }
              ]}
              onPress={() => setThemeMode('dark')}
              activeOpacity={0.8}
            >
              <Moon size={18} color={themeMode === 'dark' ? colors.primary : colors.mutedText} />
              <Text
                style={[
                  styles.themeButtonText,
                  { color: themeMode === 'dark' ? colors.primary : colors.mutedText }
                ]}
              >
                {t('settings.darkMode', 'Dark')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeButton,
                { borderColor: colors.border, backgroundColor: isDark ? '#1E293B' : '#F8FAF9' },
                themeMode === 'system' && { borderColor: colors.primary, backgroundColor: isDark ? '#134E4A' : '#E8F8F5' }
              ]}
              onPress={() => setThemeMode('system')}
              activeOpacity={0.8}
            >
              <Monitor size={18} color={themeMode === 'system' ? colors.primary : colors.mutedText} />
              <Text
                style={[
                  styles.themeButtonText,
                  { color: themeMode === 'system' ? colors.primary : colors.mutedText }
                ]}
              >
                {t('settings.systemDefault', 'System')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.sectionHeader, { color: colors.darkText }]}>{t('settings.preferences', 'Safety Training Preferences')}</Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/(auth)/language')}
          >
            <View style={styles.settingLeft}>
              <Globe size={18} color={colors.primary} />
              <View>
                <Text style={[styles.settingTitle, { color: colors.darkText }]}>{t('settings.languageDialect', 'Language / Dialect')}</Text>
                <Text style={[styles.settingSub, { color: colors.mutedText }]}>
                  {currentLang === 'en' ? 'English' : currentLang === 'hi' ? 'हिन्दी (Hindi)' : 'ᱥᱟᱱᱛᱟᱲᱤ (Santali)'}
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.mutedText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push('/notifications')}
          >
            <View style={styles.settingLeft}>
              <Bell size={18} color={colors.primary} />
              <View>
                <Text style={[styles.settingTitle, { color: colors.darkText }]}>{t('settings.notifications', 'Push & Drill Notifications')}</Text>
                <Text style={[styles.settingSub, { color: colors.mutedText }]}>{t('settings.remindersEnabled', 'Mandatory refresher reminders enabled')}</Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.mutedText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { borderBottomWidth: 0 }]}
            onPress={() => router.push('/offline-mode')}
          >
            <View style={styles.settingLeft}>
              <Shield size={18} color={colors.primary} />
              <View>
                <Text style={[styles.settingTitle, { color: colors.darkText }]}>{t('settings.offlineSync', 'Offline Mode & Sync')}</Text>
                <Text style={[styles.settingSub, { color: colors.mutedText }]}>{t('settings.cachingActive', 'Underground shaft caching active')}</Text>
              </View>
            </View>
            <ChevronRight size={16} color={colors.mutedText} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Shared Reusable Edit Profile Modal */}
      <EditProfileModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        user={user}
        onProfileUpdated={(updated) => setUser(updated)}
      />
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
  scrollContent: {
    padding: SPACING.md
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 10
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8E6',
    ...SHADOWS.sm
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F3'
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkText
  },
  settingSub: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: 2
  },
  themeRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 14
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1.5
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: '700'
  },
  profileIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  editBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0, 168, 150, 0.1)'
  },
  editBadgeText: {
    fontSize: 12,
    fontWeight: '700'
  }
});
