import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { offlineStorage } from '../services/offlineStorage';
import { router } from 'expo-router';
import { useLanguage } from '../localization/i18n';

export const OfflineBanner: React.FC = () => {
  const { t } = useLanguage();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const checkQueue = async () => {
      const q = await offlineStorage.getSyncQueue();
      setPendingCount(q.length);
    };
    checkQueue();
    const interval = setInterval(checkQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  if (pendingCount === 0) return null;

  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => router.push('/offline-mode')}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <WifiOff size={14} color="#FFFFFF" />
        <Text style={styles.text}>
          {pendingCount} safety attempt{pendingCount > 1 ? 's' : ''} stored offline
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.syncText}>Sync Queue</Text>
        <RefreshCw size={12} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#34495E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 6
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  syncText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF'
  }
});
