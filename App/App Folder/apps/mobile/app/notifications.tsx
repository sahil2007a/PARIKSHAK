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
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  Award,
  ShieldAlert,
  Check,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from 'lucide-react-native';
import { router } from 'expo-router';
import { mobileApi } from '../services/api';
import { NotificationItem } from '@parishak/shared';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { resolveLocalizedText, useLanguage } from '../localization/i18n';

export default function NotificationsScreen() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifs = async () => {
    try {
      const data = await mobileApi.getNotifications();
      setNotifications(data);
    } catch {
      // offline
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifs();
    setRefreshing(false);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    notifications.forEach((n) => {
      mobileApi.markNotificationRead(n.id);
    });
  };

  const handlePressNotification = (notif: NotificationItem) => {
    // Mark as read locally and remotely
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    mobileApi.markNotificationRead(notif.id);

    // Perform associated action navigation
    if (notif.actionUrl) {
      router.push(notif.actionUrl as any);
    } else if (notif.type === 'CERTIFICATE_ISSUED') {
      router.push('/(tabs)/certificates');
    } else if (notif.type === 'TRAINING_REMINDER') {
      router.push('/(tabs)/training');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>{t('notifications.title', 'Safety Notices & Alerts')}</Text>
        <TouchableOpacity onPress={markAllRead} style={styles.readAllButton}>
          <Text style={styles.readAllText}>{t('notifications.markRead', 'Mark Read')}</Text>
        </TouchableOpacity>
      </View>

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
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <CheckCircle2 size={36} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>{t('notifications.allCaughtUp', 'All Caught Up!')}</Text>
            <Text style={styles.emptySubtitle}>
              {t('notifications.emptySubtitle', 'No pending safety notifications or administrative alerts. Practice daily drills to maintain verified compliance.')}
            </Text>
          </View>
        ) : (
          notifications.map((notif) => {
            const title = resolveLocalizedText(notif.title);
            const message = resolveLocalizedText(notif.message);

            return (
              <TouchableOpacity
                key={notif.id}
                style={[styles.notifCard, !notif.isRead && styles.unreadNotifCard]}
                onPress={() => handlePressNotification(notif)}
                activeOpacity={0.8}
              >
                <View style={styles.iconCircle}>
                  {notif.type === 'TRAINING_REMINDER' ? (
                    <Sparkles size={18} color="#FF6B00" />
                  ) : notif.type === 'ADMIN_MESSAGE' ? (
                    <AlertTriangle size={18} color={COLORS.danger} />
                  ) : notif.type === 'CERTIFICATE_ISSUED' ? (
                    <Award size={18} color={COLORS.primary} />
                  ) : (
                    <ShieldAlert size={18} color={COLORS.warning} />
                  )}
                </View>

                <View style={styles.content}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.title, !notif.isRead && styles.unreadTitle]}>
                      {title}
                    </Text>
                    {!notif.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.message}>{message}</Text>
                  <View style={styles.footerRow}>
                    <Text style={styles.timeText}>
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </Text>
                    {notif.actionUrl && (
                      <View style={styles.actionPrompt}>
                        <Text style={styles.actionPromptText}>{t('notifications.openAction', 'Open Action')}</Text>
                        <ChevronRight size={12} color={COLORS.primary} />
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
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
  topBarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.darkText
  },
  readAllButton: {
    padding: 6
  },
  readAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl,
    gap: 10
  },
  notifCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8E6',
    ...SHADOWS.sm
  },
  unreadNotifCard: {
    backgroundColor: '#F7FCFA',
    borderColor: COLORS.primary
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F8FAF9',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flex: 1
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 2
  },
  message: {
    fontSize: 12,
    color: COLORS.mutedText,
    lineHeight: 16,
    marginBottom: 4
  },
  timeText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  unreadTitle: {
    fontWeight: '800',
    color: COLORS.primary
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2
  },
  actionPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2
  },
  actionPromptText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: SPACING.xl
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkText,
    marginBottom: 6
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 18
  }
});
