import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { THEME } from '../styles/theme';

export default function BoundingBoxBadge({
  box,
  className,
  confidence,
  opacity = 1.0,
  isBurning = true
}) {
  const { x, y, width, height } = box;
  const cornerSize = Math.max(10, Math.min(width * 0.18, height * 0.18, 22));
  const themeColor = isBurning ? THEME.colors.primary : THEME.colors.cyanAccent;

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
      {/* Top Left */}
      <View style={[styles.corner, { top: 0, left: 0, width: cornerSize, height: cornerSize, borderTopWidth: 2, borderLeftWidth: 2, borderColor: themeColor }]} />
      {/* Top Right */}
      <View style={[styles.corner, { top: 0, right: 0, width: cornerSize, height: cornerSize, borderTopWidth: 2, borderRightWidth: 2, borderColor: themeColor }]} />
      {/* Bottom Left */}
      <View style={[styles.corner, { bottom: 0, left: 0, width: cornerSize, height: cornerSize, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: themeColor }]} />
      {/* Bottom Right */}
      <View style={[styles.corner, { bottom: 0, right: 0, width: cornerSize, height: cornerSize, borderBottomWidth: 2, borderRightWidth: 2, borderColor: themeColor }]} />

      {/* Thin boundary box */}
      <View style={[styles.innerBox, { borderColor: themeColor }]} />

      {/* AR Tag Badge */}
      <View style={[styles.badge, { backgroundColor: themeColor }]}>
        <Text style={styles.badgeText}>
          {className.toUpperCase()} {Math.round(confidence * 100)}%
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
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
