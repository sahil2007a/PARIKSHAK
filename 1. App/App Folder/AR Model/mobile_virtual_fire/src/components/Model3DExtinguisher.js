import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { FIRE_EXTINGUISHER_GLB_BASE64 } from '../assets/models/fireExtinguisherGlbBase64';
import { THEME } from '../styles/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Generates standalone HTML for 3D GLB model rendering using Three.js & Model-Viewer
 */
const get3DViewerHtml = (isSpraying = false, isInteractive = true) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      background: transparent;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    model-viewer {
      width: 100%;
      height: 100%;
      background: transparent;
      --poster-color: transparent;
      outline: none;
    }
    .spray-jet {
      position: absolute;
      top: 25%;
      right: 20%;
      width: 80px;
      height: 40px;
      background: radial-gradient(ellipse at left, rgba(56,189,248,0.85) 0%, rgba(255,255,255,0.7) 40%, rgba(56,189,248,0) 80%);
      filter: blur(4px);
      transform: rotate(-25deg);
      display: ${isSpraying ? 'block' : 'none'};
      animation: sprayPulse 0.15s infinite alternate;
      pointer-events: none;
    }
    @keyframes sprayPulse {
      0% { opacity: 0.7; transform: rotate(-23deg) scale(0.95); }
      100% { opacity: 1.0; transform: rotate(-27deg) scale(1.15); }
    }
  </style>
</head>
<body>
  <model-viewer
    id="extinguisherModel"
    src="${FIRE_EXTINGUISHER_GLB_BASE64}"
    alt="3D Fire Extinguisher"
    camera-controls
    ${isInteractive ? 'touch-action="pan-y"' : 'disable-zoom disable-pan'}
    ${isSpraying ? 'auto-rotate-delay="0"' : 'auto-rotate'}
    auto-rotate-speed="1.5"
    shadow-intensity="1.5"
    shadow-softness="0.8"
    exposure="1.3"
    camera-orbit="25deg 75deg 105%"
    min-camera-orbit="auto auto 70%"
    max-camera-orbit="auto auto 200%"
    field-of-view="32deg"
    interaction-prompt="none"
  >
  </model-viewer>
  <div class="spray-jet"></div>
  <script>
    const viewer = document.getElementById('extinguisherModel');
    document.body.addEventListener('click', () => {
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MODEL_TAP' }));
    });
  </script>
</body>
</html>
`;

export default function Model3DExtinguisher({
  isExtinguishing = false,
  onToggleExtinguisher,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation when spraying
  useEffect(() => {
    let loopAnim;
    if (isExtinguishing) {
      loopAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.98,
            duration: 250,
            useNativeDriver: true,
          }),
        ])
      );
      loopAnim.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      if (loopAnim) loopAnim.stop();
    };
  }, [isExtinguishing]);

  const handleMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'MODEL_TAP') {
        onToggleExtinguisher();
      }
    } catch (e) {}
  }, [onToggleExtinguisher]);

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Mini 3D Extinguisher Card (Bottom Right AR Surface) */}
      <Animated.View
        style={[
          styles.miniCard,
          isExtinguishing && styles.miniCardSpraying,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        {/* Glow Aura when Spraying */}
        {isExtinguishing && <View style={styles.sprayingAura} />}

        {/* 3D Model Viewport */}
        <View style={styles.webviewContainer}>
          <WebView
            originWhitelist={['*']}
            source={{ html: get3DViewerHtml(isExtinguishing, false) }}
            style={styles.webview}
            containerStyle={styles.webviewInner}
            scrollEnabled={false}
            bounces={false}
            scalesPageToFit={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            transparent={true}
            onMessage={handleMessage}
          />
        </View>

        {/* Action Bar: Toggle ON/OFF Switch & 3D Inspect Button */}
        <View style={styles.controlsRow}>
          {/* Main ON / OFF Toggle Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.toggleBtn,
              isExtinguishing ? styles.toggleBtnActive : styles.toggleBtnInactive,
            ]}
            onPress={onToggleExtinguisher}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isExtinguishing ? '#38BDF8' : '#EF4444' },
              ]}
            />
            <Text style={styles.toggleBtnText}>
              {isExtinguishing ? 'SPRAY ON ❄️' : 'SPRAY OFF 🧯'}
            </Text>
          </TouchableOpacity>

          {/* 3D Expand / Inspect Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.inspectBtn}
            onPress={() => setIsModalOpen(true)}
          >
            <Text style={styles.inspectBtnText}>3D 🔍</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Full 3D Interactive Model Inspector Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>3D Fire Extinguisher</Text>
                <Text style={styles.modalSubtitle}>Interactive Simulator & Inspection</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setIsModalOpen(false)}
              >
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Interactive 3D Canvas */}
            <View style={styles.modal3DCanvas}>
              <WebView
                originWhitelist={['*']}
                source={{ html: get3DViewerHtml(isExtinguishing, true) }}
                style={styles.modalWebview}
                scrollEnabled={false}
                bounces={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                transparent={true}
              />
              <View style={styles.orbitHintBadge}>
                <Text style={styles.orbitHintText}>🔄 Drag to Rotate 360° • Pinch to Zoom</Text>
              </View>
            </View>

            {/* Extinguisher Controls & Gauge in Modal */}
            <View style={styles.modalControlsSection}>
              {/* Pressure Status */}
              <View style={styles.gaugeCard}>
                <View style={styles.gaugeHeader}>
                  <Text style={styles.gaugeLabel}>PRESSURE GAUGE</Text>
                  <Text style={styles.gaugeVal}>OPERATIONAL (1.4 MPa)</Text>
                </View>
                <View style={styles.gaugeTrack}>
                  <View style={styles.gaugeFill} />
                </View>
              </View>

              {/* Big ON / OFF Simulator Switch */}
              <TouchableOpacity
                activeOpacity={0.85}
                style={[
                  styles.bigSimulatorBtn,
                  isExtinguishing ? styles.bigSimulatorBtnActive : styles.bigSimulatorBtnInactive,
                ]}
                onPress={onToggleExtinguisher}
              >
                <Text style={styles.bigSimulatorBtnIcon}>
                  {isExtinguishing ? '❄️' : '🧯'}
                </Text>
                <View>
                  <Text style={styles.bigSimulatorBtnTitle}>
                    {isExtinguishing ? 'SPRAYING ACTIVE (ON)' : 'EXTINGUISHER READY (OFF)'}
                  </Text>
                  <Text style={styles.bigSimulatorBtnSub}>
                    {isExtinguishing ? 'Discharging CO₂ Cold Mist Jet' : 'Tap to trigger discharge'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* PASS Technique Tips */}
              <View style={styles.passGuide}>
                <Text style={styles.passTitle}>🔥 P.A.S.S. Simulator Technique</Text>
                <Text style={styles.passText}>
                  1. <Text style={styles.passBold}>P</Text>ull the safety pin{'\n'}
                  2. <Text style={styles.passBold}>A</Text>im nozzle at base of the fire{'\n'}
                  3. <Text style={styles.passBold}>S</Text>queeze the discharge lever (SPRAY ON){'\n'}
                  4. <Text style={styles.passBold}>S</Text>weep from side to side until fire dies
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    bottom: 80,
    alignItems: 'center',
  },
  miniCard: {
    width: 140,
    height: 165,
    backgroundColor: 'rgba(12, 16, 24, 0.90)',
    borderRadius: 20,
    padding: 6,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.55)',
    ...THEME.shadows.cardShadow,
  },
  miniCardSpraying: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 10,
  },
  sprayingAura: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  webviewContainer: {
    width: 128,
    height: 110,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  webview: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  webviewInner: {
    backgroundColor: 'transparent',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    width: '100%',
    justifyContent: 'center',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(220, 38, 38, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.6)',
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(2, 132, 199, 0.9)',
    borderColor: '#38BDF8',
  },
  toggleBtnInactive: {
    backgroundColor: 'rgba(220, 38, 38, 0.35)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  toggleBtnText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  inspectBtn: {
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  inspectBtnText: {
    color: '#38BDF8',
    fontSize: 9,
    fontWeight: '800',
  },

  // Full 3D Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: SCREEN_HEIGHT * 0.78,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 18,
    borderTopWidth: 2,
    borderTopColor: 'rgba(56, 189, 248, 0.4)',
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  modal3DCanvas: {
    width: '100%',
    height: 240,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 10,
  },
  modalWebview: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  orbitHintBadge: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  orbitHintText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  modalControlsSection: {
    gap: 10,
  },
  gaugeCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  gaugeLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
  },
  gaugeVal: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
  },
  gaugeTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  gaugeFill: {
    width: '85%',
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  bigSimulatorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  bigSimulatorBtnActive: {
    backgroundColor: 'rgba(2, 132, 199, 0.85)',
    borderColor: '#38BDF8',
  },
  bigSimulatorBtnInactive: {
    backgroundColor: 'rgba(220, 38, 38, 0.85)',
    borderColor: '#EF4444',
  },
  bigSimulatorBtnIcon: {
    fontSize: 28,
  },
  bigSimulatorBtnTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  bigSimulatorBtnSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  passGuide: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  passTitle: {
    color: '#FDBA74',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  passText: {
    color: '#CBD5E1',
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '500',
  },
  passBold: {
    color: '#38BDF8',
    fontWeight: '800',
  },
});
