import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../design/colors';
import { TEXT_STYLES } from '../../design/text';
import { SPACING, RADIUS } from '../../design/spacing';

interface StreakBadgeProps {
  days: number;
  size?: 'sm' | 'md' | 'lg';
}

const StreakBadge = ({ days, size = 'md' }: StreakBadgeProps) => {
  const sizeStyle = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  }[size];

  const textStyle = {
    sm: { ...TEXT_STYLES.labelSm },
    md: { ...TEXT_STYLES.labelMd },
    lg: { ...TEXT_STYLES.h3 },
  }[size];

  return (
    <View style={[styles.container, sizeStyle]}>
      <Text style={styles.flame}>🔥</Text>
      <Text style={[styles.text, textStyle]}>
        {days}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.accent.orange,
    borderRadius: RADIUS.sm,
  },
  sizeSm: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  sizeMd: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  sizeLg: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  flame: {
    fontSize: 16,
  },
  text: {
    color: COLORS.text.primary,
    fontWeight: '700',
  },
});

export default StreakBadge;
