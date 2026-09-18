import React, { useEffect, forwardRef, memo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { THEME } from '../styles/theme';

const CameraView = memo(forwardRef(({
  facing = 'back',
  enableTorch = false,
  onCameraReady,
}, ref) => {
  const [permission, requestPermission] = useCameraPermissions();

  // Automatically request camera permissions on mount if needed
  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>Initializing Phone Camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionIcon}>📷</Text>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            AR Virtual Fire needs live camera access to view your surroundings and render animated fire effects over detected objects in real time.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Allow Camera Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ExpoCameraView
      ref={ref}
      style={StyleSheet.absoluteFill}
      facing={facing}
      enableTorch={enableTorch}
      onCameraReady={onCameraReady}
      mode="picture"
    />
  );
}));

export default CameraView;

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: THEME.colors.textSecondary,
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  permissionContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#080A0F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionCard: {
    backgroundColor: THEME.colors.cardGlass,
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    alignItems: 'center',
    width: '100%',
    maxWidth: 380,
    ...THEME.shadows.cardShadow,
  },
  permissionIcon: {
    fontSize: 48,
    marginBottom: 14,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
