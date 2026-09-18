/**
 * ARExtinguisher3DLayer.tsx
 * High-Performance Three.js WebGL 3D AR Extinguisher Layer.
 * TypeScript port of ML Model/mobile_virtual_fire/src/components/ARExtinguisher3DLayer.js
 *
 * Features:
 * - Direct Hold-to-Spray & Release-to-Stop interaction (touch & hold on 3D model)
 * - True 3D GLB model rendering via WebView + Three.js r128
 * - Realistic animations: forward aim tilt, trigger compression, high-frequency recoil
 * - High-speed cryogenic nozzle fog stream emission during hold
 * - Procedural placeholder extinguisher shown while GLB loads
 * - Communicates spray state to React Native via postMessage
 */

import React, { useRef, useEffect, memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
// @ts-ignore - JS asset with no type declarations
import { FIRE_EXTINGUISHER_GLB_BASE64 } from '../../assets/models/fireExtinguisherGlbBase64';

interface ARExtinguisher3DLayerProps {
  isExtinguishing?: boolean;
  onToggleExtinguisher?: (isExtinguishing: boolean) => void;
}

const buildExtinguisher3DHtml = (isExtinguishing: boolean, glbBase64: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: transparent !important;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    }
    #c3d {
      width: 100%;
      height: 100%;
      display: block;
      background: transparent !important;
    }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
</head>
<body>
  <canvas id="c3d"></canvas>

  <script>
    const GLB_DATA = "${glbBase64}";
    let isDischarging = ${isExtinguishing ? 'true' : 'false'};

    // 1. Setup Scene, Perspective Camera, and WebGL Renderer
    const canvas = document.getElementById('c3d');
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0.08, 2.75);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // 2. Realistic Studio Illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
    keyLight.position.set(2.5, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.7);
    rimLight.position.set(-2.5, 2, -2);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffedd5, 1.2, 10);
    fillLight.position.set(0, -1.5, 2.5);
    scene.add(fillLight);

    // 3. Extinguisher Root Object Group
    const extinguisherGroup = new THREE.Group();
    scene.add(extinguisherGroup);

    let loadedModel = null;
    let placeholderMesh = null;

    // Procedural 3D extinguisher placeholder while GLB loads
    function buildPlaceholder() {
      const g = new THREE.Group();

      const bodyGeo = new THREE.CylinderGeometry(0.32, 0.32, 1.1, 24);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xDC2626,
        metalness: 0.3,
        roughness: 0.35
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      g.add(body);

      const domeGeo = new THREE.SphereGeometry(0.32, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const dome = new THREE.Mesh(domeGeo, bodyMat);
      dome.position.y = 0.55;
      g.add(dome);

      const valveGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 12);
      const blackMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.6, roughness: 0.4 });
      const valve = new THREE.Mesh(valveGeo, blackMat);
      valve.position.y = 0.72;
      g.add(valve);

      const nozzleGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.3, 12);
      const nozzle = new THREE.Mesh(nozzleGeo, blackMat);
      nozzle.rotation.z = Math.PI / 3;
      nozzle.position.set(-0.25, 0.6, 0.1);
      g.add(nozzle);

      const gaugeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
      const gaugeMat = new THREE.MeshStandardMaterial({ color: 0x10B981, metalness: 0.8, roughness: 0.2 });
      const gauge = new THREE.Mesh(gaugeGeo, gaugeMat);
      gauge.rotation.x = Math.PI / 2;
      gauge.position.set(0.12, 0.68, 0.12);
      g.add(gauge);

      return g;
    }

    placeholderMesh = buildPlaceholder();
    extinguisherGroup.add(placeholderMesh);

    function base64ToArrayBuffer(base64) {
      try {
        const clean = base64.replace(/^data:[^;]+;base64,/, '');
        const binaryString = window.atob(clean);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      } catch (e) {
        return null;
      }
    }

    // 4. Load & Normalize the 3D GLB Model (fire_exting.glb as Base64)
    function loadGLBModel() {
      if (typeof THREE.GLTFLoader === 'undefined') {
        setTimeout(loadGLBModel, 100);
        return;
      }

      const buffer = base64ToArrayBuffer(GLB_DATA);
      if (!buffer) return;

      const loader = new THREE.GLTFLoader();
      loader.parse(
        buffer,
        '',
        function (gltf) {
          if (placeholderMesh) {
            extinguisherGroup.remove(placeholderMesh);
            placeholderMesh = null;
          }

          loadedModel = gltf.scene;

          const box = new THREE.Box3().setFromObject(loadedModel);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1.0;

          const normalizedScale = 2.15 / maxDim;
          loadedModel.scale.set(normalizedScale, normalizedScale, normalizedScale);

          loadedModel.position.x = -center.x * normalizedScale;
          loadedModel.position.y = -center.y * normalizedScale;
          loadedModel.position.z = -center.z * normalizedScale;

          loadedModel.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.metalness = 0.35;
              child.material.roughness = 0.35;
              if (child.material.map) {
                child.material.map.anisotropy = 4;
              }
            }
          });

          extinguisherGroup.add(loadedModel);
        },
        function (err) {
          console.log('GLB parse notice:', err);
        }
      );
    }

    loadGLBModel();

    // 5. 3D Cryogenic Nozzle Fog Particle Stream
    const PARTICLE_COUNT = 110;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    const pVels = [];
    const pLife = new Float32Array(PARTICLE_COUNT);

    function createParticleTexture() {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 48;
      pCanvas.height = 48;
      const ctx = pCanvas.getContext('2d');
      const grad = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.30, 'rgba(224, 242, 254, 0.90)');
      grad.addColorStop(0.70, 'rgba(56, 189, 248, 0.45)');
      grad.addColorStop(1.0, 'rgba(56, 189, 248, 0.0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 48, 48);
      const tex = new THREE.CanvasTexture(pCanvas);
      tex.needsUpdate = true;
      return tex;
    }

    const pMat = new THREE.PointsMaterial({
      size: 0.28,
      map: createParticleTexture(),
      transparent: true,
      opacity: 0.90,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPos[i * 3 + 0] = 0;
      pPos[i * 3 + 1] = -50;
      pPos[i * 3 + 2] = 0;
      pVels.push(new THREE.Vector3(0, 0, 0));
      pLife[i] = 1.0;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const particleSystem = new THREE.Points(pGeo, pMat);
    scene.add(particleSystem);

    function spawnParticle(idx) {
      pPos[idx * 3 + 0] = -0.48 + (Math.random() - 0.5) * 0.08;
      pPos[idx * 3 + 1] = 0.58 + (Math.random() - 0.5) * 0.08;
      pPos[idx * 3 + 2] = 0.22 + (Math.random() - 0.5) * 0.08;

      const vx = -2.2 - Math.random() * 1.0;
      const vy = 0.8 + (Math.random() - 0.5) * 0.8;
      const vz = 0.5 + (Math.random() - 0.5) * 0.6;

      pVels[idx].set(vx, vy, vz);
      pLife[idx] = 0.0;
    }

    // 6. Direct Hold-To-Spray & Release-To-Stop Touch Controls
    let isPressing = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let rotationY = -0.45;
    let rotationX = 0.06;

    function notifyReactNative(state) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'EXTINGUISHER_HOLD_STATE',
          isExtinguishing: !!state
        }));
      }
    }

    function handleTouchStart(e) {
      const t = e.touches ? e.touches[0] : e;
      isPressing = true;
      startX = t.clientX;
      startY = t.clientY;
      lastX = t.clientX;
      lastY = t.clientY;

      isDischarging = true;
      notifyReactNative(true);
    }

    function handleTouchMove(e) {
      if (!isPressing) return;
      const t = e.touches ? e.touches[0] : e;
      const dx = t.clientX - lastX;
      const dy = t.clientY - lastY;

      rotationY += dx * 0.015;
      rotationX = Math.max(-0.45, Math.min(0.45, rotationX + dy * 0.012));

      lastX = t.clientX;
      lastY = t.clientY;
    }

    function handleTouchEnd(e) {
      if (!isPressing) return;
      isPressing = false;

      isDischarging = false;
      notifyReactNative(false);
    }

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    canvas.addEventListener('mousedown', handleTouchStart);
    window.addEventListener('mousemove', handleTouchMove);
    window.addEventListener('mouseup', handleTouchEnd);
    window.addEventListener('mouseleave', handleTouchEnd);

    // Handle incoming state messages from React Native
    window.addEventListener('message', function (event) {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'SET_DISCHARGE_STATE') {
          isDischarging = !!msg.isExtinguishing;
        }
      } catch (e) {}
    });

    // 7. 60 FPS Render & Operational Action Animation Loop
    let lastTime = performance.now();
    let spawnCounter = 0;

    function animate() {
      requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000.0, 0.05);
      lastTime = now;

      if (isDischarging) {
        const targetAimY = -0.62;
        const targetAimX = 0.16;
        rotationY += (targetAimY - rotationY) * 0.12;
        rotationX += (targetAimX - rotationX) * 0.12;

        const jitter = Math.sin(now * 0.075) * 0.035;
        const recoil = Math.cos(now * 0.065) * 0.025;

        extinguisherGroup.position.x = jitter * 0.5;
        extinguisherGroup.position.y = recoil * 0.4;
        extinguisherGroup.position.z = Math.sin(now * 0.05) * 0.03;

        extinguisherGroup.rotation.y = rotationY + jitter;
        extinguisherGroup.rotation.x = rotationX + recoil;
        extinguisherGroup.rotation.z = Math.sin(now * 0.07) * 0.04;
      } else {
        extinguisherGroup.position.set(0, 0, 0);
        extinguisherGroup.rotation.z = 0;

        if (!isPressing) {
          rotationY += dt * 0.35;
        }

        extinguisherGroup.rotation.y = rotationY;
        extinguisherGroup.rotation.x = rotationX;
      }

      // 3D Nozzle Particle Physics
      if (isDischarging) {
        spawnCounter += dt * 110;
        while (spawnCounter >= 1.0) {
          spawnCounter -= 1.0;
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            if (pLife[i] >= 1.0) {
              spawnParticle(i);
              break;
            }
          }
        }
      }

      const posArray = pGeo.attributes.position.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (pLife[i] < 1.0) {
          pLife[i] += dt / 0.60;
          pVels[i].multiplyScalar(0.96);

          posArray[i * 3 + 0] += pVels[i].x * dt;
          posArray[i * 3 + 1] += pVels[i].y * dt;
          posArray[i * 3 + 2] += pVels[i].z * dt;

          if (pLife[i] >= 1.0) {
            posArray[i * 3 + 1] = -50;
          }
        }
      }
      pGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', function () {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  </script>
</body>
</html>
`;

const ARExtinguisher3DLayer: React.FC<ARExtinguisher3DLayerProps> = ({
  isExtinguishing = false,
  onToggleExtinguisher,
}) => {
  const webviewRef = useRef<any>(null);

  // Sync external extinguishing state into the WebGL scene
  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.postMessage(
        JSON.stringify({
          type: 'SET_DISCHARGE_STATE',
          isExtinguishing: isExtinguishing,
        })
      );
    }
  }, [isExtinguishing]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (
        data.type === 'EXTINGUISHER_HOLD_STATE' ||
        data.type === 'EXTINGUISHER_TOGGLE'
      ) {
        if (onToggleExtinguisher) {
          onToggleExtinguisher(data.isExtinguishing);
        }
      }
    } catch (e) {}
  };

  return (
    <View style={styles.extinguisherWrapper} pointerEvents="box-none">
      {/* Floating Cyberpunk Instruction Indicator */}
      <View
        style={[styles.floatingPrompt, isExtinguishing && styles.floatingPromptActive]}
        pointerEvents="none"
      >
        <View style={[styles.pulseDot, isExtinguishing && styles.pulseDotActive]} />
        <Text style={styles.promptIcon}>??</Text>
        <Text style={styles.promptText}>
          {isExtinguishing ? 'DISCHARGING CO2' : 'HOLD MODEL TO SPRAY'}
        </Text>
      </View>

      {/* Real 3D GLB Model Viewport (Right-Bottom AR Anchor) */}
      <View style={styles.canvasContainer}>
        <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          source={{ html: buildExtinguisher3DHtml(isExtinguishing, FIRE_EXTINGUISHER_GLB_BASE64) }}
          style={styles.webview}
          containerStyle={styles.webviewContainer}
          scrollEnabled={false}
          bounces={false}
          scalesPageToFit={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          androidLayerType="hardware"
          onMessage={handleMessage}
        />
      </View>
    </View>
  );
};

export default memo(ARExtinguisher3DLayer);

const styles = StyleSheet.create({
  extinguisherWrapper: {
    position: 'absolute',
    right: 8,
    bottom: 78,
    width: 180,
    height: 260,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    zIndex: 99,
  },
  floatingPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.90)',
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.8)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 6,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingPromptActive: {
    borderColor: 'rgba(239, 68, 68, 0.95)',
    backgroundColor: 'rgba(30, 10, 10, 0.92)',
    shadowColor: '#EF4444',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  pulseDotActive: {
    backgroundColor: '#EF4444',
  },
  promptIcon: {
    fontSize: 12,
  },
  promptText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  canvasContainer: {
    width: 180,
    height: 220,
    backgroundColor: 'transparent',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
