import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { THEME } from '../styles/theme';

export default function DetectionBox({
  box,
  className,
  confidence,
  opacity = 1.0,
  isBurning = true,
  isExtinguished = false,
  extinguishProgress = 0.0,
}) {
  const { x, y, width, height } = box;
  const cornerSize = Math.max(10, Math.min(width * 0.18, height * 0.18, 22));

  let themeColor = THEME.colors.primary;
  let statusText = 'BURNING 🔥';
  let badgeBg = THEME.colors.primary;

  if (isExtinguished || extinguishProgress >= 0.95) {
    themeColor = THEME.colors.cyanAccent;
    statusText = 'EXTINGUISHED ❄️';
    badgeBg = '#0284C7';
  } else if (extinguishProgress > 0.05) {
    const pct = Math.round(extinguishProgress * 100);
    themeColor = '#F59E0B';
    statusText = `COOLING ${pct}% 💨`;
    badgeBg = '#D97706';
  } else if (!isBurning) {
    themeColor = '#94A3B8';
    statusText = 'DETECTED';
    badgeBg = '#475569';
  }

  return (
    <View
      pointerEvents="none"
      style={[
        styles.boxContainer,
        {
          left: x,
          top: y,
          width,
          height,
          opacity,
        }
      ]}
    >
      {/* Sci-Fi Corner Brackets */}
      <View style={[styles.corner, { top: 0, left: 0, width: cornerSize, height: cornerSize, borderTopWidth: 2, borderLeftWidth: 2, borderColor: themeColor }]} />
      <View style={[styles.corner, { top: 0, right: 0, width: cornerSize, height: cornerSize, borderTopWidth: 2, borderRightWidth: 2, borderColor: themeColor }]} />
      <View style={[styles.corner, { bottom: 0, left: 0, width: cornerSize, height: cornerSize, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: themeColor }]} />
      <View style={[styles.corner, { bottom: 0, right: 0, width: cornerSize, height: cornerSize, borderBottomWidth: 2, borderRightWidth: 2, borderColor: themeColor }]} />

      {/* Thin boundary box */}
      <View style={[styles.innerBox, { borderColor: themeColor }]} />

      {/* AR Tag Badge */}
      <View style={[styles.badge, { backgroundColor: badgeBg }]}>
        <Text style={styles.badgeText}>
          {className.toUpperCase()} {Math.round(confidence * 100)}% • {statusText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    position: 'absolute',
  },
  innerBox: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    opacity: 0.45,
  },
  corner: {
    position: 'absolute',
  },
  badge: {
    position: 'absolute',
    top: -24,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
