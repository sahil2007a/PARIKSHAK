import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import { COLORS, RADIUS } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle
}) => {
  const getContainerStyle = () => {
    const base: ViewStyle[] = [styles.container];

    if (size === 'sm') base.push(styles.sizeSm);
    else if (size === 'lg') base.push(styles.sizeLg);
    else base.push(styles.sizeMd);

    if (variant === 'primary') base.push(styles.variantPrimary);
    else if (variant === 'secondary') base.push(styles.variantSecondary);
    else if (variant === 'outline') base.push(styles.variantOutline);
    else if (variant === 'danger') base.push(styles.variantDanger);
    else if (variant === 'ghost') base.push(styles.variantGhost);

    if (disabled || loading) base.push(styles.disabled);
    if (style) base.push(style);

    return base;
  };

  const getTextStyle = () => {
    const base: TextStyle[] = [styles.text];

    if (size === 'sm') base.push(styles.textSm);
    else if (size === 'lg') base.push(styles.textLg);
    else base.push(styles.textMd);

    if (variant === 'primary' || variant === 'danger') base.push(styles.textWhite);
    else if (variant === 'secondary') base.push(styles.textPrimaryDark);
    else if (variant === 'outline' || variant === 'ghost') base.push(styles.textPrimary);

    if (textStyle) base.push(textStyle);

    return base;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={getContainerStyle()}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : COLORS.primary}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  sizeMd: {
    paddingVertical: 14,
    paddingHorizontal: 20
  },
  sizeLg: {
    paddingVertical: 18,
    paddingHorizontal: 28
  },
  variantPrimary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3
  },
  variantSecondary: {
    backgroundColor: COLORS.primaryLight
  },
  variantOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary
  },
  variantDanger: {
    backgroundColor: COLORS.danger
  },
  variantGhost: {
    backgroundColor: 'transparent'
  },
  disabled: {
    opacity: 0.6
  },
  text: {
    fontWeight: '700',
    textAlign: 'center'
  },
  textSm: {
    fontSize: 12
  },
  textMd: {
    fontSize: 15
  },
  textLg: {
    fontSize: 16
  },
  textWhite: {
    color: '#FFFFFF'
  },
  textPrimary: {
    color: COLORS.primary
  },
  textPrimaryDark: {
    color: COLORS.primaryDark
  }
});
