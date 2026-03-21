import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../../design/colors';
import { TEXT_STYLES, FONTS } from '../../design/text';
import { SPACING, RADIUS } from '../../design/spacing';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const Button = ({
  onPress,
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) => {
  const buttonStyle =
    variant === 'primary'
      ? styles.primary
      : variant === 'secondary'
        ? styles.secondary
        : styles.destructive;

  const sizeStyle =
    size === 'sm'
      ? styles.sizeSm
      : size === 'lg'
        ? styles.sizeLg
        : styles.sizeMd;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        buttonStyle,
        sizeStyle,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.text.primary} size={20} />
      ) : (
        <Text style={[styles.label, styles.labelSize[size]]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primary: {
    backgroundColor: COLORS.accent.violet,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  secondary: {
    borderWidth: 1.5,
    borderColor: COLORS.accent.violet,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  destructive: {
    backgroundColor: COLORS.accent.red,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  sizeSm: {
    paddingVertical: SPACING.sm,
    minHeight: 36,
  },
  sizeMd: {
    paddingVertical: SPACING.md,
    minHeight: 44,
  },
  sizeLg: {
    paddingVertical: SPACING.lg,
    minHeight: 52,
  },
  label: {
    color: COLORS.text.primary,
    fontWeight: '600',
    fontFamily: FONTS.title,
  },
  labelSize: {
    sm: TEXT_STYLES.labelMd,
    md: TEXT_STYLES.labelLg,
    lg: { fontSize: 16, fontWeight: '600' },
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
