/**
 * High-Performance Object Detection Bridge & YOLO Streaming
 * Integrates BackendConnectionManager, throttles frame ingestion, and drops stale frames.
 */

import { BackendConnectionManager, CONNECTION_STATUS } from '../network/BackendConnectionManager';

const CLASS_SYNONYMS = {
  'bench': ['bench', 'chair', 'couch', 'sofa', 'bed', 'dining table', 'table'],
  'lathe machine': ['lathe machine', 'machine', 'microwave', 'oven', 'refrigerator', 'tv', 'sink', 'appliance'],
  'electric pole': ['electric pole', 'pole', 'traffic light', 'stop sign', 'parking meter', 'street light', 'fire hydrant'],
  'chair': ['chair', 'couch', 'sofa', 'bench', 'seat'],
  'laptop': ['laptop', 'tv', 'keyboard', 'monitor', 'computer'],
  'bottle': ['bottle', 'cup', 'wine glass', 'vase'],
  'cup': ['cup', 'bottle', 'bowl', 'mug'],
  'cell phone': ['cell phone', 'remote'],
  'person': ['person'],
};

export class RealTimeDetector {
  constructor(options = {}) {
    this.targetClasses = new Set(
      options.targetClasses || [
        'bench',
        'lathe machine',
        'electric pole',
        'chair',
        'laptop',
        'bottle',
        'cup',
        'dining table',
        'couch',
        'tv',
      ]
    );

    this.connectionManager = new BackendConnectionManager();
    this.isInFlight = false;
    this.pendingFrame = null;
    this.lastFrameTime = 0;
    this.minFrameIntervalMs = 120; // Max ~8 FPS inference to prevent thermal/network throttling

    this.onDetectionsCallback = null;
    this.onConnectionStatusChange = null;

    // Hook up connection manager events
    this.connectionManager.onStatusChange = (status, ip) => {
      if (this.onConnectionStatusChange) {
        this.onConnectionStatusChange(status === CONNECTION_STATUS.CONNECTED, status, ip);
      }
    };

    this.connectionManager.onDetections = (detections, latency, imgW, imgH) => {
      this.isInFlight = false;

      // Filter against target classes
      const filtered = (detections || []).filter((d) => this.isTarget(d.class_name));
      if (this.onDetectionsCallback) {
        this.onDetectionsCallback(filtered, latency, imgW, imgH);
      }

      // If a newer frame arrived while in-flight, process it now (dropping stale ones)
      if (this.pendingFrame) {
        const nextFrame = this.pendingFrame;
        this.pendingFrame = null;
        this.dispatchFrame(nextFrame);
      }
    };
  }

  get serverIp() {
    return this.connectionManager.serverIp;
  }

  get isConnected() {
    return this.connectionManager.status === CONNECTION_STATUS.CONNECTED;
  }

  get connectionStatus() {
    return this.connectionManager.status;
  }

  setServerAddress(ip) {
    this.connectionManager.setManualIp(ip);
  }

  setTargetClasses(classes) {
    this.targetClasses = new Set(classes.map((c) => c.toLowerCase().trim()));
  }

  isTarget(className) {
    if (!className) return false;
    const cLower = className.toLowerCase().trim();

    for (const target of this.targetClasses) {
      if (target === cLower || target.includes(cLower) || cLower.includes(target)) {
        return true;
      }
      const synonyms = CLASS_SYNONYMS[target];
      if (synonyms && synonyms.includes(cLower)) {
        return true;
      }
    }
    return false;
  }

  connect() {
    this.connectionManager.start();
  }

  reconnect() {
    this.connectionManager.reconnect();
  }

  /**
   * Process camera frame with rate-limiting and latest-frame queue.
   */
  async processCameraFrame(cameraRef) {
    if (!cameraRef) return;

    const now = Date.now();
    if (now - this.lastFrameTime < this.minFrameIntervalMs) {
      return; // Rate limit
    }
    this.lastFrameTime = now;

    try {
      const photo = await cameraRef.takePictureAsync({
        quality: 0.22,
        base64: true,
        skipProcessing: true,
        shutterSound: false,
      });

      if (photo && photo.base64) {
        if (this.isInFlight) {
          // Store latest frame, dropping older ones
          this.pendingFrame = photo.base64;
        } else {
          this.dispatchFrame(photo.base64);
        }
      }
    } catch (e) {
      // Camera busy
    }
  }

  dispatchFrame(base64Data) {
    this.isInFlight = true;
    const sent = this.connectionManager.sendFrame(base64Data);
    if (!sent) {
      this.sendHttpFallback(base64Data);
    }
  }

  async sendHttpFallback(base64Jpeg) {
    try {
      const response = await fetch(this.connectionManager.httpDetectUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frame: base64Jpeg }),
      });

      this.isInFlight = false;

      if (response.ok) {
        const data = await response.json();
        const latency = data.latency_ms || 14.0;
        const filtered = (data.detections || []).filter((d) => this.isTarget(d.class_name));
        if (this.onDetectionsCallback) {
          this.onDetectionsCallback(filtered, latency, data.image_width || 320, data.image_height || 240);
        }
      }
    } catch (e) {
      this.isInFlight = false;
    }

    // Process next frame in queue if present
    if (this.pendingFrame) {
      const next = this.pendingFrame;
      this.pendingFrame = null;
      this.dispatchFrame(next);
    }
  }
}
