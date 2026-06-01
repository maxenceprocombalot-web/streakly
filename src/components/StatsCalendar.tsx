import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { cardBase, colors, spacing, typography } from '../constants/theme';
import type { Completion, Habit } from '../types/habit';
import {
  daysInMonth,
  getHabitsForDate,
  parseDateKey,
  startOfMonth,
  toDateKey,
} from '../utils/date';

interface StatsCalendarProps {
  habits: Habit[];
  completions: Completion[];
  month: Date;
  onChangeMonth: (date: Date) => void;
}

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export function StatsCalendar({
  habits,
  completions,
  month,
  onChangeMonth,
}: StatsCalendarProps) {
  const [detailDate, setDetailDate] = useState<string | null>(null);

  const cells = useMemo(() => {
    const start = startOfMonth(month);
    const total = daysInMonth(month);
    const firstWeekday = start.getDay();
    const grid: (Date | null)[] = [];

    for (let i = 0; i < firstWeekday; i++) {
      grid.push(null);
    }
    for (let d = 1; d <= total; d++) {
      grid.push(new Date(month.getFullYear(), month.getMonth(), d));
    }
    return grid;
  }, [month]);

  const getIntensity = (date: Date): number => {
    const scheduled = getHabitsForDate(habits, date);
    if (scheduled.length === 0) {
      return 0;
    }
    const key = toDateKey(date);
    const done = scheduled.filter((h) =>
      completions.some((c) => c.habitId === h.id && c.date === key),
    ).length;
    return done / scheduled.length;
  };

  const detailHabits = detailDate
    ? getHabitsForDate(habits, parseDateKey(detailDate))
    : [];

  return (
    <View>
      <View style={styles.calendarCard}>
        <View style={styles.nav}>
          <Pressable onPress={() => onChangeMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
            <Text style={styles.navText}>‹</Text>
          </Pressable>
          <Text style={styles.monthTitle}>
            {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
          </Text>
          <Pressable onPress={() => onChangeMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
            <Text style={styles.navText}>›</Text>
          </Pressable>
        </View>

        <View style={styles.weekHeader}>
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
            <Text key={`wh-${i}`} style={styles.weekDay}>{d}</Text>
          ))}
        </View>

        <View style={styles.grid}>
          {cells.map((date, i) => {
            if (!date) {
              return <View key={`empty-${i}`} style={styles.cell} />;
            }
            const intensity = getIntensity(date);
            const key = toDateKey(date);

            return (
              <Pressable
                key={key}
                style={styles.cell}
                onPress={() => setDetailDate(key)}
              >
                <View
                  style={[
                    styles.dot,
                    intensity > 0 && { opacity: 0.25 + intensity * 0.75 },
                  ]}
                />
                <Text style={styles.cellText}>{date.getDate()}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Modal visible={detailDate !== null} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setDetailDate(null)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>
              {detailDate
                ? parseDateKey(detailDate).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })
                : ''}
            </Text>
            {detailHabits.length === 0 ? (
              <Text style={typography.body}>Aucune habitude ce jour.</Text>
            ) : (
              detailHabits.map((h) => {
                const done = completions.some(
                  (c) => c.habitId === h.id && c.date === detailDate,
                );
                return (
                  <View key={h.id} style={styles.modalRow}>
                    <Text style={styles.modalEmoji}>{h.emoji}</Text>
                    <Text style={styles.modalName}>{h.name}</Text>
                    <Text style={styles.modalStatus}>{done ? '✓' : '—'}</Text>
                  </View>
                );
              })
            )}
            <Pressable onPress={() => setDetailDate(null)}>
              <Text style={styles.modalClose}>Fermer</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarCard: {
    ...cardBase,
    padding: spacing.md,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navText: {
    color: colors.textSecondary,
    fontSize: 22,
    fontWeight: '300',
    paddingHorizontal: spacing.sm,
  },
  monthTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    ...typography.caption,
    fontSize: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.textSecondary,
    opacity: 0,
  },
  cellText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing.md,
  },
  modalSheet: {
    ...cardBase,
    padding: spacing.md,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: spacing.md,
    textTransform: 'capitalize',
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  modalEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  modalName: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  modalStatus: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  modalClose: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.md,
    color: colors.text,
  },
});
