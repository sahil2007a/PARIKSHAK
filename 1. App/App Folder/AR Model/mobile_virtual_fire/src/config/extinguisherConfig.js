/**
 * Centralized 3D Fire Extinguisher AR Configuration
 * Configures model scale, AR scene placement, nozzle offset, discharge dynamics, and particle behavior.
 */

export const EXTINGUISHER_CONFIG = {
  // 3D Model AR Transform & Normalization
  scale: 1.15,
  position: {
    x: 0.55,    // Positioned in the lower-right AR scene
    y: -0.85,   // Ground level anchor
    z: -1.75,   // Distance in front of camera
  },
  rotation: {
    x: 0.08,    // Slight upward tilt
    y: -0.42,   // Angled towards the center of the AR scene / burning objects
    z: 0.0,
  },

  // Nozzle emission point relative to model center
  nozzleOffset: {
    x: -0.12,   // Extinguisher hose / nozzle tip
    y: 0.48,    // Height of nozzle
    z: 0.28,    // Forward offset
  },

  // Direction and physics of the CO2 / chemical powder discharge stream
  dischargeDirection: {
    x: -0.85,   // Shoots towards center-left (where objects burn)
    y: 0.35,    // Slight upward expansion
    z: -1.45,   // Forward trajectory into the scene
  },

  // Particle & Discharge Parameters
  dischargeDuration: 8.0,      // Total continuous discharge duration in seconds
  particleCount: 220,          // GPU-friendly particle pool size
  dispersionAngle: 0.40,       // Cone expansion radius
  initialVelocity: 3.8,        // High-velocity ejection speed
  airResistance: 0.94,         // Natural deceleration factor
  fogColor: '#E2E8F0',         // Cold white / slight blue-gray tint
  fogCoreColor: '#38BDF8',     // Cryogenic nozzle core tint
};
