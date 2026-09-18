import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from 'react-native';
import { Eye, EyeOff, Crosshair, Cpu, Layers } from 'lucide-react-native';
import { YOLODetectedObject } from '@parishak/shared';
import { cvObjectDetector, CVInferenceMetrics } from '../../services/cvObjectDetector';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface YOLODetectionOverlayProps {
  isSurfaceLocked: boolean;
  currentStepIndex: number;
  scenarioType: 'FIRE_AND_EXPLOSION' | 'GAS_LEAK_CONFINED_SPACE';
}

export const YOLODetectionOverlay: React.FC<YOLODetectionOverlayProps> = ({
  isSurfaceLocked,
  currentStepIndex,
  scenarioType
}) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [detections, setDetections] = useState<YOLODetectedObject[]>([]);
  const [metrics, setMetrics] = useState<CVInferenceMetrics>({
    inferenceTimeMs: 16,
    fps: 30,
    detectionsCount: 0,
    engine: 'YOLOv8-Nano-Industrial'
  });

  useEffect(() => {
    cvObjectDetector.setScenario(scenarioType);
    cvObjectDetector.setEnabled(isEnabled);
  }, [scenarioType, isEnabled]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isEnabled) {
        const currentDetections = cvObjectDetector.getDetections(isSurfaceLocked, currentStepIndex);
        setDetections(currentDetections);
        setMetrics(cvObjectDetector.getMetrics());
      } else {
        setDetections([]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isEnabled, isSurfaceLocked, currentStepIndex]);

  const toggleEnabled = () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);
    cvObjectDetector.setEnabled(nextState);
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* 1. Top HUD Status Toggle Pill */}
      <View style={styles.topHudContainer} pointerEvents="box-none">
        <TouchableOpacity
          style={[styles.hudBadge, isEnabled ? styles.hudBadgeActive : styles.hudBadgeInactive]}
          onPress={toggleEnabled}
          activeOpacity={0.8}
        >
          {isEnabled ? (
            <>
              <Cpu size={14} color="#00F2FE" />
              <Text style={styles.hudBadgeTextActive}>
                YOLO-v8 AI: <Text style={styles.hudHighlight}>ACTIVE ({metrics.fps} FPS · {metrics.inferenceTimeMs}ms)</Text>
              </Text>
            </>
          ) : (
            <>
              <EyeOff size={14} color="#A0AEC0" />
              <Text style={styles.hudBadgeTextInactive}>YOLO AI: PAUSED (Tap to enable)</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* 2. Real-Time Bounding Boxes */}
      {isEnabled && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {detections.map((det) => {
            const isInterest = det.isTargetOfInterest;
            const borderColor = isInterest ? '#FFD700' : '#00F2FE';
            const badgeBg = isInterest ? 'rgba(255, 215, 0, 0.2)' : 'rgba(0, 242, 254, 0.2)';

            return (
              <View
                key={det.id}
                style={[
                  styles.boundingBox,
                  {
                    left: `${det.bbox.x}%`,
                    top: `${det.bbox.y}%`,
                    width: `${det.bbox.width}%`,
                    height: `${det.bbox.height}%`,
                    borderColor: borderColor
                  }
                ]}
              >
                {/* 4 Corner Crosshair Accents */}
                <View style={[styles.cornerTL, { borderColor }]} />
                <View style={[styles.cornerTR, { borderColor }]} />
                <View style={[styles.cornerBL, { borderColor }]} />
                <View style={[styles.cornerBR, { borderColor }]} />

                {/* Center Target Reticle */}
                <View style={styles.centerTarget}>
                  <Crosshair size={18} color={borderColor} opacity={0.6} />
                </View>

                {/* Header Tag / Class & Confidence Badge */}
                <View style={[styles.detectionBadge, { backgroundColor: badgeBg, borderColor }]}>
                  <View style={styles.badgeRow}>
                    <View style={[styles.liveDot, { backgroundColor: borderColor }]} />
                    <Text style={[styles.classLabel, { color: borderColor }]}>
                      {det.yoloClass.toUpperCase()}
                    </Text>
                    <Text style={styles.confidenceScore}>{det.confidence}%</Text>
                  </View>
                  <Text style={styles.semanticLabel} numberOfLines={1}>
                    {det.label}
                  </Text>
                </View>

                {/* Bottom Footer: Distance & Associated Plane */}
                <View style={styles.bottomMeta}>
                  <View style={styles.metaPill}>
                    <Layers size={10} color="#E2E8F0" />
                    <Text style={styles.metaPlaneText}>
                      {det.associatedPlane.toUpperCase()} PLANE
                    </Text>
                  </View>
                  <View style={styles.metaPill}>
                    <Text style={styles.metaDistanceText}>{det.distanceMeters}m</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topHudContainer: {
    position: 'absolute',
    top: 54,
    right: 16,
    zIndex: 99
  },
  hudBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4
  },
  hudBadgeActive: {
    backgroundColor: 'rgba(10, 25, 47, 0.88)',
    borderColor: '#00F2FE'
  },
  hudBadgeInactive: {
    backgroundColor: 'rgba(26, 32, 44, 0.85)',
    borderColor: '#4A5568'
  },
  hudBadgeTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E2E8F0',
    letterSpacing: 0.5
  },
  hudHighlight: {
    color: '#00F2FE',
    fontWeight: '800'
  },
  hudBadgeTextInactive: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A0AEC0'
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 242, 254, 0.03)'
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 10,
    height: 10,
    borderTopWidth: 3,
    borderLeftWidth: 3
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderTopWidth: 3,
    borderRightWidth: 3
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 10,
    height: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3
  },
  centerTarget: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -9 }, { translateY: -9 }]
  },
  detectionBadge: {
    position: 'absolute',
    top: -24,
    left: 0,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    maxWidth: 220
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5
  },
  classLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6
  },
  confidenceScore: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 3,
    borderRadius: 2
  },
  semanticLabel: {
    fontSize: 8,
    color: '#CBD5E1',
    fontWeight: '500',
    marginTop: 1
  },
  bottomMeta: {
    position: 'absolute',
    bottom: -18,
    left: 0,
    flexDirection: 'row',
    gap: 6
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    gap: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.15)'
  },
  metaPlaneText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#94A3B8'
  },
  metaDistanceText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#38BDF8'
  }
});
