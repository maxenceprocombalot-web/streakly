import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../constants/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  bottom: number;
}

export function FloatingActionButton({ onPress, bottom }: FloatingActionButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        { bottom },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={['#8b7dff', colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.icon}>+</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.md,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  gradient: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '300',
    marginTop: -2,
  },
});
