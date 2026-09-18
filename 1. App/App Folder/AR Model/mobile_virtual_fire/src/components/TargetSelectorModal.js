import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { THEME } from '../styles/theme';

export default function TargetSelectorModal({
  visible,
  onClose,
  selectedTargets,
  onToggleTarget,
  onSelectIndustrialPreset,
  onSelectAll,
  onClearCustomTargets,
}) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Header Drag Handle */}
              <View style={styles.dragHandle} />

              <View style={styles.headerRow}>
                <Text style={styles.title}>AR Target Objects</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Done</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                Select physical objects to virtually set on fire when detected in the camera feed.
              </Text>

              {/* Preset Buttons */}
              <View style={styles.presetRow}>
                <TouchableOpacity
                  style={styles.presetBtn}
                  onPress={onSelectIndustrialPreset}
                >
                  <Text style={styles.presetBtnText}>Industrial Targets</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.presetBtn}
                  onPress={onSelectAll}
                >
                  <Text style={styles.presetBtnText}>Select All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.presetBtn, styles.presetBtnClear]}
                  onPress={onClearCustomTargets}
                >
                  <Text style={[styles.presetBtnText, { color: THEME.colors.danger }]}>Clear Spawns</Text>
                </TouchableOpacity>
              </View>

              {/* Target List */}
              <ScrollView style={styles.listScroll} showsVerticalScrollIndicator={false}>
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
                        <Text
                          style={[
                            styles.targetName,
                            isSelected && styles.targetNameSelected,
                          ]}
                        >
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

              <View style={styles.tipBox}>
                <Text style={styles.tipText}>
                  💡 <Text style={{ fontWeight: '700' }}>Pro-Tip</Text>: Tap anywhere on the camera screen to drop an AR target directly in front of you!
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#0F141C',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: THEME.colors.cardBorder,
    paddingHorizontal: 20,
    paddingBottom: 34,
    maxHeight: '75%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.colors.textPrimary,
  },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: THEME.colors.primary,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  presetBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  presetBtnClear: {
    borderColor: 'rgba(255, 23, 68, 0.3)',
    backgroundColor: 'rgba(255, 23, 68, 0.08)',
  },
  presetBtnText: {
    color: THEME.colors.textHighlight,
    fontSize: 12,
    fontWeight: '600',
  },
  listScroll: {
    maxHeight: 280,
  },
  targetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  targetItemSelected: {
    backgroundColor: 'rgba(255, 87, 34, 0.12)',
    borderColor: 'rgba(255, 87, 34, 0.45)',
  },
  targetInfo: {
    flex: 1,
  },
  targetName: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  targetNameSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
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
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  tipBox: {
    marginTop: 14,
    padding: 10,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.25)',
  },
  tipText: {
    color: THEME.colors.cyanAccent,
    fontSize: 12,
  },
});
