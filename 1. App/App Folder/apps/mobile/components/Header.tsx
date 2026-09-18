import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { Bell } from 'lucide-react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import { router, useFocusEffect } from 'expo-router';
import { useLanguage } from '../localization/i18n';
import { mobileApi } from '../services/api';
import { offlineStorage } from '../services/offlineStorage';

interface HeaderProps {
  workerName?: string;
  hasUnreadNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  workerName = 'Worker',
  hasUnreadNotifications
}) => {
  const { t } = useLanguage();
  const [unreadCount, setUnreadCount] = useState<number>(
    hasUnreadNotifications !== undefined ? (hasUnreadNotifications ? 1 : 0) : 0
  );
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const loadProfileImage = async () => {
    try {
      const img = await offlineStorage.getProfileImage();
      if (img) setProfileImage(img);
    } catch {
      // fallback to initial
    }
  };

  useEffect(() => {
    loadProfileImage();

    mobileApi
      .getNotifications()
      .then((notifs) => {
        if (notifs && notifs.length > 0) {
          const unread = notifs.filter((n) => !n.isRead).length;
          setUnreadCount(unread);
        } else {
          setUnreadCount(0);
        }
      })
      .catch(() => {});
  }, []);

  // Reload avatar when screen gains focus in case user updated it in Profile
  useFocusEffect(
    useCallback(() => {
      loadProfileImage();
    }, [])
  );

  const handleNavigateProfile = () => {
    // Navigate directly to the existing full Profile page (no dropdown popover)
    router.push('/(tabs)/profile');
  };

  return (
    <View style={styles.container}>
      {/* Brand & Logo */}
      <View style={styles.leftSection}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.brandTitle}>PARIKSHAK</Text>
          <Text style={styles.tagline}>{t('app.tagline')}</Text>
        </View>
      </View>

      {/* Right Controls: Notifications & Direct Profile Navigation */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            setUnreadCount(0);
            router.push('/notifications');
          }}
          activeOpacity={0.7}
        >
          <Bell size={19} color={COLORS.darkText} />
          {unreadCount > 0 && <View style={styles.badgeDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.avatarButton}
          onPress={handleNavigateProfile}
          activeOpacity={0.8}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarText}>
              {workerName ? workerName.charAt(0).toUpperCase() : 'W'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9EFEF'
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 8
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkText,
    letterSpacing: 0.5
  },
  tagline: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.mutedText,
    letterSpacing: 0.2
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F8F7',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  badgeDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.danger
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F8F5',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary
  }
});

