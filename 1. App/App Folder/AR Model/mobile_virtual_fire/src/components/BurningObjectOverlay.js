import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { FIRE_FRAMES } from '../assets/fireSpritesRegistry';
import { THEME } from '../styles/theme';

export default function BurningObjectOverlay({
  box,
  opacity = 1.0,
  emitters = [],
  embers = [],
  blendMode = 'hybrid'
}) {
  const { x, y, width, height } = box;
  const numFrames = FIRE_FRAMES.length;

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
        }
      ]}
    >
      {/* 1. Ambient Ground/Object Heat Glow */}
      <View
        style={[
          styles.ambientGlow,
          {
            width: width * 1.25,
            height: height * 0.9,
            left: -width * 0.125,
            top: height * 0.1,
            opacity: blendMode === 'additive' ? 0.65 : 0.45,
          }
        ]}
      />

      {/* 2. Multi-Emitter Animated Fire Tongues */}
      {emitters.map((emitter) => {
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
              }
            ]}
          >
            {/* Base Sprite */}
            <Image
              source={frameSource}
              style={[
                styles.fireSprite,
                blendMode === 'additive' && styles.additiveBlend,
              ]}
              resizeMode="stretch"
            />
            {/* Incandescent Core Layer for Hybrid Glow */}
            {blendMode === 'hybrid' && (
              <Image
                source={frameSource}
                style={[
                  styles.fireSprite,
                  styles.coreBoostLayer,
                ]}
                resizeMode="stretch"
              />
            )}
          </View>
        );
      })}

      {/* 3. Floating Dynamic Ember Sparks */}
      {embers.map((ember) => (
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
            }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  ambientGlow: {
    position: 'absolute',
    borderRadius: 50,
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
    backgroundColor: THEME.colors.goldCore,
    shadowColor: THEME.colors.primaryGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 4,
  },
});
