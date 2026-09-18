import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckSquare, Square } from 'lucide-react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

interface SafetyChecklistProps {
  items: string[];
  title?: string;
  onAllCompleted?: () => void;
}

export const SafetyChecklist: React.FC<SafetyChecklistProps> = ({
  items,
  title = 'Pre-Operation Safety Checklist',
  onAllCompleted
}) => {
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);

  const toggleIndex = (idx: number) => {
    let next: number[];
    if (checkedIndices.includes(idx)) {
      next = checkedIndices.filter((i) => i !== idx);
    } else {
      next = [...checkedIndices, idx];
    }
    setCheckedIndices(next);

    if (next.length === items.length && onAllCompleted) {
      onAllCompleted();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.list}>
        {items.map((item, idx) => {
          const isChecked = checkedIndices.includes(idx);
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.itemRow, isChecked && styles.itemRowChecked]}
              onPress={() => toggleIndex(idx)}
              activeOpacity={0.7}
            >
              {isChecked ? (
                <CheckSquare size={18} color={COLORS.primary} />
              ) : (
                <Square size={18} color={COLORS.mutedText} />
              )}
              <Text style={[styles.itemText, isChecked && styles.itemTextChecked]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8E6',
    marginVertical: SPACING.sm
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 10
  },
  list: {
    gap: 8
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    backgroundColor: '#F8FAF9'
  },
  itemRowChecked: {
    backgroundColor: COLORS.primaryLight
  },
  itemText: {
    fontSize: 12,
    color: COLORS.darkText,
    fontWeight: '500',
    flex: 1
  },
  itemTextChecked: {
    color: COLORS.primaryDark,
    fontWeight: '600',
    textDecorationLine: 'line-through'
  }
});
