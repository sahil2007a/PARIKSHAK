import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { Tabs, router } from 'expo-router';
import {
  Home,
  BookOpen,
  BarChart2,
  Award,
  Flame,
  Wind,
  X,
  ArrowRight,
  Sparkles
} from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../localization/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QrCodeReadIcon } from '../../components/icons/QrCodeReadIcon';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [arModalVisible, setArModalVisible] = useState(false);

  // Ensure comfortable spacing above Android system gesture navigation bar and iOS home indicator
  const bottomInset = insets.bottom > 0 ? insets.bottom + 4 : 12;
  const tabHeight = 60 + bottomInset;

  const handleOpenFireAR = () => {
    setArModalVisible(false);
    router.push('/ar-training/1');
  };

  const handleOpenGasLeakAR = () => {
    setArModalVisible(false);
    router.push('/ar-training/2');
  };

  const handleBrowseCatalog = () => {
    setArModalVisible(false);
    router.push('/(tabs)/modules');
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E9EFEF',
            borderTopWidth: 1,
            height: tabHeight,
            paddingBottom: bottomInset,
            paddingTop: 8,
            elevation: 12,
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.08,
            shadowRadius: 10
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            marginTop: 3
          }
        }}
      >
        {/* 1. Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.home') || 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Home size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            )
          }}
        />

        {/* 2. Training */}
        <Tabs.Screen
          name="training"
          options={{
            title: t('tabs.training') || 'Training',
            tabBarIcon: ({ color, focused }) => (
              <BookOpen size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            )
          }}
        />

        {/* 3. Center Elevated Modules Button */}
        <Tabs.Screen
          name="modules"
          options={{
            title: t('tabs.modules') || 'Modules',
            tabBarButton: () => {
              return (
                <TouchableOpacity
                  onPress={() => setArModalVisible(true)}
                  activeOpacity={0.85}
                  style={styles.centerButtonContainer}
                >
                  <View style={styles.centerHalo}>
                    <View style={styles.centerCircle}>
                      <QrCodeReadIcon size={24} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text style={styles.centerLabel}>{t('tabs.modules') || 'Modules'}</Text>
                </TouchableOpacity>
              );
            }
          }}
        />

        {/* 4. Progress */}
        <Tabs.Screen
          name="progress"
          options={{
            title: t('tabs.progress') || 'Progress',
            tabBarIcon: ({ color, focused }) => (
              <BarChart2 size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            )
          }}
        />

        {/* 5. Certificates */}
        <Tabs.Screen
          name="certificates"
          options={{
            title: t('tabs.certificates') || 'Certificates',
            tabBarIcon: ({ color, focused }) => (
              <Award size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            )
          }}
        />

        {/* Hidden Screens: Profile and Home Alias */}
        <Tabs.Screen
          name="profile"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            href: null
          }}
        />
      </Tabs>

      {/* AR Modules Popup Bottom Sheet triggered by Center Button */}
      <Modal
        visible={arModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setArModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setArModalVisible(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.sheetContainer}>
                {/* Sheet Header */}
                <View style={styles.sheetHeader}>
                  <View style={styles.sheetHeaderTitleRow}>
                    <Sparkles size={18} color="#00F2FE" />
                    <Text style={styles.sheetTitle}>{t('modules.arTrainingModules', 'AR Training Modules')}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setArModalVisible(false)}
                    activeOpacity={0.7}
                  >
                    <X size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.sheetSubtitle}>
                  {t('modules.chooseArSimulator', 'Choose an augmented reality simulator to begin your safety training drill:')}
                </Text>

                {/* Option 1: Fire AR */}
                <TouchableOpacity
                  style={styles.moduleCard}
                  onPress={handleOpenFireAR}
                  activeOpacity={0.8}
                >
                  <View style={[styles.moduleIconBox, { backgroundColor: 'rgba(255, 87, 34, 0.15)' }]}>
                    <Flame size={24} color="#FF5722" />
                  </View>
                  <View style={styles.moduleInfo}>
                    <View style={styles.moduleTitleRow}>
                      <Text style={styles.moduleName}>{t('modules.fireArDrill', 'Fire AR Drill')}</Text>
                      <View style={styles.badgeOrange}>
                        <Text style={styles.badgeTextOrange}>{t('common.aiCamera', 'AI CAMERA')}</Text>
                      </View>
                    </View>
                    <Text style={styles.moduleDesc}>
                      {t('modules.fireArDesc', 'P.A.S.S. technique & virtual fire extinguisher simulation')}
                    </Text>
                  </View>
                  <ArrowRight size={16} color="#FF5722" />
                </TouchableOpacity>

                {/* Option 2: Gas Leak AR */}
                <TouchableOpacity
                  style={[styles.moduleCard, { marginTop: 10 }]}
                  onPress={handleOpenGasLeakAR}
                  activeOpacity={0.8}
                >
                  <View style={[styles.moduleIconBox, { backgroundColor: 'rgba(0, 242, 254, 0.15)' }]}>
                    <Wind size={24} color="#00F2FE" />
                  </View>
                  <View style={styles.moduleInfo}>
                    <View style={styles.moduleTitleRow}>
                      <Text style={styles.moduleName}>{t('modules.gasArDrill', 'Gas Leak AR Drill')}</Text>
                      <View style={styles.badgeCyan}>
                        <Text style={styles.badgeTextCyan}>{t('common.arSensors', 'AR SENSORS')}</Text>
                      </View>
                    </View>
                    <Text style={styles.moduleDesc}>
                      {t('modules.gasArDesc', 'Hazard detection, sensor localization & valve LOTO isolation')}
                    </Text>
                  </View>
                  <ArrowRight size={16} color="#00F2FE" />
                </TouchableOpacity>

                {/* Option 3: Full Modules Catalog */}
                <TouchableOpacity
                  style={styles.browseCatalogLink}
                  onPress={handleBrowseCatalog}
                  activeOpacity={0.7}
                >
                  <BookOpen size={15} color="#00F2FE" />
                  <Text style={styles.browseCatalogText}>
                    {t('modules.browseAllCatalog', 'Browse All Safety Modules Catalog →')}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  centerButtonContainer: {
    top: -18,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  centerHalo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6
  },
  centerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 2
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingHorizontal: SPACING.md
  },
  sheetContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
    ...SHADOWS.floating
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  sheetHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sheetSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 16,
    lineHeight: 16
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12
  },
  moduleIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  moduleInfo: {
    flex: 1
  },
  moduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3
  },
  moduleName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  moduleDesc: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15
  },
  badgeOrange: {
    backgroundColor: 'rgba(255, 87, 34, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  badgeTextOrange: {
    color: '#FF5722',
    fontSize: 9,
    fontWeight: '900'
  },
  badgeCyan: {
    backgroundColor: 'rgba(0, 242, 254, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  badgeTextCyan: {
    color: '#00F2FE',
    fontSize: 9,
    fontWeight: '900'
  },
  browseCatalogLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 10
  },
  browseCatalogText: {
    color: '#00F2FE',
    fontSize: 13,
    fontWeight: '700'
  }
});


