import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { THEME } from '../styles/theme';

export default function ServerConfigModal({
  visible,
  onClose,
  serverIp,
  onSaveServerIp,
  isServerConnected,
}) {
  const [ipInput, setIpInput] = useState(serverIp);

  const handleSave = () => {
    if (ipInput.trim()) {
      onSaveServerIp(ipInput.trim());
      onClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalIcon}>🌐</Text>
          <Text style={styles.modalTitle}>YOLO Backend Server IP</Text>
          <Text style={styles.modalSubtitle}>
            Enter your computer's local Wi-Fi IP address (e.g. 192.168.1.5) where the Python YOLO server is running.
          </Text>

          {/* Status Indicator */}
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: isServerConnected ? THEME.colors.success : THEME.colors.warning }]} />
            <Text style={styles.statusText}>
              Status: {isServerConnected ? 'CONNECTED (Streaming Live)' : 'DISCONNECTED / STANDBY'}
            </Text>
          </View>

          {/* IP Input */}
          <TextInput
            style={styles.input}
            value={ipInput}
            onChangeText={setIpInput}
            placeholder="e.g. 192.168.1.100"
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="default"
          />

          <View style={styles.hintBox}>
            <Text style={styles.hintTitle}>💡 How to find your PC IP:</Text>
            <Text style={styles.hintText}>
              Run <Text style={styles.codeText}>run_mobile_server.bat</Text> on your PC. It will automatically show your exact Wi-Fi IP on screen!
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Connect YOLO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#0F141C',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
    ...THEME.shadows.cardShadow,
  },
  modalIcon: {
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 16,
    textAlign: 'center',
  },
  hintBox: {
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    marginBottom: 20,
  },
  hintTitle: {
    color: THEME.colors.cyanAccent,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  hintText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  codeText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 1.5,
    backgroundColor: THEME.colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
