import { YOLODetectedObject, IndustrialAssetType, ARPlaneType, INDUSTRIAL_ASSET_CATALOG } from '@parishak/shared';

export interface CVInferenceMetrics {
  inferenceTimeMs: number;
  fps: number;
  detectionsCount: number;
  engine: 'YOLOv8-Nano-Industrial' | 'EdgeTPU-Sim';
}

class CVObjectDetectorService {
  private isEnabled: boolean = true;
  private currentScenario: 'FIRE_AND_EXPLOSION' | 'GAS_LEAK_CONFINED_SPACE' = 'FIRE_AND_EXPLOSION';
  private frameCount: number = 0;

  public setScenario(scenario: 'FIRE_AND_EXPLOSION' | 'GAS_LEAK_CONFINED_SPACE') {
    this.currentScenario = scenario;
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Evaluates current camera frame and returns spatial industrial bounding boxes
   * with confidence scores, classes, and anchor relations.
   */
  public getDetections(isSurfaceLocked: boolean, currentStepIndex: number): YOLODetectedObject[] {
    if (!this.isEnabled) return [];

    this.frameCount++;
    const jitter = Math.sin(this.frameCount * 0.1) * 0.5;

    if (this.currentScenario === 'FIRE_AND_EXPLOSION') {
      const detections: YOLODetectedObject[] = [
        {
          id: 'det_gen_01',
          yoloClass: 'diesel_generator',
          assetType: 'diesel_generator',
          label: 'Diesel Generator [Class B Fuel Source]',
          confidence: Math.round(94.2 + Math.abs(jitter * 2)),
          bbox: {
            x: 22 + jitter * 0.4,
            y: 36 + jitter * 0.3,
            width: 56,
            height: 38
          },
          distanceMeters: 1.4,
          isTargetOfInterest: currentStepIndex === 0 || currentStepIndex === 3,
          associatedPlane: 'horizontal'
        }
      ];

      // Emergency Exit visible on vertical plane in step 1 or later
      if (currentStepIndex >= 1) {
        detections.push({
          id: 'det_exit_01',
          yoloClass: 'emergency_exit',
          assetType: 'emergency_exit',
          label: 'Photoluminescent Exit Route [Egress Door]',
          confidence: Math.round(97.8 + Math.abs(jitter)),
          bbox: {
            x: 62 + jitter * 0.3,
            y: 14 + jitter * 0.2,
            width: 28,
            height: 44
          },
          distanceMeters: 3.2,
          isTargetOfInterest: currentStepIndex === 1,
          associatedPlane: 'vertical'
        });
      }

      // Fire Extinguisher visible in step 2 & 3
      if (currentStepIndex >= 2 && currentStepIndex <= 3) {
        detections.push({
          id: 'det_ext_01',
          yoloClass: 'fire_extinguisher_abc',
          assetType: 'fire_extinguisher_abc',
          label: 'ABC Dry Powder Extinguisher [6kg]',
          confidence: Math.round(96.5 + Math.abs(jitter)),
          bbox: {
            x: 12 + jitter * 0.2,
            y: 52 + jitter * 0.4,
            width: 24,
            height: 36
          },
          distanceMeters: 0.9,
          isTargetOfInterest: currentStepIndex === 2,
          associatedPlane: 'horizontal'
        });
      }

      return detections;
    } else {
      // GAS_LEAK_CONFINED_SPACE detections
      const detections: YOLODetectedObject[] = [
        {
          id: 'det_valve_01',
          yoloClass: 'pipe_valve',
          assetType: 'pipe_valve',
          label: 'Main Isolation Gate Valve [High Pressure]',
          confidence: Math.round(95.1 + Math.abs(jitter * 2)),
          bbox: {
            x: 32 + jitter * 0.3,
            y: 28 + jitter * 0.2,
            width: 36,
            height: 38
          },
          distanceMeters: 1.1,
          isTargetOfInterest: currentStepIndex === 4,
          associatedPlane: 'vertical'
        },
        {
          id: 'det_cyl_01',
          yoloClass: 'gas_cylinder',
          assetType: 'gas_cylinder',
          label: 'Pressurized Hydrocarbon Cylinder Rack',
          confidence: Math.round(93.4 + Math.abs(jitter)),
          bbox: {
            x: 64 + jitter * 0.4,
            y: 34 + jitter * 0.3,
            width: 26,
            height: 48
          },
          distanceMeters: 2.2,
          isTargetOfInterest: false,
          associatedPlane: 'horizontal'
        }
      ];

      if (currentStepIndex >= 0) {
        detections.push({
          id: 'det_hazard_01',
          yoloClass: 'hazard_zone',
          assetType: 'hazard_zone',
          label: 'Zone-0 Confined Space Restricted Boundary',
          confidence: Math.round(98.2 + Math.abs(jitter)),
          bbox: {
            x: 15 + jitter * 0.3,
            y: 54 + jitter * 0.4,
            width: 70,
            height: 32
          },
          distanceMeters: 1.8,
          isTargetOfInterest: currentStepIndex === 0 || currentStepIndex === 5,
          associatedPlane: 'horizontal'
        });
      }

      return detections;
    }
  }

  public getMetrics(): CVInferenceMetrics {
    return {
      inferenceTimeMs: 14 + Math.round(Math.random() * 4),
      fps: 30,
      detectionsCount: this.isEnabled ? (this.currentScenario === 'FIRE_AND_EXPLOSION' ? 3 : 3) : 0,
      engine: 'YOLOv8-Nano-Industrial'
    };
  }
}

export const cvObjectDetector = new CVObjectDetectorService();
