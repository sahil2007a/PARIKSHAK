/**
 * FireEffectEngine.ts
 * High-Performance Fire & Extinguisher Effect Engine
 * TypeScript port of ML Model/mobile_virtual_fire/src/effects/fireEffect.js
 *
 * Computes multi-emitter flames, rising embers, CO2 extinguisher spray jets,
 * and cooling smoke puffs for the AR fire simulation overlay.
 */

export interface FireBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FlameEmitter {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  frameIndex: number;
}

export interface EmberParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export interface SmokePuff {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export interface SprayParticle {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  layer: 'core' | 'mist';
}

export interface FlameEmittersResult {
  emitters: FlameEmitter[];
  flicker: number;
  numEmitters: number;
}

export class FireEffectEngine {
  private numFrames: number;
  private animationFps: number;

  constructor(numFrames: number = 16, animationFps: number = 24) {
    this.numFrames = numFrames;
    this.animationFps = animationFps;
  }

  /**
   * Computes flame tongues across the object width with smooth gradual extinction.
   */
  getFlameEmitters(
    box: FireBox,
    phaseOffset: number = 0,
    timestamp: number = 0,
    extinguishProgress: number = 0.0
  ): FlameEmittersResult {
    const { width, height } = box;
    const aspectRatio = width / Math.max(1, height);

    let numEmitters = 1;
    if (aspectRatio > 1.35) {
      numEmitters = Math.max(2, Math.min(4, Math.floor(width / 90)));
    }

    const emitterSpacing = width / (numEmitters + 1);
    const emitters: FlameEmitter[] = [];

    const extScale = Math.pow(Math.max(0.0, 1.0 - extinguishProgress), 1.25);
    if (extScale <= 0.02) {
      return { emitters: [], flicker: 0.0, numEmitters: 0 };
    }

    const flicker = (1.0 + 0.08 * Math.sin(timestamp * 0.015 + phaseOffset)) * extScale;

    for (let i = 0; i < numEmitters; i++) {
      const emitterX = (i + 1) * emitterSpacing;
      const emitterPhase = phaseOffset + i * 2.7;

      const frameIndex = Math.floor((timestamp * 0.001 * this.animationFps + emitterPhase)) % this.numFrames;
      const safeFrameIndex = ((frameIndex % this.numFrames) + this.numFrames) % this.numFrames;

      const tongueHeight = height * 1.35 * flicker * (0.90 + 0.20 * Math.sin(timestamp * 0.012 + i));
      const tongueWidth = (width / numEmitters) * 1.45 * flicker;

      emitters.push({
        id: i,
        x: emitterX - tongueWidth / 2,
        y: height * 0.85 - tongueHeight,
        width: Math.max(12, tongueWidth),
        height: Math.max(12, tongueHeight),
        frameIndex: safeFrameIndex,
      });
    }

    return { emitters, flicker, numEmitters };
  }

  /**
   * Generates dynamic floating ember particles rising from the burning object.
   */
  generateEmbers(
    count: number = 5,
    box: FireBox,
    timestamp: number = 0,
    extinguishProgress: number = 0.0
  ): EmberParticle[] {
    if (extinguishProgress >= 0.85) return [];

    const embers: EmberParticle[] = [];
    const { width, height } = box;
    const factor = Math.max(0.0, 1.0 - extinguishProgress);

    for (let i = 0; i < count; i++) {
      const pSeed = (i * 137.5 + timestamp * 0.002) % 1.0;
      const py = height * 0.90 - pSeed * (height * 1.5);
      const sway = 14 * Math.sin(pSeed * 10.0 + i);
      const px = (width * 0.5) + (Math.sin(i * 3.5) * width * 0.35) + sway;

      const size = 3 + (i % 3) * 2;
      const opacity = Math.sin(pSeed * Math.PI) * 0.85 * factor;

      if (opacity > 0.05) {
        embers.push({ id: i, x: px, y: py, size, opacity });
      }
    }

    return embers;
  }

  /**
   * Generates rising gray cooling smoke puffs when an object is being extinguished.
   */
  generateSmokePuffs(
    box: FireBox,
    timestamp: number = 0,
    extinguishProgress: number = 0.0
  ): SmokePuff[] {
    if (extinguishProgress <= 0.04) return [];

    const puffs: SmokePuff[] = [];
    const { width, height } = box;
    const numPuffs = 8;

    for (let i = 0; i < numPuffs; i++) {
      const pSeed = (i * 0.14 + timestamp * 0.0016) % 1.0;
      const px = width * (0.12 + i * 0.12) + Math.sin(pSeed * 6.0 + i) * 30;
      const py = height * 0.80 - pSeed * (height * 2.1);
      const size = (40 + pSeed * 70) * Math.min(1.0, extinguishProgress * 1.5);
      const opacity = Math.sin(pSeed * Math.PI) * (0.50 + extinguishProgress * 0.40);

      if (opacity > 0.05) {
        puffs.push({ id: `smoke-${i}`, x: px - size / 2, y: py, size, opacity });
      }
    }

    return puffs;
  }

  /**
   * Generates high-pressure billowing CO2 gas / cryogenic fog clouds from the
   * bottom-right nozzle (matching ARExtinguisher3DLayer position).
   */
  generateSprayParticles(
    count: number = 22,
    timestamp: number = 0,
    screenWidth: number = 400,
    screenHeight: number = 800
  ): SprayParticle[] {
    const particles: SprayParticle[] = [];
    const originX = screenWidth - 75;
    const originY = screenHeight - 165;
    const targetCenterX = screenWidth * 0.38;
    const targetCenterY = screenHeight * 0.40;

    for (let i = 0; i < count; i++) {
      const pSeed = (i * 0.045 + timestamp * 0.0042) % 1.0;
      const progress = pSeed;

      const spreadX = Math.sin(i * 3.7 + timestamp * 0.012) * (50 * progress);
      const spreadY = Math.cos(i * 4.1 + timestamp * 0.014) * (40 * progress);

      const currX = originX + (targetCenterX - originX) * progress + spreadX;
      const currY = originY + (targetCenterY - originY) * progress + spreadY;

      const size = 25 + progress * 135;
      const opacity = Math.sin(Math.pow(progress, 0.75) * Math.PI) * (0.85 - progress * 0.25);

      particles.push({
        id: `fog-${i}`,
        x: currX - size / 2,
        y: currY - size / 2,
        size,
        opacity: Math.max(0.0, opacity),
        layer: i % 2 === 0 ? 'core' : 'mist',
      });
    }

    return particles;
  }
}
