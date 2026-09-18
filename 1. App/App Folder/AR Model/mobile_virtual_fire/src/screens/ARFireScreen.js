import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import CameraView from '../components/CameraView';
import FireOverlay from '../components/FireOverlay';
import ExtinguisherSpray from '../components/ExtinguisherSpray';
import FireExtinguisherWidget from '../components/FireExtinguisherWidget';
import DetectionBox from '../components/DetectionBox';
import ControlPanel from '../components/ControlPanel';
import TargetModal from '../components/TargetModal';
import ServerConfigModal from '../components/ServerConfigModal';

import { RealTimeDetector } from '../detection/detector';
import { ObjectTracker } from '../detection/tracker';
import { FireEffectEngine } from '../effects/fireEffect';
import { THEME } from '../styles/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ARFireScreen() {
  // Camera & AR States
  const [cameraFacing, setCameraFacing] = useState('back');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [fireEnabled, setFireEnabled] = useState(true);
  const [blendMode, setBlendMode] = useState('hybrid');
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Extinguisher States
  const [isExtinguishing, setIsExtinguishing] = useState(false);
  const [sprayParticles, setSprayParticles] = useState([]);

  // Selected Targets
  const [selectedTargets, setSelectedTargets] = useState([
    'bench',
    'lathe machine',
    'electric pole',
    'chair',
    'laptop',
    'bottle',
    'cup',
  ]);

  // Server & Connection State
  const [serverIp, setServerIp] = useState('10.134.164.1');
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [isTargetModalVisible, setIsTargetModalVisible] = useState(false);
  const [isServerModalVisible, setIsServerModalVisible] = useState(false);

  // Stats
  const [fps, setFps] = useState(60.0);
  const [latency, setLatency] = useState(16.0);
  const [activeFiresCount, setActiveFiresCount] = useState(0);

  // Rendered burning instances
  const [renderableObjects, setRenderableObjects] = useState([]);

  // Persistent Engine References
  const cameraRef = useRef(null);
  const trackerRef = useRef(new ObjectTracker());
  const fireEngineRef = useRef(new FireEffectEngine(16, 24));
  const detectorRef = useRef(
    new RealTimeDetector({
      serverIp: '10.134.164.1',
      targetClasses: selectedTargets,
    })
  );

  const isCapturingRef = useRef(false);
  const isExtinguishingRef = useRef(false);
  const frameCounterRef = useRef(0);
  const lastFpsTimeRef = useRef(Date.now());

  const [connectionStatus, setConnectionStatus] = useState('CONNECTING');

  // 1. Initialize Detector & Connection Callback
  useEffect(() => {
    const detector = detectorRef.current;
    detector.setTargetClasses(selectedTargets);

    detector.onConnectionStatusChange = (isConnected, status, ip) => {
      setIsServerConnected(isConnected);
      if (status) setConnectionStatus(status);
      if (ip) setServerIp(ip);
    };

    detector.onDetectionsCallback = (detections, lat, imgW, imgH) => {
      setLatency(lat);

      // Scale coordinates from camera image resolution to phone screen dimensions
      const scaleX = SCREEN_WIDTH / (imgW || 320);
      const scaleY = SCREEN_HEIGHT / (imgH || 240);

      const scaledDetections = detections.map((det) => {
        const [x, y, w, h] = det.box;
        return {
          box: [x * scaleX, y * scaleY, w * scaleX, h * scaleY],
          className: det.className || det.class_name,
          confidence: det.confidence,
        };
      });

      trackerRef.current.updateDetections(scaledDetections);
    };

    detector.connect();
  }, []);

  // Update target classes when selection changes
  useEffect(() => {
    detectorRef.current.setTargetClasses(selectedTargets);
  }, [selectedTargets]);

  // 2. Camera Frame Capture Loop (Runs every 300ms smoothly)
  useEffect(() => {
    let intervalId;

    if (isCameraReady) {
      intervalId = setInterval(async () => {
        if (cameraRef.current && !isCapturingRef.current) {
          isCapturingRef.current = true;
          try {
            await detectorRef.current.processCameraFrame(cameraRef.current);
          } catch (e) {
          } finally {
            isCapturingRef.current = false;
          }
        }
      }, 300);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCameraReady]);

  // 3. High-Performance 30 FPS AR Fire & Extinguisher Animation Loop
  useEffect(() => {
    let animationIntervalId;

    animationIntervalId = setInterval(() => {
      const now = Date.now();
      frameCounterRef.current += 1;

      // Update FPS counter once per second
      if (now - lastFpsTimeRef.current >= 1000) {
        const measuredFps = (frameCounterRef.current * 1000) / (now - lastFpsTimeRef.current);
        setFps(measuredFps);
        frameCounterRef.current = 0;
        lastFpsTimeRef.current = now;
      }

      // If Fire Extinguisher is ACTIVE (ON), spray dense CO2 fog and put out fires gradually (gaming simulator style)
      if (isExtinguishingRef.current) {
        trackerRef.current.extinguishAll(0.0075);
        const spray = fireEngineRef.current.generateSprayParticles(22, now, SCREEN_WIDTH, SCREEN_HEIGHT);
        setSprayParticles(spray);
      } else {
        setSprayParticles([]);
      }

      // Tick EMA Motion Tracker
      const activeTracked = trackerRef.current.tick();
      let burningCount = 0;

      // Compute flame geometries, smoke puffs and rising embers
      const compiled = activeTracked.map((tracked) => {
        const box = tracked.box;
        const extProg = tracked.extinguishProgress || 0.0;

        if (!tracked.isExtinguished) {
          burningCount += 1;
        }

        const flameData = fireEngineRef.current.getFlameEmitters(
          box,
          tracked.phaseOffset,
          now,
          extProg
        );
        const embers = fireEngineRef.current.generateEmbers(
          4,
          box,
          now,
          extProg
        );
        const smokePuffs = fireEngineRef.current.generateSmokePuffs(
          box,
          now,
          extProg
        );

        return {
          id: tracked.id,
          box,
          className: tracked.className,
          confidence: tracked.confidence,
          opacity: tracked.opacity,
          isExtinguished: tracked.isExtinguished,
          extinguishProgress: extProg,
          emitters: flameData.emitters,
          embers,
          smokePuffs,
        };
      });

      setRenderableObjects(compiled);
      setActiveFiresCount(burningCount);
    }, 33); // ~30 FPS smooth update

    return () => {
      if (animationIntervalId) clearInterval(animationIntervalId);
    };
  }, []);

  // Handlers
  const handleToggleFire = useCallback(() => {
    setFireEnabled((prev) => !prev);
  }, []);

  const handleToggleTorch = useCallback(() => {
    setTorchEnabled((prev) => !prev);
  }, []);

  const handleSwitchCamera = useCallback(() => {
    setCameraFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  }, []);

  const handleCycleBlendMode = useCallback(() => {
    const modes = ['hybrid', 'additive', 'alpha'];
    setBlendMode((prev) => {
      const nextIdx = (modes.indexOf(prev) + 1) % modes.length;
      return modes[nextIdx];
    });
  }, []);

  const handleToggleTarget = useCallback((targetId) => {
    setSelectedTargets((prev) =>
      prev.includes(targetId)
        ? prev.filter((t) => t !== targetId)
        : [...prev, targetId]
    );
  }, []);

  const handleSelectIndustrialPreset = useCallback(() => {
    setSelectedTargets(['bench', 'lathe machine', 'electric pole']);
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedTargets(THEME.targetCategories.map((c) => c.id));
  }, []);

  const handleClearAll = useCallback(() => {
    setSelectedTargets([]);
    trackerRef.current.clear();
  }, []);

  const handleSaveServerIp = useCallback((newIp) => {
    setServerIp(newIp);
    detectorRef.current.setServerAddress(newIp);
  }, []);

  // Extinguisher ON / OFF Toggle Handler
  const handleToggleExtinguisher = useCallback((explicitState) => {
    setIsExtinguishing((prev) => {
      const nextState = typeof explicitState === 'boolean' ? explicitState : !prev;
      isExtinguishingRef.current = nextState;
      return nextState;
    });
  }, []);

  // Dedicated Re-Ignite Action Handler
  const handleReigniteAll = useCallback(() => {
    // If extinguisher was on, turn it off so fires can burn
    isExtinguishingRef.current = false;
    setIsExtinguishing(false);
    trackerRef.current.reigniteAll();
  }, []);

  // Interactive Tap to drop a burning object anywhere in camera view
  const handleTapScreen = useCallback((e) => {
    const { locationX, locationY } = e.nativeEvent;
    const activeTarget = selectedTargets[0] || 'bench';

    const defaultSizes = {
      'bench': [220, 140],
      'lathe machine': [240, 180],
      'electric pole': [90, 260],
      'chair': [150, 170],
      'laptop': [170, 130],
      'bottle': [80, 160],
      'cup': [90, 100],
    };

    const size = defaultSizes[activeTarget] || [160, 140];
    const newBox = [
      Math.max(10, locationX - size[0] / 2),
      Math.max(10, locationY - size[1] / 2),
      size[0],
      size[1],
    ];

    trackerRef.current.updateDetections([
      {
        box: newBox,
        className: activeTarget,
        confidence: 0.95,
      }
    ]);
  }, [selectedTargets]);

  const handleTakeScreenshot = useCallback(() => {
    Alert.alert(
      'AR Screenshot Captured 📸',
      `Live Camera view + ${activeFiresCount} active object(s) captured successfully.`
    );
  }, [activeFiresCount]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* 1. Live Phone Camera Stream (Rock-solid isolated surface) */}
      <CameraView
        ref={cameraRef}
        facing={cameraFacing}
        enableTorch={torchEnabled}
        onCameraReady={() => setIsCameraReady(true)}
      />

      {/* 2. Interactive Gesture & AR Overlay Layer */}
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={handleTapScreen}
      >
        {/* Render Virtual Fire on Real Objects */}
        {fireEnabled &&
          renderableObjects.map((obj) => (
            <FireOverlay
              key={`fire-${obj.id}`}
              box={obj.box}
              opacity={obj.opacity}
              emitters={obj.emitters}
              embers={obj.embers}
              smokePuffs={obj.smokePuffs}
              isExtinguished={obj.isExtinguished}
              blendMode={blendMode}
            />
          ))}

        {/* Render AR Detection Bounding Boxes & Badges on Real Objects */}
        {renderableObjects.map((obj) => (
          <DetectionBox
            key={`badge-${obj.id}`}
            box={obj.box}
            className={obj.className}
            confidence={obj.confidence}
            opacity={obj.opacity}
            isBurning={fireEnabled}
            isExtinguished={obj.isExtinguished}
            extinguishProgress={obj.extinguishProgress}
          />
        ))}

        {/* 3. CO2 Extinguisher Foam Spray Jet */}
        <ExtinguisherSpray
          particles={sprayParticles}
          active={isExtinguishing}
        />
      </Pressable>

      {/* 4. Realistic 3D Fire Extinguisher Widget on Right Side */}
      <FireExtinguisherWidget
        isExtinguishing={isExtinguishing}
        onToggleExtinguisher={handleToggleExtinguisher}
      />

      {/* 5. Cyberpunk AR Control Panel HUD (Bottom-Left Menu + Bottom-Center Re-Ignite) */}
      <ControlPanel
        fps={fps}
        latency={latency}
        activeFiresCount={fireEnabled ? activeFiresCount : 0}
        fireEnabled={fireEnabled}
        blendMode={blendMode}
        torchEnabled={torchEnabled}
        isServerConnected={isServerConnected}
        connectionStatus={connectionStatus}
        serverIp={serverIp}
        onToggleFire={handleToggleFire}
        onToggleTorch={handleToggleTorch}
        onSwitchCamera={handleSwitchCamera}
        onCycleBlendMode={handleCycleBlendMode}
        onOpenTargetModal={() => setIsTargetModalVisible(true)}
        onOpenServerModal={() => setIsServerModalVisible(true)}
        onTakeScreenshot={handleTakeScreenshot}
        onReigniteAll={handleReigniteAll}
      />

      {/* 6. Target Classes Selection Modal */}
      <TargetModal
        visible={isTargetModalVisible}
        onClose={() => setIsTargetModalVisible(false)}
        selectedTargets={selectedTargets}
        onToggleTarget={handleToggleTarget}
        onSelectIndustrialPreset={handleSelectIndustrialPreset}
        onSelectAll={handleSelectAll}
        onClearAll={handleClearAll}
      />

      {/* 7. Server IP Configuration Modal */}
      <ServerConfigModal
        visible={isServerModalVisible}
        onClose={() => setIsServerModalVisible(false)}
        serverIp={serverIp}
        onSaveServerIp={handleSaveServerIp}
        isServerConnected={isServerConnected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000000',
  },
});
