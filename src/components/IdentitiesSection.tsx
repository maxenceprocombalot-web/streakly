import { StyleSheet, Text, View } from 'react-native';

import { cardBase, colors, spacing, typography } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import type { Habit } from '../types/habit';
import { getIdentityMessage } from '../utils/habitStreak';

interface IdentitiesSectionProps {
  habits: Habit[];
}

export function IdentitiesSection({ habits }: IdentitiesSectionProps) {
  const { t } = useTranslation();

  if (habits.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{t('stats.identitiesEmpty')}</Text>
      </View>
    );
  }

  return (
    <View>
      {habits.map((habit) => (
        <View key={habit.id} style={styles.card}>
          <Text style={styles.trophy}>🏆</Text>
          <View style={styles.textBlock}>
            <Text style={styles.habitName}>
              {habit.emoji} {habit.name}
            </Text>
            <Text style={styles.message}>{getIdentityMessage(habit)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    ...cardBase,
    padding: spacing.md,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderWidth: 1,
  },
  trophy: {
    fontSize: 24,
  },
  textBlock: {
    flex: 1,
  },
  habitName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    ...typography.body,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});
