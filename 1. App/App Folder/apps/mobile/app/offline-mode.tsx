import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { ArrowLeft, WifiOff, RefreshCw, CheckCircle2, Trash2, Database } from 'lucide-react-native';
import { router } from 'expo-router';
import { offlineStorage } from '../services/offlineStorage';
import { mobileApi } from '../services/api';
import { syncStore } from '../store/syncStore';
import { PendingSyncItem } from '@parishak/shared';
import { Button } from '../components/Button';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useLanguage } from '../localization/i18n';

export default function OfflineModeScreen() {
  const { t } = useLanguage();
  const [queue, setQueue] = useState<PendingSyncItem[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const loadQueue = async () => {
    const q = await offlineStorage.getSyncQueue();
    setQueue(q);
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const handleSyncAll = async () => {
    try {
      setSyncing(true);
      const res = await syncStore.syncAll();
      setLastSyncTime(new Date().toLocaleTimeString());
      await loadQueue();
      Alert.alert(
        t('common.success', 'Synchronization Complete'),
        `Successfully uploaded ${res.processed} pending attempts. Certificates and scores have been refreshed.`
      );
    } catch (e: any) {
      Alert.alert(t('common.notice', 'Sync Notice'), e.message || 'Sync failed. Will retry automatically.');
    } finally {
      setSyncing(false);
    }
  };

  const handleClear = async () => {
    await offlineStorage.clearSyncQueue();
    await loadQueue();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>{t('offline.title', 'Offline Training Hub')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.iconCircle}>
            <WifiOff size={32} color={COLORS.primary} />
          </View>
          
          <Text style={styles.statusTitle}>{t('offline.statusTitle', 'Offline-First Engine Active')}</Text>
          
          <Text style={styles.statusSub}>
            {t('offline.statusSub', 'All interactive drills, lessons, and assessment attempts work seamlessly without network connectivity in underground mine shafts and remote yards.')}
          </Text>

          <View style={styles.metricRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricNum}>{queue.length}</Text>
              <Text style={styles.metricLabel}>{t('offline.pendingSync', 'Pending Sync')}</Text>
            </View>

            <View style={styles.metricBox}>
              <Text style={styles.metricNum}>5</Text>
              <Text style={styles.metricLabel}>{t('offline.cachedModules', 'Cached Modules')}</Text>
            </View>
          </View>

          <Button
            title={queue.length > 0 ? t('offline.syncNow', 'Dispatch Sync Queue Now') : t('offline.syncDatasets', 'Synchronize Datasets')}
            onPress={handleSyncAll}
            loading={syncing}
            size="lg"
            style={{ width: '100%', marginTop: 16 }}
          />
        </View>

        {/* Pending Queue List */}
        <View style={styles.queueSection}>
          
          <View style={styles.queueHeader}>
            <Text style={styles.queueTitle}>{t('offline.queueTitle', 'Pending Synchronization Queue')}</Text>
            {queue.length > 0 && (
              <TouchableOpacity onPress={handleClear}>
                <Text style={styles.clearText}>{t('common.clear', 'Clear')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {queue.length === 0 ? (
            <View style={styles.emptyQueueCard}>
              <CheckCircle2 size={32} color="#27AE60" />
              <Text style={styles.emptyQueueTitle}>{t('offline.allSynced', 'All Attempt Records Synchronized')}</Text>
              <Text style={styles.emptyQueueSub}>
                {t('offline.allSyncedSub', 'Your local drill attempts match server records perfectly.')}
              </Text>
            </View>
          ) : (
            queue.map((item) => (
              <View key={item.idempotencyKey || item.id} style={styles.queueItemCard}>
                <View style={styles.queueItemLeft}>
                  <Database size={18} color={COLORS.primary} />
                  <View>
                    <Text style={styles.queueItemTitle}>
                      {item.type.replace('_', ' ')} {((item.payload as any)?.moduleId ? `(Module ${(item.payload as any).moduleId})` : '')}
                    </Text>
                    <Text style={styles.queueItemSub}>
                      Key: {item.idempotencyKey} • {new Date(item.createdAt).toLocaleTimeString()}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
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
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xxl
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8E6',
    marginBottom: 20,
    ...SHADOWS.card
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.darkText,
    textAlign: 'center',
    marginBottom: 4
  },
  statusSub: {
    fontSize: 12,
    color: COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16
  },
  metricRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 10
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#F8FAF9',
    borderRadius: RADIUS.lg,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8E6'
  },
  metricNum: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.mutedText,
    marginTop: 2
  },
  queueSection: {
    marginTop: 4
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  queueTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.darkText
  },
  clearText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.danger
  },
  emptyQueueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8E6',
    ...SHADOWS.sm
  },
  emptyQueueTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.darkText,
    marginTop: 10
  },
  emptyQueueSub: {
    fontSize: 11,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 4
  },
  queueItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8E6',
    ...SHADOWS.sm
  },
  queueItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  queueItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.darkText
  },
  queueItemSub: {
    fontSize: 10,
    color: COLORS.mutedText,
    fontFamily: 'monospace',
    marginTop: 2
  }
});
