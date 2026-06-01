import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cardBase, colors, spacing } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import type { Habit, WeekDay } from '../types/habit';
import { getWeekDayLabels } from '../utils/date';

interface ManageHabitCardProps {
  habit: Habit;
  weekRate: number;
  hasIdentity?: boolean;
  onToggleDay: (day: WeekDay) => void;
  onDelete: () => void;
}

export function ManageHabitCard({
  habit,
  weekRate,
  hasIdentity = false,
  onToggleDay,
  onDelete,
}: ManageHabitCardProps) {
  const { t, locale } = useTranslation();
  const weekDayLabels = useMemo(() => getWeekDayLabels(), [locale]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{habit.emoji}</Text>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{habit.name}</Text>
            {hasIdentity ? <Text style={styles.trophy}>🏆</Text> : null}
          </View>
          <Text style={styles.rate}>
            {t('manage.weekRate', { rate: weekRate })}
          </Text>
        </View>
        <Pressable onPress={onDelete} hitSlop={12}>
          <Text style={styles.delete}>×</Text>
        </Pressable>
      </View>
      <View style={styles.days}>
        {weekDayLabels.map(({ day, short }) => {
          const weekDay = day as WeekDay;
          const active = habit.daysOfWeek.includes(weekDay);
          return (
            <Pressable key={`${habit.id}-${day}`} onPress={() => onToggleDay(weekDay)}>
              <Text style={[styles.dayText, active && styles.dayActive]}>
                {short}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardBase,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  emoji: {
    fontSize: 28,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  trophy: {
    fontSize: 16,
  },
  rate: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  delete: {
    color: colors.textSecondary,
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 24,
  },
  days: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.4,
  },
  dayActive: {
    color: colors.text,
    opacity: 1,
    fontWeight: '600',
  },
});
