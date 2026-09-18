import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform
} from 'react-native';
import { ArrowLeft, QrCode, Camera as CameraIcon, RefreshCw } from 'lucide-react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button } from '../components/Button';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useLanguage } from '../localization/i18n';

export default function QrScannerScreen() {
  const { t } = useLanguage();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [certInput, setCertInput] = useState('');
  const [showManual, setShowManual] = useState(false);

  const extractCertificateId = (rawValue: string): string => {
    let clean = rawValue.trim();
    if (clean.includes('/')) {
      const parts = clean.split('/').filter(Boolean);
      clean = parts[parts.length - 1] || clean;
    }
    return clean;
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned || !data) return;
    setScanned(true);
    const certId = extractCertificateId(data);
    router.push(`/verify/${certId}`);
  };

  const handleManualVerify = () => {
    if (!certInput.trim()) return;
    const certId = extractCertificateId(certInput);
    router.push(`/verify/${certId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>{t('verify.fieldVerifier', 'Field QR Verifier')}</Text>
        <TouchableOpacity
          onPress={() => setShowManual(!showManual)}
          style={styles.modeToggle}
          activeOpacity={0.7}
        >
          <Text style={styles.modeToggleText}>{showManual ? t('verify.cameraMode', 'Camera') : t('verify.manualMode', 'Manual')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {!showManual && permission?.granted ? (
          <View style={styles.cameraContainer}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ['qr']
              }}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />

            {/* Target Reticle Overlay */}
            <View style={styles.overlay}>
              <View style={styles.reticleBox}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
              <Text style={styles.hintText}>
                {t('verify.alignQrPrompt', 'Align certificate QR code within the frame to verify')}
              </Text>

              {scanned && (
                <TouchableOpacity
                  style={styles.rescanButton}
                  onPress={() => setScanned(false)}
                >
                  <RefreshCw size={16} color="#FFFFFF" />
                  <Text style={styles.rescanText}>{t('verify.scanAgain', 'Scan Again')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : !showManual && (!permission || !permission.granted) ? (
          <View style={styles.permissionCard}>
            <CameraIcon size={48} color={COLORS.primary} />
            <Text style={styles.permissionTitle}>{t('verify.permissionRequired', 'Camera Permission Required')}</Text>
            <Text style={styles.permissionDesc}>
              {t('verify.cameraAccessDesc', 'Camera access is needed to scan and verify PARIKSHAK safety certificates on-site.')}
            </Text>
            <Button
              title={t('verify.enableCamera', 'Enable Camera Access')}
              onPress={requestPermission}
              size="md"
              style={{ marginTop: 12, width: '100%' }}
            />
            <TouchableOpacity
              onPress={() => setShowManual(true)}
              style={{ marginTop: 14 }}
            >
              <Text style={styles.useManualLink}>{t('verify.orEnterManually', 'Or Enter Certificate ID Manually')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.manualCard}>
            <View style={styles.manualIconCircle}>
              <QrCode size={36} color={COLORS.primary} />
            </View>
            <Text style={styles.manualTitle}>{t('verify.manualVerification', 'Manual Credential Verification')}</Text>
            <Text style={styles.manualSubtitle}>
              {t('verify.enterCertIdDesc', "Enter the unique Certificate ID (e.g. PRS-CERT-2026-...) printed on the worker's badge or certificate.")}
            </Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder={t('verify.certIdPlaceholder', 'e.g. PRS-CERT-2026-8F42K91')}
                placeholderTextColor={COLORS.mutedText}
                value={certInput}
                onChangeText={setCertInput}
                autoCapitalize="characters"
              />
            </View>

            <Button
              title={t('verify.verifyCredential', 'Verify Credential')}
              onPress={handleManualVerify}
              size="lg"
              style={{ marginTop: 16 }}
            />

            {permission?.granted && (
              <TouchableOpacity
                onPress={() => setShowManual(false)}
                style={styles.switchCameraBtn}
              >
                <CameraIcon size={16} color={COLORS.primary} />
                <Text style={styles.switchCameraText}>{t('verify.switchToCamera', 'Switch to Live Camera')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9EFEF'
  },
  topBarTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.darkText
  },
  modeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#E8F8F5'
  },
  modeToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary
  },
  content: {
    flex: 1,
    padding: SPACING.md
  },
  cameraContainer: {
    flex: 1,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: '#000000',
    position: 'relative'
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)'
  },
  reticleBox: {
    width: 240,
    height: 240,
    position: 'relative'
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#00F2FE'
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4
  },
  hintText: {
    marginTop: 24,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 30
  },
  rescanButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12
  },
  rescanText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  permissionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9EFEF',
    ...SHADOWS.sm
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkText,
    marginTop: 16
  },
  permissionDesc: {
    fontSize: 12,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
    maxWidth: 280
  },
  useManualLink: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary
  },
  manualCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#E9EFEF',
    ...SHADOWS.sm
  },
  manualIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E8F8F5',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12
  },
  manualTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkText,
    textAlign: 'center'
  },
  manualSubtitle: {
    fontSize: 12,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 16
  },
  inputWrapper: {
    backgroundColor: '#F5F8F7',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#E9EFEF',
    paddingHorizontal: SPACING.md
  },
  input: {
    height: 48,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkText
  },
  switchCameraBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 18
  },
  switchCameraText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary
  }
});
