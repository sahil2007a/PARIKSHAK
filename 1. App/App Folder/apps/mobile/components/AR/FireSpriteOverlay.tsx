/**
 * FireSpriteOverlay.tsx
 * Composite animated fire sprite overlay anchored to a detected bounding box.
 * TypeScript port of ML Model/mobile_virtual_fire/src/components/FireOverlay.js
 *
 * Renders:
 *  1. Ambient warm light glow
 *  2. Multi-emitter animated fire sprites (16-frame PNG loop)
 *  3. Floating spark embers
 *  4. Cooling gray smoke puffs (when extinguishing)
 */

import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { FIRE_FRAMES } from './fireRegistry';
import { FlameEmitter, EmberParticle, SmokePuff } from '../../engine/FireEffectEngine';

interface FireSpriteOverlayProps {
  box: { x: number; y: number; width: number; height: number };
  opacity?: number;
  emitters?: FlameEmitter[];
  embers?: EmberParticle[];
  smokePuffs?: SmokePuff[];
  isExtinguished?: boolean;
  blendMode?: 'additive' | 'hybrid';
}

const numFrames = FIRE_FRAMES.length;

export const FireSpriteOverlay: React.FC<FireSpriteOverlayProps> = ({
  box,
  opacity = 1.0,
  emitters = [],
  embers = [],
  smokePuffs = [],
  isExtinguished = false,
  blendMode = 'hybrid',
}) => {
  const { x, y, width, height } = box;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        {
          left: x,
          top: y,
          width,
          height,
          opacity,
        },
      ]}
    >
      {/* 1. Ambient Warm Light (fades when extinguished) */}
      {!isExtinguished && (
        <View
          style={[
            styles.ambientGlow,
            {
              width: width * 1.25,
              height: height * 0.9,
              left: -width * 0.125,
              top: height * 0.1,
              opacity: blendMode === 'additive' ? 0.65 : 0.35,
            },
          ]}
        />
      )}

      {/* 2. Multi-Emitter Animated Fire Sprites */}
      {!isExtinguished &&
        emitters.map((emitter) => {
          const frameSource = FIRE_FRAMES[emitter.frameIndex % numFrames];
          return (
            <View
              key={`emitter-${emitter.id}`}
              style={[
                styles.emitterContainer,
                {
                  left: emitter.x,
                  top: emitter.y,
                  width: emitter.width,
                  height: emitter.height,
                },
              ]}
            >
              <Image
                source={frameSource}
                style={[
                  styles.fireSprite,
                  blendMode === 'additive' && styles.additiveBlend,
                ]}
                resizeMode="stretch"
              />

              {blendMode === 'hybrid' && (
                <Image
                  source={frameSource}
                  style={[styles.fireSprite, styles.coreBoostLayer]}
                  resizeMode="stretch"
                />
              )}
            </View>
          );
        })}

      {/* 3. Floating Spark Embers */}
      {!isExtinguished &&
        embers.map((ember) => (
          <View
            key={`ember-${ember.id}`}
            style={[
              styles.emberParticle,
              {
                left: ember.x,
                top: ember.y,
                width: ember.size,
                height: ember.size,
                borderRadius: ember.size / 2,
                opacity: ember.opacity,
              },
            ]}
          />
        ))}

      {/* 4. Cooling Gray/White Smoke Puffs when Extinguishing */}
      {smokePuffs.map((puff) => (
        <View
          key={puff.id}
          style={[
            styles.smokePuff,
            {
              left: puff.x,
              top: puff.y,
              width: puff.size,
              height: puff.size,
              borderRadius: puff.size / 2,
              opacity: puff.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  ambientGlow: {
    position: 'absolute',
    borderRadius: 40,
    backgroundColor: 'rgba(255, 87, 34, 0.25)',
  },
  emitterContainer: {
    position: 'absolute',
  },
  fireSprite: {
    width: '100%',
    height: '100%',
  },
  additiveBlend: {
    opacity: 0.95,
  },
  coreBoostLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.35,
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  emberParticle: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 4,
  },
  smokePuff: {
    position: 'absolute',
    backgroundColor: 'rgba(180, 195, 210, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
});
