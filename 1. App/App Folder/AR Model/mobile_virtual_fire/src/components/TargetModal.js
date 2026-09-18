import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { THEME } from '../styles/theme';

export default function TargetModal({
  visible,
  onClose,
  selectedTargets,
  onToggleTarget,
  onSelectIndustrialPreset,
  onSelectAll,
  onClearAll,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Target Object Classes</Text>
              <Text style={styles.modalSubtitle}>
                Select physical objects to detect and burn in live camera feed
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Presets */}
          <View style={styles.presetRow}>
            <TouchableOpacity
              style={[styles.presetBtn, styles.presetBtnHighlight]}
              onPress={onSelectIndustrialPreset}
            >
              <Text style={styles.presetBtnTextHighlight}>🏭 Bench & Lathe & Pole</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.presetBtn} onPress={onSelectAll}>
              <Text style={styles.presetBtnText}>Select All</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.presetBtn} onPress={onClearAll}>
              <Text style={styles.presetBtnText}>Clear All</Text>
            </TouchableOpacity>
          </View>

          {/* Target List */}
          <ScrollView style={styles.targetsList} showsVerticalScrollIndicator={false}>
            {THEME.targetCategories.map((item) => {
              const isSelected = selectedTargets.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.targetItem,
                    isSelected && styles.targetItemSelected,
                  ]}
                  onPress={() => onToggleTarget(item.id)}
                >
                  <View style={styles.targetInfo}>
                    <Text style={[styles.targetName, isSelected && styles.targetNameSelected]}>
                      {item.name}
                    </Text>
                    <Text style={styles.targetSlug}>class: {item.id}</Text>
                  </View>

                  <View
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Done Button */}
          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Apply Active Targets</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0F141C',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: THEME.colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    color: THEME.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubtitle: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  closeBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  presetBtnHighlight: {
    backgroundColor: 'rgba(255, 87, 34, 0.18)',
    borderColor: THEME.colors.primary,
    flex: 1.6,
  },
  presetBtnText: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  presetBtnTextHighlight: {
    color: THEME.colors.primaryGlow,
    fontSize: 11,
    fontWeight: '700',
  },
  targetsList: {
    marginBottom: 16,
  },
  targetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  targetItemSelected: {
    backgroundColor: 'rgba(255, 87, 34, 0.12)',
    borderColor: 'rgba(255, 87, 34, 0.4)',
  },
  targetInfo: {
    flex: 1,
  },
  targetName: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  targetNameSelected: {
    color: THEME.colors.goldCore,
  },
  targetSlug: {
    color: THEME.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  doneBtn: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
