/**
 * High-Speed Object Tracking & Motion Smoother Engine
 * Applies Exponential Moving Average (EMA) smoothing and robust IoU/Distance matching
 * for flicker-free AR fire rendering and realistic gradual extinguishing dynamics.
 */

export class TrackedObject {
  constructor(id, box, className, confidence) {
    this.id = id;
    this.className = className;
    this.confidence = confidence;
    
    // Coordinates: [x, y, width, height]
    this.currentBox = [...box];
    this.targetBox = [...box];
    
    this.alpha = 0.55; // Smooth EMA smoothing for stable, zero-flicker AR fire
    this.missingFrames = 0;
    this.maxMissingFrames = 90; // Keep fire burning stably for ~3s across camera moves
    this.opacity = 1.0;
    this.targetOpacity = 1.0;
    this.phaseOffset = Math.random() * 10.0;

    // Extinguisher state
    this.isExtinguished = false;
    this.extinguishProgress = 0.0; // 0.0 = full burning, 1.0 = extinguished smoke
  }

  update(newBox, confidence) {
    this.targetBox = [...newBox];
    this.confidence = confidence;
    this.missingFrames = 0;
    this.targetOpacity = 1.0;
  }

  markMissing() {
    this.missingFrames += 1;
    if (this.missingFrames > 45) {
      this.targetOpacity = Math.max(0.0, this.targetOpacity - 0.035);
    }
  }

  /**
   * Extinguishes fire gradually (gaming simulator style ~4.5 seconds of spraying).
   */
  extinguish(delta = 0.0075) {
    this.extinguishProgress = Math.min(1.0, this.extinguishProgress + delta);
    if (this.extinguishProgress >= 0.98) {
      this.isExtinguished = true;
    }
  }

  reignite() {
    this.isExtinguished = false;
    this.extinguishProgress = 0.0;
    this.targetOpacity = 1.0;
    this.opacity = 1.0;
    this.missingFrames = 0;
  }

  tick() {
    // Coordinate interpolation (EMA)
    for (let i = 0; i < 4; i++) {
      this.currentBox[i] += (this.targetBox[i] - this.currentBox[i]) * this.alpha;
    }
    
    // Smooth opacity fade
    this.opacity += (this.targetOpacity - this.opacity) * 0.25;
  }

  get isAlive() {
    return this.missingFrames <= this.maxMissingFrames && this.opacity > 0.05;
  }

  get box() {
    return {
      x: this.currentBox[0],
      y: this.currentBox[1],
      width: Math.max(25, this.currentBox[2]),
      height: Math.max(25, this.currentBox[3]),
    };
  }
}

export class ObjectTracker {
  constructor() {
    this.trackedObjects = new Map();
    this.nextId = 1;
  }

  updateDetections(rawDetections) {
    const unmatchedExisting = new Set(this.trackedObjects.keys());

    for (const det of rawDetections) {
      const [nx, ny, nw, nh] = det.box;
      const ncx = nx + nw / 2;
      const ncy = ny + nh / 2;

      let bestId = null;
      let minDistance = Infinity;

      for (const id of unmatchedExisting) {
        const obj = this.trackedObjects.get(id);
        const [ox, oy, ow, oh] = obj.currentBox;
        const ocx = ox + ow / 2;
        const ocy = oy + oh / 2;

        const dist = Math.hypot(ncx - ocx, ncy - ocy);
        const maxThreshold = Math.max(nw, nh, 160) * 1.6;

        if (dist < maxThreshold && dist < minDistance) {
          minDistance = dist;
          bestId = id;
        }
      }

      if (bestId !== null) {
        this.trackedObjects.get(bestId).update(det.box, det.confidence);
        unmatchedExisting.delete(bestId);
      } else {
        const newId = this.nextId++;
        const newObj = new TrackedObject(newId, det.box, det.className, det.confidence);
        this.trackedObjects.set(newId, newObj);
      }
    }

    for (const id of unmatchedExisting) {
      this.trackedObjects.get(id).markMissing();
    }

    for (const [id, obj] of this.trackedObjects.entries()) {
      if (!obj.isAlive) {
        this.trackedObjects.delete(id);
      }
    }
  }

  extinguishAll(delta = 0.0075) {
    for (const obj of this.trackedObjects.values()) {
      obj.extinguish(delta);
    }
  }

  reigniteAll() {
    for (const obj of this.trackedObjects.values()) {
      obj.reignite();
    }
  }

  clear() {
    this.trackedObjects.clear();
  }

  tick() {
    for (const obj of this.trackedObjects.values()) {
      obj.tick();
    }
    return Array.from(this.trackedObjects.values()).filter((o) => o.isAlive);
  }
}
