import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../constants/theme';

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={styles.value}>{streak}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  fire: {
    fontSize: 26,
  },
  value: {
    color: colors.orange,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
});
