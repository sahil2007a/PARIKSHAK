/**
 * GasSafetyController.ts
 * Authoritative controller for simulated gas leak dynamics, atmospheric testing parameters,
 * PPE donning states, and confined-space entry safety protocol.
 */

export interface GasAtmosphereState {
  oxygenPercent: number; // e.g. 18.2% (Normal 19.5% - 23.5%)
  lelPercent: number; // e.g. 14% (Warning threshold 10%)
  h2sPpm: number; // e.g. 35 ppm (OSHA/NIOSH Ceiling 10 ppm, IDLH 100 ppm)
  coPpm: number; // e.g. 40 ppm
  hazardStatus: 'SAFE' | 'CAUTION' | 'DANGER' | 'IDLH';
  isLeakActive: boolean;
  leakIntensity: number; // 1.0 down to 0.0 when isolated
  vaporCloudRadiusMeters: number;
}

export interface PPEEquippedState {
  hardHat: boolean;
  safetyGoggles: boolean;
  highVisVest: boolean;
  scbaRespirator: boolean;
  gasDetector: boolean;
  lifelineHarness: boolean;
}

export interface GasSafetyProfile {
  oxygen: {
    normalRange: string;
    hazardousBelow: number;
    hazardousAbove: number;
  };
  lel: {
    warningPercent: number;
    explosiveLimit: number;
  };
  h2s: {
    trainingThresholdPpm: number;
    nioshCeilingPpm: number;
    idlhPpm: number;
  };
  co: {
    warningPpm: number;
    criticalPpm: number;
  };
}

export const AUTHORITATIVE_SAFETY_PROFILE: GasSafetyProfile = {
  oxygen: {
    normalRange: '19.5% - 23.5%',
    hazardousBelow: 19.5,
    hazardousAbove: 23.5
  },
  lel: {
    warningPercent: 10,
    explosiveLimit: 100
  },
  h2s: {
    trainingThresholdPpm: 10,
    nioshCeilingPpm: 10,
    idlhPpm: 100
  },
  co: {
    warningPpm: 35,
    criticalPpm: 200
  }
};

export type GasControllerListener = (state: GasAtmosphereState, ppe: PPEEquippedState) => void;

export class GasSafetyController {
  private atmosphereState: GasAtmosphereState;
  private ppeState: PPEEquippedState;
  private buddyConnected = false;
  private isolationValveClosed = false;
  private ventilationActive = false;
  private listeners: GasControllerListener[] = [];
  private updateInterval: any = null;

  constructor() {
    this.atmosphereState = {
      oxygenPercent: 18.2,
      lelPercent: 14,
      h2sPpm: 35,
      coPpm: 40,
      hazardStatus: 'DANGER',
      isLeakActive: true,
      leakIntensity: 1.0,
      vaporCloudRadiusMeters: 2.2
    };

    this.ppeState = {
      hardHat: false,
      safetyGoggles: false,
      highVisVest: false,
      scbaRespirator: false,
      gasDetector: false,
      lifelineHarness: false
    };

    this.evaluateHazardStatus();
  }

  public subscribe(listener: GasControllerListener): () => void {
    this.listeners.push(listener);
    listener(this.atmosphereState, this.ppeState);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.atmosphereState, this.ppeState));
  }

  private evaluateHazardStatus() {
    const { oxygenPercent, lelPercent, h2sPpm } = this.atmosphereState;
    if (
      oxygenPercent < AUTHORITATIVE_SAFETY_PROFILE.oxygen.hazardousBelow ||
      lelPercent >= AUTHORITATIVE_SAFETY_PROFILE.lel.warningPercent ||
      h2sPpm >= AUTHORITATIVE_SAFETY_PROFILE.h2s.nioshCeilingPpm
    ) {
      if (h2sPpm >= 100 || oxygenPercent < 16 || lelPercent >= 25) {
        this.atmosphereState.hazardStatus = 'IDLH';
      } else {
        this.atmosphereState.hazardStatus = 'DANGER';
      }
    } else if (lelPercent > 5 || h2sPpm > 5) {
      this.atmosphereState.hazardStatus = 'CAUTION';
    } else {
      this.atmosphereState.hazardStatus = 'SAFE';
    }
  }

  /**
   * Activates or equips a specific PPE piece
   */
  public equipPPE(item: keyof PPEEquippedState): boolean {
    this.ppeState[item] = true;
    this.notify();
    return true;
  }

  /**
   * Checks if user has all required minimum PPE for hazardous entry
   */
  public hasSufficientPPEForHazard(): boolean {
    return this.ppeState.scbaRespirator && this.ppeState.hardHat && this.ppeState.gasDetector;
  }

  /**
   * Pairs with standby safety observer / buddy
   */
  public connectBuddyLifeline(): boolean {
    this.buddyConnected = true;
    this.ppeState.lifelineHarness = true;
    this.notify();
    return true;
  }

  public isBuddyConnected(): boolean {
    return this.buddyConnected;
  }

  /**
   * Tests if confined space entry is currently permitted by safety protocol
   */
  public canEnterConfinedSpace(): { permitted: boolean; reason: string } {
    if (!this.ppeState.gasDetector) {
      return {
        permitted: false,
        reason: 'Atmosphere must be verified with Multi-Gas Detector before approaching shaft.'
      };
    }
    if (this.atmosphereState.hazardStatus === 'DANGER' || this.atmosphereState.hazardStatus === 'IDLH') {
      if (!this.ppeState.scbaRespirator) {
        return {
          permitted: false,
          reason: 'PROHIBITED: Atmosphere is Oxygen Deficient & Toxic. SCBA required.'
        };
      }
      if (!this.buddyConnected) {
        return {
          permitted: false,
          reason: 'PROHIBITED: Confined-space entry requires an active Standby Buddy Observer.'
        };
      }
    }
    return { permitted: true, reason: 'Entry authorized under strict protocol.' };
  }

  /**
   * Triggers emergency isolation of pipe valve & positive-pressure exhaust fan
   */
  public triggerIsolationAndVentilation(): void {
    this.isolationValveClosed = true;
    this.ventilationActive = true;

    // Gradually disperse gas over simulated time
    if (this.updateInterval) clearInterval(this.updateInterval);
    this.updateInterval = setInterval(() => {
      let changed = false;

      if (this.atmosphereState.leakIntensity > 0.05) {
        this.atmosphereState.leakIntensity = Math.max(0, this.atmosphereState.leakIntensity - 0.15);
        changed = true;
      } else {
        this.atmosphereState.leakIntensity = 0;
        this.atmosphereState.isLeakActive = false;
      }

      if (this.atmosphereState.oxygenPercent < 20.8) {
        this.atmosphereState.oxygenPercent = Number(
          Math.min(20.9, this.atmosphereState.oxygenPercent + 0.5).toFixed(1)
        );
        changed = true;
      }

      if (this.atmosphereState.lelPercent > 0) {
        this.atmosphereState.lelPercent = Math.max(0, this.atmosphereState.lelPercent - 3);
        changed = true;
      }

      if (this.atmosphereState.h2sPpm > 0) {
        this.atmosphereState.h2sPpm = Math.max(0, this.atmosphereState.h2sPpm - 8);
        changed = true;
      }

      if (this.atmosphereState.coPpm > 5) {
        this.atmosphereState.coPpm = Math.max(0, this.atmosphereState.coPpm - 8);
        changed = true;
      }

      this.evaluateHazardStatus();
      this.notify();

      if (!this.atmosphereState.isLeakActive && this.atmosphereState.h2sPpm === 0) {
        clearInterval(this.updateInterval);
      }
    }, 400);
  }

  public getAtmosphereState(): GasAtmosphereState {
    return { ...this.atmosphereState };
  }

  public getPPEState(): PPEEquippedState {
    return { ...this.ppeState };
  }

  public reset(): void {
    if (this.updateInterval) clearInterval(this.updateInterval);
    this.atmosphereState = {
      oxygenPercent: 18.2,
      lelPercent: 14,
      h2sPpm: 35,
      coPpm: 40,
      hazardStatus: 'DANGER',
      isLeakActive: true,
      leakIntensity: 1.0,
      vaporCloudRadiusMeters: 2.2
    };
    this.ppeState = {
      hardHat: false,
      safetyGoggles: false,
      highVisVest: false,
      scbaRespirator: false,
      gasDetector: false,
      lifelineHarness: false
    };
    this.buddyConnected = false;
    this.isolationValveClosed = false;
    this.ventilationActive = false;
    this.evaluateHazardStatus();
    this.notify();
  }
}
