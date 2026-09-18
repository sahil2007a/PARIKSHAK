/**
 * MiningScenarioSpawner.ts
 * Manages spatial layouts, 3D industrial asset placements, and coordinate transformations
 * for the virtual mining & manufacturing training environment.
 */

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface SpatialObjectDescriptor {
  id: string;
  name: string;
  type:
    | 'generator'
    | 'electrical_panel'
    | 'fuel_drum'
    | 'pipes'
    | 'platform'
    | 'extinguisher'
    | 'exit_sign'
    | 'hazard_zone'
    | 'confined_space_shaft'
    | 'gas_detector'
    | 'ppe_station'
    | 'buddy_worker';
  position: Vector3D;
  scale: Vector3D;
  rotation: Vector3D;
  isInteractive: boolean;
  hazardClass?: string;
  boundingRadiusMeters: number;
}

export const FIRE_SCENARIO_LAYOUT = {
  generator: { x: 0, y: 0, z: -1.5 },
  electricalPanel: { x: -1.1, y: 0, z: -1.2 },
  fuelDrum: { x: 1.1, y: 0, z: -1.2 },
  extinguisher: { x: 0.8, y: 0, z: -0.4 },
  exitSign: { x: 0, y: 1.8, z: -2.2 },
  platform: { x: 0, y: 0, z: -1.5 },
  pipes: { x: -1.3, y: 0.8, z: -1.7 },
  hazardZone: { x: 0, y: 0, z: -1.5 },
  generatorFireAnchor: { x: 0, y: 0.85, z: -1.5 }
};

export const GAS_SCENARIO_LAYOUT = {
  pipeSource: { x: 0, y: 0.7, z: -1.6 },
  confinedSpaceEntrance: { x: -1.3, y: 0, z: -2.0 },
  gasDetector: { x: 0.6, y: 0, z: -0.6 },
  ppeStation: { x: 1.4, y: 0.4, z: -1.4 },
  buddyWorker: { x: 1.3, y: 0, z: 0.2 },
  hazardPerimeter: { x: 0, y: 0, z: -1.6 },
  gasCloudAnchor: { x: 0, y: 0.9, z: -1.6 }
};

export class MiningScenarioSpawner {
  /**
   * Spawns complete industrial environment descriptors for Fire & Explosion scenario
   */
  public static spawnFireEnvironment(): SpatialObjectDescriptor[] {
    return [
      {
        id: 'env_platform',
        name: 'Diamond Steel Equipment Foundation',
        type: 'platform',
        position: FIRE_SCENARIO_LAYOUT.platform,
        scale: { x: 2.8, y: 0.08, z: 2.4 },
        rotation: { x: 0, y: 0, z: 0 },
        isInteractive: false,
        boundingRadiusMeters: 1.8
      },
      {
        id: 'env_generator',
        name: 'High-Output Standby Diesel Generator (Class B)',
        type: 'generator',
        position: FIRE_SCENARIO_LAYOUT.generator,
        scale: { x: 1.4, y: 1.2, z: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        isInteractive: true,
        hazardClass: 'Class B Liquid Fuel Fire',
        boundingRadiusMeters: 0.9
      },
      {
        id: 'env_electrical_panel',
        name: '415V Main Industrial Switchgear Cabinet',
        type: 'electrical_panel',
        position: FIRE_SCENARIO_LAYOUT.electricalPanel,
        scale: { x: 0.8, y: 1.7, z: 0.4 },
        rotation: { x: 0, y: 15, z: 0 },
        isInteractive: false,
        hazardClass: 'High Voltage Hazard',
        boundingRadiusMeters: 0.6
      },
      {
        id: 'env_fuel_drum',
        name: 'Heavy Hydrocarbon Diesel Fuel Drum (200L)',
        type: 'fuel_drum',
        position: FIRE_SCENARIO_LAYOUT.fuelDrum,
        scale: { x: 0.6, y: 0.9, z: 0.6 },
        rotation: { x: 0, y: 0, z: 0 },
        isInteractive: false,
        hazardClass: 'Flammable Liquid',
        boundingRadiusMeters: 0.5
      },
      {
        id: 'env_pipes',
        name: 'Fuel & Coolant Pipe Manifold',
        type: 'pipes',
        position: FIRE_SCENARIO_LAYOUT.pipes,
        scale: { x: 1.0, y: 1.0, z: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        isInteractive: false,
        boundingRadiusMeters: 0.7
      },
      {
        id: 'env_extinguisher',
        name: 'ABC Dry Chemical Powder Extinguisher (6kg)',
        type: 'extinguisher',
        position: FIRE_SCENARIO_LAYOUT.extinguisher,
        scale: { x: 0.35, y: 0.7, z: 0.35 },
        rotation: { x: 0, y: 0, z: 0 },
        isInteractive: true,
        boundingRadiusMeters: 0.4
      },
      {
        id: 'env_exit_sign',
        name: 'Photoluminescent Emergency Egress Portal',
        type: 'exit_sign',
        position: FIRE_SCENARIO_LAYOUT.exitSign,
        scale: { x: 1.2, y: 2.2, z: 0.2 },
        rotation: { x: 0, y: 0, z: 0 },
        isInteractive: true,
        boundingRadiusMeters: 1.0
      },
      {
        id: 'env_hazard_zone',
        name: 'Active Thermal & Smoke Hazard Perimeter',
        type: 'hazard_zone',
        position: FIRE_SCENARIO_LAYOUT.hazardZone,
        scale: { x: 3.2, y: 0.05, z: 3.2 },
        rotation: { x: 0, y: 0, z: 0 },
        isInteractive: false,
        hazardClass: 'Thermal Radiation Zone',
        boundingRadiusMeters: 1.6
      }
    ];
  }

  /**
   * Spawns complete industrial environment descriptors for Gas Leak & Confined Space scenario
   */
  public static spawnGasEnvironment(): SpatialObjectDescriptor[] {
    return [
      {
        id: 'env_pipe_source',
        name: 'High-Pressure Hydrocarbon Piping Flange (Leaking)',
        type: 'pipes',
        position: GAS_SCENARIO_LAYOUT.pipeSource,
        scale: { x: 1.2, y: 1.4, z: 0.8 },
        rotation: { x: 0, y: 0, z: 0 },
        isInteractive: true,
        hazardClass: 'Volatile Flammable Vapor (CH4/H2S)',
        boundingRadiusMeters: 0.8
      },
      {
        id: 'env_confined_shaft',
        name: 'Underground Ventilation & Sump Shaft Entrance',
        type: 'confined_space_shaft',
        position: GAS_SCENARIO_LAYOUT.confinedSpaceEntrance,
        scale: { x: 1.6, y: 2.0, z: 1.4 },
        rotation: { x: 0, y: 20, z: 0 },
        isInteractive: true,
        hazardClass: 'Confined Space - Permit Required',
        boundingRadiusMeters: 1.1
      },
      {
        id: 'env_gas_detector',
        name: 'Portable 4-Gas Telemetry Multi-Sensor',
        type: 'gas_detector',
        position: GAS_SCENARIO_LAYOUT.gasDetector,
        scale: { x: 0.25, y: 0.4, z: 0.2 },
        rotation: { x: 0, y: 0, z: 0 },
        isInteractive: true,
        boundingRadiusMeters: 0.3
      },
      {
        id: 'env_ppe_station',
        name: 'Emergency SCBA & Chemical Respirator Cabinet',
        type: 'ppe_station',
        position: GAS_SCENARIO_LAYOUT.ppeStation,
        scale: { x: 1.0, y: 1.6, z: 0.4 },
        rotation: { x: 0, y: -25, z: 0 },
        isInteractive: true,
        boundingRadiusMeters: 0.7
      },
      {
        id: 'env_buddy_worker',
        name: 'Trained Standby Safety Observer & Lifeline Tender',
        type: 'buddy_worker',
        position: GAS_SCENARIO_LAYOUT.buddyWorker,
        scale: { x: 0.6, y: 1.7, z: 0.4 },
        rotation: { x: 0, y: -15, z: 0 },
        isInteractive: true,
        boundingRadiusMeters: 0.6
      },
      {
        id: 'env_gas_hazard_zone',
        name: 'Zone-0 Explosive/Toxic Atmosphere Boundary',
        type: 'hazard_zone',
        position: GAS_SCENARIO_LAYOUT.hazardPerimeter,
        scale: { x: 4.4, y: 0.05, z: 4.4 },
        rotation: { x: 0, y: 0, z: 0 },
        isInteractive: false,
        hazardClass: 'IDLH Exclusion Zone',
        boundingRadiusMeters: 2.2
      }
    ];
  }

  /**
   * Tests if the nozzle aiming vector intersects the fire target volume within tolerance
   * @param aimPitchDeg user camera / nozzle pitch
   * @param aimYawDeg user camera / nozzle yaw
   * @param targetPitch expected pitch to flame base (-25 to -35 deg typically for phone looking down)
   * @param targetYaw expected yaw to generator (0 deg when facing generator)
   * @param toleranceDeg angular window allowed (default 18 deg)
   */
  public static checkAimAlignment(
    aimPitchDeg: number,
    aimYawDeg: number,
    targetPitch: number = -28,
    targetYaw: number = 0,
    toleranceDeg: number = 18
  ): { isAligned: boolean; pitchDiff: number; yawDiff: number } {
    const pitchDiff = Math.abs(aimPitchDeg - targetPitch);
    const yawDiff = Math.abs(aimYawDeg - targetYaw);
    const isAligned = pitchDiff <= toleranceDeg && yawDiff <= toleranceDeg;
    return { isAligned, pitchDiff, yawDiff };
  }
}
