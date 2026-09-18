import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../styles/theme';

export default function ARHudOverlay({
  fps = 60,
  latency = 16.6,
  activeFiresCount = 0,
  targetCount = 0,
  fireEnabled = true,
  blendMode = 'hybrid',
  torchEnabled = false,
  isDemoMode = true,
  onToggleFire,
  onToggleTorch,
  onSwitchCamera,
  onCycleBlendMode,
  onOpenTargetModal,
  onTakeScreenshot,
}) {
  const fpsColor = fps >= 45 ? THEME.colors.success : (fps >= 25 ? THEME.colors.warning : THEME.colors.danger);

  return (
    <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
      {/* Top Glassmorphism Status Card */}
      <View style={styles.topCard}>
        <View style={styles.headerRow}>
          <View style={styles.titleWrapper}>
            <View style={[styles.statusDot, { backgroundColor: fireEnabled ? THEME.colors.primaryGlow : '#64748B' }]} />
            <Text style={styles.title}>AR VIRTUAL FIRE</Text>
          </View>

          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>
              {isDemoMode ? 'EXPO GO AR' : 'YOLO BACKEND'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCol}>
            <Text style={styles.statLabel}>FPS</Text>
            <Text style={[styles.statValue, { color: fpsColor }]}>
              {Math.round(fps)} <Text style={styles.statSub}>({latency.toFixed(1)}ms)</Text>
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <Text style={styles.statLabel}>ACTIVE FIRES</Text>
            <Text style={[styles.statValue, { color: THEME.colors.primaryGlow }]}>
              {activeFiresCount}
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statCol}>
            <Text style={styles.statLabel}>BLEND MODE</Text>
            <Text style={[styles.statValue, { color: THEME.colors.cyanAccent }]}>
              {blendMode.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Floating AR Control Bar */}
      <View style={styles.bottomControlBar}>
        {/* Fire Toggle */}
        <TouchableOpacity
          style={[
            styles.controlBtn,
            fireEnabled ? styles.controlBtnFireActive : styles.controlBtnInactive,
          ]}
          onPress={onToggleFire}
        >
          <Text style={styles.controlIcon}>{fireEnabled ? '🔥' : '🚫'}</Text>
          <Text style={styles.controlLabel}>{fireEnabled ? 'Fire ON' : 'Fire OFF'}</Text>
        </TouchableOpacity>

        {/* Target Picker */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={onOpenTargetModal}
        >
          <Text style={styles.controlIcon}>🎯</Text>
          <Text style={styles.controlLabel}>Targets</Text>
        </TouchableOpacity>

        {/* Blend Mode */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={onCycleBlendMode}
        >
          <Text style={styles.controlIcon}>✨</Text>
          <Text style={styles.controlLabel}>Blend</Text>
        </TouchableOpacity>

        {/* Flashlight */}
        <TouchableOpacity
          style={[styles.controlBtn, torchEnabled && styles.controlBtnTorchActive]}
          onPress={onToggleTorch}
        >
          <Text style={styles.controlIcon}>🔦</Text>
          <Text style={styles.controlLabel}>Torch</Text>
        </TouchableOpacity>

        {/* Flip Camera */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={onSwitchCamera}
        >
          <Text style={styles.controlIcon}>🔄</Text>
          <Text style={styles.controlLabel}>Flip</Text>
        </TouchableOpacity>

        {/* Screenshot */}
        <TouchableOpacity
          style={[styles.controlBtn, styles.controlBtnScreenshot]}
          onPress={onTakeScreenshot}
        >
          <Text style={styles.controlIcon}>📸</Text>
          <Text style={styles.controlLabel}>Snap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topCard: {
    backgroundColor: THEME.colors.cardGlass,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    ...THEME.shadows.cardShadow,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  modeBadge: {
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.35)',
  },
  modeBadgeText: {
    color: THEME.colors.cyanAccent,
    fontSize: 10,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: THEME.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  statSub: {
    fontSize: 10,
    color: THEME.colors.textMuted,
    fontWeight: '400',
  },
  statDivider: {
    width: 1,
    height: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  bottomControlBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(12, 16, 24, 0.88)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 8,
    ...THEME.shadows.cardShadow,
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  controlBtnFireActive: {
    backgroundColor: 'rgba(255, 87, 34, 0.25)',
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  controlBtnTorchActive: {
    backgroundColor: 'rgba(255, 234, 0, 0.25)',
    borderWidth: 1,
    borderColor: THEME.colors.warning,
  },
  controlBtnScreenshot: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderWidth: 1,
    borderColor: THEME.colors.cyanAccent,
  },
  controlBtnInactive: {
    opacity: 0.65,
  },
  controlIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  controlLabel: {
    color: THEME.colors.textPrimary,
    fontSize: 10,
    fontWeight: '600',
  },
});
