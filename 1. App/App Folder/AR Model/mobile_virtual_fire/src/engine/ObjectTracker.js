/**
 * Mobile AR Object Tracker & Coordinate Smoother
 * Applies Exponential Moving Average (EMA) interpolation to eliminate detector jitter
 * and maintain smooth 60 FPS motion tracking for virtual fire anchoring.
 */

export class TrackedObject {
  constructor(id, box, className, confidence) {
    this.id = id;
    this.className = className;
    this.confidence = confidence;
    
    // Coordinates: [x, y, width, height]
    this.currentBox = [...box];
    this.targetBox = [...box];
    
    this.alpha = 0.38; // Smoothing interpolation factor
    this.missingFrames = 0;
    this.maxMissingFrames = 8;
    this.opacity = 1.0;
    this.targetOpacity = 1.0;
    this.phaseOffset = Math.random() * 10.0;
  }

  update(newBox, confidence) {
    this.targetBox = [...newBox];
    this.confidence = confidence;
    this.missingFrames = 0;
    this.targetOpacity = 1.0;
  }

  markMissing() {
    this.missingFrames += 1;
    if (this.missingFrames > 3) {
      this.targetOpacity = Math.max(0.0, this.targetOpacity - 0.25);
    }
  }

  tick() {
    // Smooth coordinate interpolation (EMA)
    for (let i = 0; i < 4; i++) {
      this.currentBox[i] += (this.targetBox[i] - this.currentBox[i]) * this.alpha;
    }
    
    // Smooth opacity fade
    this.opacity += (this.targetOpacity - this.opacity) * 0.25;
  }

  get isAlive() {
    return this.missingFrames <= this.maxMissingFrames && this.opacity > 0.02;
  }

  get box() {
    return {
      x: this.currentBox[0],
      y: this.currentBox[1],
      width: Math.max(20, this.currentBox[2]),
      height: Math.max(20, this.currentBox[3]),
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
        const maxThreshold = Math.max(nw, nh) * 0.95;

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

    // Mark missing
    for (const id of unmatchedExisting) {
      this.trackedObjects.get(id).markMissing();
    }

    // Prune dead objects
    for (const [id, obj] of this.trackedObjects.entries()) {
      if (!obj.isAlive) {
        this.trackedObjects.delete(id);
      }
    }
  }

  tick() {
    for (const obj of this.trackedObjects.values()) {
      obj.tick();
    }
    return Array.from(this.trackedObjects.values());
  }

  getActiveObjects() {
    return Array.from(this.trackedObjects.values()).filter(o => o.isAlive);
  }
}
