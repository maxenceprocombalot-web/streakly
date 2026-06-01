import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

import { colors, primaryButtonText, radius, spacing } from '../constants/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

/** Seul élément avec dégradé visible dans l'app */
export function PrimaryButton({ label, onPress, style, disabled }: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.wrap,
        style,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <LinearGradient
        colors={['#8b7dff', colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={primaryButtonText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.button,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.4,
  },
});
