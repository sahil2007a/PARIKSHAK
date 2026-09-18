/**
 * Detector Bridge for Mobile AR Virtual Fire
 * Supports:
 * 1. Live WebSocket / REST connection to Python YOLOv8 server (real camera inference)
 * 2. Standalone AR Simulator / Tap-to-Spawn target mode (works 100% in Expo Go without backend setup)
 */

export class DetectorBridge {
  constructor(options = {}) {
    this.serverUrl = options.serverUrl || 'ws://192.168.1.100:8000/ws/detect';
    this.targetClasses = new Set(options.targetClasses || ['bench', 'lathe machine', 'electric pole', 'chair', 'laptop', 'bottle']);
    this.isConnected = false;
    this.ws = null;
    this.onDetectionsCallback = null;
    this.isDemoMode = options.isDemoMode !== undefined ? options.isDemoMode : true;
    
    // Initial target objects positioned prominently in view
    this.simulatedObjects = [
      {
        box: [60, 260, 240, 150], // Bench
        className: 'bench',
        confidence: 0.96,
        speedX: 0.8,
        speedY: 0.4,
      },
      {
        box: [180, 460, 110, 240], // Electric Pole
        className: 'electric pole',
        confidence: 0.91,
        speedX: -0.6,
        speedY: 0.3,
      }
    ];
  }

  setTargetClasses(classes) {
    this.targetClasses = new Set(classes.map(c => c.toLowerCase().trim()));
  }

  isTarget(className) {
    const cLower = className.toLowerCase().trim();
    for (const target of this.targetClasses) {
      if (target === cLower || target.includes(cLower) || cLower.includes(target)) {
        return true;
      }
    }
    return false;
  }

  connect(serverUrl) {
    if (serverUrl) this.serverUrl = serverUrl;
    this.isDemoMode = false;

    try {
      if (this.ws) {
        this.ws.close();
      }

      this.ws = new WebSocket(this.serverUrl);
      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('[DetectorBridge] Connected to YOLO backend server:', this.serverUrl);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data && data.detections && this.onDetectionsCallback) {
            // Filter targets
            const filtered = data.detections
              .filter(d => this.isTarget(d.class_name))
              .map(d => ({
                box: d.box, // [x, y, w, h]
                className: d.class_name,
                confidence: d.confidence,
              }));
            this.onDetectionsCallback(filtered, data.latency_ms || 18.0);
          }
        } catch (e) {
          console.error('[DetectorBridge] JSON parsing error:', e);
        }
      };

      this.ws.onerror = (err) => {
        console.log('[DetectorBridge] WebSocket connection error (using AR Simulator):', err.message);
        this.isConnected = false;
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        console.log('[DetectorBridge] WebSocket disconnected.');
      };
    } catch (e) {
      console.warn('[DetectorBridge] Could not initiate WebSocket:', e);
      this.isConnected = false;
    }
  }

  sendFrame(base64Jpeg) {
    if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ frame: base64Jpeg }));
    }
  }

  /**
   * Spawns or anchors a virtual target object at touch screen coordinates.
   */
  spawnTargetAt(x, y, className = 'bench') {
    const defaultSizes = {
      'bench': [220, 140],
      'lathe machine': [240, 180],
      'electric pole': [90, 280],
      'chair': [150, 180],
      'laptop': [160, 120],
      'bottle': [80, 160],
    };

    const size = defaultSizes[className] || [160, 140];
    const newBox = [
      Math.max(10, x - size[0] / 2),
      Math.max(10, y - size[1] / 2),
      size[0],
      size[1]
    ];

    this.simulatedObjects.push({
      box: newBox,
      className,
      confidence: 0.95,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.5,
    });
  }

  clearSimulatedTargets() {
    this.simulatedObjects = [];
  }

  /**
   * Generates next frame detections for AR simulation in Expo Go.
   */
  tickSimulation(screenWidth, screenHeight) {
    const detections = [];

    for (const obj of this.simulatedObjects) {
      if (!this.isTarget(obj.className)) continue;

      let [x, y, w, h] = obj.box;
      
      // Gentle floating motion
      x += obj.speedX;
      y += obj.speedY;

      if (x <= 10 || x + w >= screenWidth - 10) obj.speedX *= -1;
      if (y <= 120 || y + h >= screenHeight - 160) obj.speedY *= -1;

      obj.box = [x, y, w, h];

      detections.push({
        box: [x, y, w, h],
        className: obj.className,
        confidence: obj.confidence,
      });
    }

    return detections;
  }
}
