import { t } from '../i18n';
import type { Completion, Habit, WeekDay } from '../types/habit';
import { addDays, startOfToday, toDateKey } from './date';

const IDENTITY_THRESHOLD = 21;

/** Jours consécutifs (jours planifiés) complétés pour une habitude */
export function getHabitConsecutiveStreak(
  habit: Habit,
  completions: Completion[],
  endDate: Date = startOfToday(),
): number {
  let cursor = new Date(endDate);
  cursor.setHours(0, 0, 0, 0);
  let streak = 0;

  for (let guard = 0; guard < 3660; guard++) {
    const scheduled = habit.daysOfWeek.includes(cursor.getDay() as WeekDay);
    if (!scheduled) {
      cursor = addDays(cursor, -1);
      continue;
    }

    const key = toDateKey(cursor);
    const done = completions.some(
      (c) => c.habitId === habit.id && c.date === key,
    );
    if (!done) {
      break;
    }
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function hasIdentityUnlocked(
  habit: Habit,
  completions: Completion[],
): boolean {
  return getHabitConsecutiveStreak(habit, completions) >= IDENTITY_THRESHOLD;
}

export function getIdentityMessage(habit: Habit): string {
  return t('stats.identityMessage', { name: habit.name.toLowerCase() });
}

export function getIdentityNotificationBody(habit: Habit): string {
  return t('notifications.identityBody', { name: habit.name.toLowerCase() });
}

export function getHabitsWithIdentity(
  habits: Habit[],
  completions: Completion[],
): Habit[] {
  return habits.filter((h) => hasIdentityUnlocked(h, completions));
}

/** Habitudes dont l'identité vient d'être débloquée (≥ 21 jours) */
export function getNewlyUnlockedIdentities(
  habit: Habit,
  completions: Completion[],
  alreadyNotified: string[],
): boolean {
  if (alreadyNotified.includes(habit.id)) {
    return false;
  }
  return getHabitConsecutiveStreak(habit, completions) >= IDENTITY_THRESHOLD;
}
