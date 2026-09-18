/**
 * Fire Animation & Particle Engine for Mobile AR
 * Computes flame tongue emitter points, organic turbulent flickering, and rising spark embers.
 */

export class FireAnimationManager {
  constructor(numFrames = 16, animationFps = 24) {
    this.numFrames = numFrames;
    this.animationFps = animationFps;
  }

  /**
   * Calculates flame emitter points across object span.
   * For wide objects (benches, machinery, couches), spawns multiple flame tongues.
   */
  getFlameEmitters(box, phaseOffset = 0, timestamp = 0) {
    const { width, height } = box;
    const aspectRatio = width / Math.max(1, height);
    
    let numEmitters = 1;
    if (aspectRatio > 1.35) {
      numEmitters = Math.max(2, Math.min(4, Math.floor(width / 90)));
    }

    const emitterSpacing = width / (numEmitters + 1);
    const emitters = [];

    // Organic chaotic flicker factor
    const flicker = 1.0 + 0.08 * Math.sin(timestamp * 0.015 + phaseOffset);

    for (let i = 0; i < numEmitters; i++) {
      const emitterX = (i + 1) * emitterSpacing;
      const emitterPhase = phaseOffset + i * 2.7;
      
      // Compute loop frame index
      const frameIndex = Math.floor((timestamp * 0.001 * this.animationFps + emitterPhase)) % this.numFrames;
      const safeFrameIndex = ((frameIndex % this.numFrames) + this.numFrames) % this.numFrames;

      // Height variation among tongues
      const tongueHeight = height * 1.35 * flicker * (0.90 + 0.20 * Math.sin(timestamp * 0.012 + i));
      const tongueWidth = (width / numEmitters) * 1.45 * flicker;

      emitters.push({
        id: i,
        x: emitterX - tongueWidth / 2,
        y: height * 0.85 - tongueHeight, // Flame roots near bottom edge
        width: tongueWidth,
        height: tongueHeight,
        frameIndex: safeFrameIndex,
      });
    }

    return {
      emitters,
      flicker,
      numEmitters,
    };
  }

  /**
   * Generates dynamic floating ember particles rising from the burning object.
   */
  generateEmbers(count = 6, box, timestamp = 0) {
    const embers = [];
    const { width, height } = box;

    for (let i = 0; i < count; i++) {
      const pSeed = (i * 137.5 + timestamp * 0.002) % 1.0; // 0..1 progression
      const progress = pSeed;
      
      // Rising upward from bottom
      const py = height * 0.90 - progress * (height * 1.6);
      const sway = 16 * Math.sin(progress * 10.0 + i);
      const px = (width * 0.5) + (Math.sin(i * 3.5) * width * 0.35) + sway;
      
      const size = 3 + (i % 3) * 2;
      const opacity = Math.sin(progress * Math.PI) * 0.9;

      if (opacity > 0.05) {
        embers.push({
          id: i,
          x: px,
          y: py,
          size,
          opacity,
        });
      }
    }

    return embers;
  }
}
