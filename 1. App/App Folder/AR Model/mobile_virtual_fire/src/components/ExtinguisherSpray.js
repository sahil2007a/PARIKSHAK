import React from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * Realistic Volumetric CO2 Cryogenic Fog & Powder Mist Stream:
 * Renders high-pressure expanding fog clouds, cryogenic vapor haze, and realistic billow dynamics
 * without harsh borders or bubble artifacts.
 */
export default function ExtinguisherSpray({ particles = [], active = false }) {
  if (!active || particles.length === 0) return null;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {/* 1. Atmospheric Cryogenic Cold Haze */}
      <View style={styles.ambientHaze} />

      {/* 2. Billowing Volumetric CO2 Fog Mist Plumes */}
      {particles.map((p) => {
        const isCore = p.layer === 'core';
        return (
          <View
            key={p.id}
            style={[
              isCore ? styles.fogCoreCloud : styles.fogMistCloud,
              {
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                borderRadius: p.size / 2,
                opacity: p.opacity,
              },
            ]}
          >
            {/* Dense inner nucleus for volumetric depth */}
            <View
              style={[
                styles.innerDensityCore,
                {
                  width: p.size * 0.55,
                  height: p.size * 0.55,
                  borderRadius: (p.size * 0.55) / 2,
                },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  ambientHaze: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
  },
  fogMistCloud: {
    position: 'absolute',
    backgroundColor: 'rgba(224, 242, 254, 0.70)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#BAE6FD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 22,
    elevation: 8,
  },
  fogCoreCloud: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 18,
    elevation: 10,
  },
  innerDensityCore: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.0,
    shadowRadius: 12,
  },
});
