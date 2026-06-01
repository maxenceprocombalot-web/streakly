import { t } from '../i18n';
import type { Completion, Habit } from '../types/habit';
import { addDays, getHabitsForDate, toDateKey } from './date';

export interface DayProgress {
  dateKey: string;
  total: number;
  done: number;
  ratio: number;
}

export function getWeekProgress(
  habits: Habit[],
  completions: Completion[],
  endDate: Date,
  days = 7,
): DayProgress[] {
  const result: DayProgress[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = addDays(endDate, -i);
    const scheduled = getHabitsForDate(habits, date);
    const key = toDateKey(date);
    const done = scheduled.filter((h) =>
      completions.some((c) => c.habitId === h.id && c.date === key),
    ).length;
    const total = scheduled.length;
    result.push({
      dateKey: key,
      total,
      done,
      ratio: total > 0 ? done / total : 0,
    });
  }

  return result;
}

export function getHabitWeekRate(
  habitId: string,
  habit: Habit,
  completions: Completion[],
  endDate: Date,
): number {
  let total = 0;
  let done = 0;

  for (let i = 6; i >= 0; i--) {
    const date = addDays(endDate, -i);
    if (!habit.daysOfWeek.includes(date.getDay() as typeof habit.daysOfWeek[number])) {
      continue;
    }
    total += 1;
    const key = toDateKey(date);
    if (completions.some((c) => c.habitId === habitId && c.date === key)) {
      done += 1;
    }
  }

  return total > 0 ? Math.round((done / total) * 100) : 0;
}

export function getPerformanceMessage(weekRate: number): string {
  if (weekRate >= 90) {
    return t('stats.performance.elite');
  }
  if (weekRate >= 70) {
    return t('stats.performance.solid');
  }
  if (weekRate >= 40) {
    return t('stats.performance.building');
  }
  if (weekRate > 0) {
    return t('stats.performance.started');
  }
  return t('stats.performance.zero');
}
