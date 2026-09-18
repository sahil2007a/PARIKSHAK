/**
 * Resilient Backend Connection Manager & LAN Auto-Discovery Engine
 * Automatically discovers, connects, health-checks, and reconnects to the YOLO backend.
 */

import { NativeModules, Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CONNECTION_STATUS = {
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  RECONNECTING: 'RECONNECTING',
  ERROR: 'ERROR',
};

const STORAGE_KEY_LAST_IP = '@yolo_last_connected_ip';
const DEFAULT_PORT = 8000;

export class BackendConnectionManager {
  constructor() {
    this.status = CONNECTION_STATUS.DISCONNECTED;
    this.serverIp = '10.205.170.1';
    this.serverPort = DEFAULT_PORT;
    this.ws = null;
    this.reconnectTimer = null;
    this.healthCheckTimer = null;
    this.reconnectAttempts = 0;
    this.maxReconnectDelay = 10000; // 10s max backoff
    this.isDiscovering = false;

    this.onStatusChange = null;
    this.onDetections = null;
    this.lastLatency = 0;
  }

  /**
   * Automatically extracts the development computer's LAN IP from Expo runtime environment.
   */
  getAutoDetectedLanIp() {
    try {
      // 1. Check Expo Go Config Host URI (e.g. "10.205.170.1:8081")
      const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost || Constants.manifest?.debuggerHost;
      if (hostUri) {
        const ip = hostUri.split(':')[0];
        if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
          return ip;
        }
      }

      // 2. Check Native SourceCode scriptURL
      const scriptURL = NativeModules.SourceCode?.scriptURL;
      if (scriptURL) {
        const match = scriptURL.match(/:\/\/([^:/]+)/);
        if (match && match[1] && match[1] !== 'localhost' && match[1] !== '127.0.0.1') {
          return match[1];
        }
      }
    } catch (e) {}

    return null;
  }

  /**
   * Initializes discovery and auto-connects to YOLO backend.
   */
  async start() {
    this.updateStatus(CONNECTION_STATUS.CONNECTING);

    // 1. Gather candidate IP list
    const candidates = [];

    // Auto-detected Expo LAN IP (Highest Priority)
    const autoIp = this.getAutoDetectedLanIp();
    if (autoIp) candidates.push(autoIp);

    // Stored last working IP from previous session
    try {
      const savedIp = await AsyncStorage.getItem(STORAGE_KEY_LAST_IP);
      if (savedIp && !candidates.includes(savedIp)) {
        candidates.push(savedIp);
      }
    } catch (e) {}

    // Fallbacks
    const fallbackIps = ['10.205.170.1', '10.134.164.1', '192.168.1.100', '127.0.0.1'];
    for (const fIp of fallbackIps) {
      if (!candidates.includes(fIp)) candidates.push(fIp);
    }

    // 2. Probe candidates for healthy backend
    let workingIp = null;
    for (const ip of candidates) {
      const isAlive = await this.probeHealth(ip);
      if (isAlive) {
        workingIp = ip;
        break;
      }
    }

    if (workingIp) {
      this.serverIp = workingIp;
      await this.saveLastWorkingIp(workingIp);
      this.connectWebSocket();
    } else {
      // Use primary autoIp / default and attempt connection
      this.serverIp = autoIp || candidates[0] || '10.205.170.1';
      this.connectWebSocket();
    }
  }

  /**
   * Fast, lightweight health probe using fetch with 1.2s timeout.
   */
  async probeHealth(ip, port = DEFAULT_PORT) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch(`http://${ip}:${port}/health`, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return data.status === 'healthy';
      }
    } catch (e) {}
    return false;
  }

  async saveLastWorkingIp(ip) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LAST_IP, ip);
    } catch (e) {}
  }

  setManualIp(ip) {
    if (!ip) return;
    this.serverIp = ip.trim();
    this.saveLastWorkingIp(this.serverIp);
    this.reconnect();
  }

  get wsUrl() {
    return `ws://${this.serverIp}:${this.serverPort}/ws/detect`;
  }

  get httpDetectUrl() {
    return `http://${this.serverIp}:${this.serverPort}/detect`;
  }

  connectWebSocket() {
    this.cleanupWebSocket();

    try {
      this.updateStatus(this.reconnectAttempts > 0 ? CONNECTION_STATUS.RECONNECTING : CONNECTION_STATUS.CONNECTING);
      console.log(`[ConnectionManager] Connecting to ${this.wsUrl}...`);

      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log(`[ConnectionManager] Connected to YOLO backend at ${this.serverIp}`);
        this.reconnectAttempts = 0;
        this.updateStatus(CONNECTION_STATUS.CONNECTED);
        this.startHealthCheck();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.lastLatency = data.latency_ms || 12.0;

          if (data && this.onDetections) {
            this.onDetections(
              data.detections || [],
              this.lastLatency,
              data.image_width || 320,
              data.image_height || 240
            );
          }
        } catch (e) {}
      };

      this.ws.onerror = (e) => {
        console.log(`[ConnectionManager] WebSocket connection notice on ${this.serverIp}`);
        this.handleDisconnect();
      };

      this.ws.onclose = () => {
        this.handleDisconnect();
      };
    } catch (e) {
      this.handleDisconnect();
    }
  }

  handleDisconnect() {
    this.cleanupWebSocket();
    this.updateStatus(CONNECTION_STATUS.RECONNECTING);
    this.scheduleReconnect();
  }

  scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);

    this.reconnectAttempts += 1;
    // Exponential backoff: 1s, 2s, 4s, 8s (max 10s)
    const delay = Math.min(1000 * Math.pow(1.8, this.reconnectAttempts - 1), this.maxReconnectDelay);

    console.log(`[ConnectionManager] Retrying connection to ${this.serverIp} in ${(delay / 1000).toFixed(1)}s (Attempt #${this.reconnectAttempts})...`);

    this.reconnectTimer = setTimeout(async () => {
      // Check if host IP changed or probe again
      const autoIp = this.getAutoDetectedLanIp();
      if (autoIp && autoIp !== this.serverIp) {
        const isAutoAlive = await this.probeHealth(autoIp);
        if (isAutoAlive) {
          this.serverIp = autoIp;
          await this.saveLastWorkingIp(autoIp);
        }
      }

      this.connectWebSocket();
    }, delay);
  }

  startHealthCheck() {
    if (this.healthCheckTimer) clearInterval(this.healthCheckTimer);

    this.healthCheckTimer = setInterval(async () => {
      // If WebSocket is already open and transmitting, keep it active without interrupting
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        return;
      }

      if (this.status === CONNECTION_STATUS.CONNECTED && (!this.ws || this.ws.readyState !== WebSocket.OPEN)) {
        this.reconnect();
      }
    }, 8000);
  }

  sendFrame(base64Data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ frame: base64Data }));
      return true;
    }
    return false;
  }

  reconnect() {
    this.reconnectAttempts = 0;
    this.cleanup();
    this.connectWebSocket();
  }

  updateStatus(newStatus) {
    this.status = newStatus;
    if (this.onStatusChange) {
      this.onStatusChange(newStatus, this.serverIp);
    }
  }

  cleanupWebSocket() {
    if (this.ws) {
      try {
        this.ws.onopen = null;
        this.ws.onmessage = null;
        this.ws.onerror = null;
        this.ws.onclose = null;
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
  }

  cleanup() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.healthCheckTimer) clearInterval(this.healthCheckTimer);
    this.cleanupWebSocket();
  }
}
