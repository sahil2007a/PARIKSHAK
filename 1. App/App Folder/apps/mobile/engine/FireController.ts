/**
 * FireController.ts
 * Manages spatial fire state, flame intensity, smoke levels, and suppression interactions.
 */

export interface FireState {
  intensity: number; // 1.0 (full roaring fire) down to 0.0 (extinguished)
  isActive: boolean;
  isExtinguished: boolean;
  suppressionPercentage: number;
  flameColorOuter: string;
  flameColorInner: string;
  smokeDensity: number;
  heatRadiusMeters: number;
}

export type FireStateListener = (state: FireState) => void;

export class FireController {
  private intensity: number = 1.0;
  private isActive: boolean = false;
  private listeners: FireStateListener[] = [];
  private anchorPosition = { x: 0, y: 0.9, z: -1.5 }; // Configurable offset on generator

  constructor(initialIntensity: number = 1.0) {
    this.intensity = initialIntensity;
    this.isActive = initialIntensity > 0;
  }

  public subscribe(listener: FireStateListener): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }

  public getState(): FireState {
    const intensity = Math.max(0, Math.min(1.0, this.intensity));
    const isExtinguished = intensity <= 0.01;
    return {
      intensity,
      isActive: this.isActive && !isExtinguished,
      isExtinguished,
      suppressionPercentage: Math.round((1.0 - intensity) * 100),
      flameColorOuter: intensity > 0.4 ? '#FF4500' : '#FF8C00',
      flameColorInner: intensity > 0.3 ? '#FFD700' : '#FFFACD',
      smokeDensity: Math.max(0.1, intensity * 0.9),
      heatRadiusMeters: 1.2 + intensity * 1.8
    };
  }

  public startFire(initialIntensity: number = 1.0) {
    this.intensity = initialIntensity;
    this.isActive = true;
    this.notify();
  }

  public stopFire() {
    this.intensity = 0;
    this.isActive = false;
    this.notify();
  }

  /**
   * Reduces fire intensity when extinguisher discharge hits the fire volume.
   * @param amount typically 0.02 to 0.05 per hit
   */
  public reduceIntensity(amount: number = 0.03): boolean {
    if (!this.isActive || this.intensity <= 0) return true;

    this.intensity = Math.max(0, this.intensity - amount);
    if (this.intensity <= 0.01) {
      this.intensity = 0;
      this.isActive = false;
    }
    this.notify();
    return this.intensity <= 0;
  }

  public increaseIntensity(amount: number = 0.02) {
    if (!this.isActive) return;
    this.intensity = Math.min(1.0, this.intensity + amount);
    this.notify();
  }

  public isExtinguished(): boolean {
    return this.intensity <= 0.01;
  }

  public getIntensity(): number {
    return this.intensity;
  }

  public getAnchorPosition() {
    return { ...this.anchorPosition };
  }

  public setAnchorPosition(pos: { x: number; y: number; z: number }) {
    this.anchorPosition = { ...pos };
  }

  public reset() {
    this.intensity = 1.0;
    this.isActive = true;
    this.notify();
  }
}
