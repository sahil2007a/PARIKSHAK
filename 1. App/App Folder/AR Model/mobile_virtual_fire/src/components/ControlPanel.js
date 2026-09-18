import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { THEME } from '../styles/theme';

export default function ControlPanel({
  fps = 60,
  latency = 16.6,
  activeFiresCount = 0,
  fireEnabled = true,
  blendMode = 'hybrid',
  torchEnabled = false,
  isServerConnected = false,
  connectionStatus = 'CONNECTING',
  serverIp = '',
  onToggleFire,
  onToggleTorch,
  onSwitchCamera,
  onCycleBlendMode,
  onOpenTargetModal,
  onOpenServerModal,
  onTakeScreenshot,
  onReigniteAll,
}) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const fpsColor = fps >= 45 ? THEME.colors.success : (fps >= 25 ? THEME.colors.warning : THEME.colors.danger);

  let statusColor = THEME.colors.warning;
  let statusText = connectionStatus || 'STANDBY';

  if (connectionStatus === 'CONNECTED' || isServerConnected) {
    statusColor = THEME.colors.success;
    statusText = 'YOLO AI (LAN)';
  } else if (connectionStatus === 'CONNECTING') {
    statusColor = THEME.colors.cyanAccent;
    statusText = 'FINDING SERVER';
  } else if (connectionStatus === 'RECONNECTING') {
    statusColor = THEME.colors.warning;
    statusText = 'RECONNECTING...';
  } else if (connectionStatus === 'ERROR' || connectionStatus === 'DISCONNECTED') {
    statusColor = '#94A3B8';
    statusText = 'OFFLINE';
  }

  return (
    <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
      {/* 1. Top Minimalist Cyberpunk Status Capsule */}
      <View style={styles.topStatusCapsule}>
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusPillText}>
            {statusText}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>FPS</Text>
          <Text style={[styles.statVal, { color: fpsColor }]}>{Math.round(fps)}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>LATENCY</Text>
          <Text style={[styles.statVal, { color: THEME.colors.cyanAccent }]}>{latency.toFixed(0)}ms</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>FIRES</Text>
          <Text style={[styles.statVal, { color: activeFiresCount > 0 ? THEME.colors.primaryGlow : '#94A3B8' }]}>
            {activeFiresCount}
          </Text>
        </View>

        {/* Server IP Quick Button */}
        <TouchableOpacity style={styles.ipBtn} onPress={onOpenServerModal}>
          <Text style={styles.ipBtnIcon}>🌐</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Bottom Controls Bar */}
      <View style={styles.bottomBar} pointerEvents="box-none">
        {/* LEFT: Collapsible AR Menu */}
        <View style={styles.leftMenuWrapper} pointerEvents="box-none">
          {/* Expanded Menu Popover */}
          {isNavOpen && (
            <View style={styles.expandedMenu}>
              {/* Toggle Fire */}
              <TouchableOpacity
                style={[styles.menuItem, fireEnabled ? styles.menuItemFireOn : styles.menuItemFireOff]}
                onPress={() => {
                  onToggleFire();
                  setIsNavOpen(false);
                }}
              >
                <Text style={styles.menuIcon}>{fireEnabled ? '🔥' : '🚫'}</Text>
                <Text style={styles.menuText}>{fireEnabled ? 'Fire Enabled' : 'Fire Disabled'}</Text>
              </TouchableOpacity>

              {/* Target Objects */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onOpenTargetModal();
                  setIsNavOpen(false);
                }}
              >
                <Text style={styles.menuIcon}>🎯</Text>
                <Text style={styles.menuText}>Target Objects</Text>
              </TouchableOpacity>

              {/* Blend Mode */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={onCycleBlendMode}
              >
                <Text style={styles.menuIcon}>✨</Text>
                <Text style={styles.menuText}>Blend: {blendMode.toUpperCase()}</Text>
              </TouchableOpacity>

              {/* Flashlight Torch */}
              <TouchableOpacity
                style={[styles.menuItem, torchEnabled && styles.menuItemTorch]}
                onPress={onToggleTorch}
              >
                <Text style={styles.menuIcon}>🔦</Text>
                <Text style={styles.menuText}>{torchEnabled ? 'Torch ON' : 'Torch OFF'}</Text>
              </TouchableOpacity>

              {/* Camera Flip */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={onSwitchCamera}
              >
                <Text style={styles.menuIcon}>🔄</Text>
                <Text style={styles.menuText}>Flip Camera</Text>
              </TouchableOpacity>

              {/* Snapshot */}
              <TouchableOpacity
                style={[styles.menuItem, styles.menuItemSnap]}
                onPress={() => {
                  onTakeScreenshot();
                  setIsNavOpen(false);
                }}
              >
                <Text style={styles.menuIcon}>📸</Text>
                <Text style={styles.menuText}>Take Screenshot</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Collapsible Trigger Floating Button */}
          <TouchableOpacity
            style={[styles.collapseTriggerBtn, isNavOpen && styles.collapseTriggerActive]}
            onPress={() => setIsNavOpen(!isNavOpen)}
          >
            <Text style={styles.collapseIcon}>{isNavOpen ? '✕' : '⚡'}</Text>
            <Text style={styles.collapseText}>{isNavOpen ? 'Close' : 'AR Menu'}</Text>
          </TouchableOpacity>
        </View>

        {/* CENTER / BOTTOM: Dedicated Re-Ignite Action Button */}
        <TouchableOpacity
          style={styles.reigniteActionBtn}
          onPress={onReigniteAll}
        >
          <Text style={styles.reigniteIcon}>🔥</Text>
          <Text style={styles.reigniteText}>Re-Ignite Fire</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  topStatusCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(12, 16, 24, 0.85)',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    ...THEME.shadows.cardShadow,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: THEME.colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 1,
  },
  statVal: {
    fontSize: 13,
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  ipBtn: {
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.35)',
  },
  ipBtnIcon: {
    fontSize: 14,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 6,
  },
  leftMenuWrapper: {
    alignItems: 'flex-start',
  },
  expandedMenu: {
    backgroundColor: 'rgba(12, 16, 24, 0.94)',
    borderRadius: 18,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 6,
    width: 210,
    ...THEME.shadows.cardShadow,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuItemFireOn: {
    backgroundColor: 'rgba(255, 87, 34, 0.22)',
    borderWidth: 1,
    borderColor: THEME.colors.primary,
  },
  menuItemFireOff: {
    backgroundColor: 'rgba(100, 116, 139, 0.22)',
  },
  menuItemTorch: {
    backgroundColor: 'rgba(255, 234, 0, 0.2)',
    borderWidth: 1,
    borderColor: THEME.colors.warning,
  },
  menuItemSnap: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderWidth: 1,
    borderColor: THEME.colors.cyanAccent,
  },
  menuIcon: {
    fontSize: 16,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  collapseTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15, 20, 28, 0.90)',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...THEME.shadows.cardShadow,
  },
  collapseTriggerActive: {
    backgroundColor: 'rgba(255, 87, 34, 0.3)',
    borderColor: THEME.colors.primary,
  },
  collapseIcon: {
    fontSize: 16,
    color: THEME.colors.goldCore,
  },
  collapseText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  reigniteActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 87, 34, 0.88)',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#FDBA74',
    ...THEME.shadows.fireGlow,
  },
  reigniteIcon: {
    fontSize: 16,
  },
  reigniteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
