import type { Completion } from '../types/habit';
import { addDays, startOfToday, toDateKey } from './date';

/** Jour compté pour le streak (complétion ou joker) */
export function isStreakDayActive(
  completions: Completion[],
  date: Date,
  jokerSavedDate: string | null,
): boolean {
  const key = toDateKey(date);
  if (jokerSavedDate === key) {
    return true;
  }
  return completions.some((c) => c.date === key);
}

/** Au moins une complétion ce jour-là (ou joker) */
export function hasAnyCompletionOnDate(
  completions: Completion[],
  date: Date,
  jokerSavedDate: string | null = null,
): boolean {
  return isStreakDayActive(completions, date, jokerSavedDate);
}

/**
 * Série : jours consécutifs avec au moins 1 habitude complétée (ou joker).
 */
export function getCurrentStreak(
  completions: Completion[],
  jokerSavedDate: string | null = null,
): number {
  if (completions.length === 0 && !jokerSavedDate) {
    return 0;
  }

  let cursor = startOfToday();

  if (!isStreakDayActive(completions, cursor, jokerSavedDate)) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;
  for (let guard = 0; guard < 3660; guard++) {
    if (!isStreakDayActive(completions, cursor, jokerSavedDate)) {
      break;
    }
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

/** Série consécutive se terminant à endDate (inclus). */
export function getStreakUpToDate(
  completions: Completion[],
  endDate: Date,
  jokerSavedDate: string | null = null,
): number {
  let cursor = new Date(endDate);
  cursor.setHours(0, 0, 0, 0);

  let streak = 0;
  for (let guard = 0; guard < 3660; guard++) {
    if (!isStreakDayActive(completions, cursor, jokerSavedDate)) {
      break;
    }
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function getBestStreak(
  completions: Completion[],
  jokerSavedDate: string | null = null,
): number {
  const dates = new Set(completions.map((c) => c.date));
  if (jokerSavedDate) {
    dates.add(jokerSavedDate);
  }
  const sorted = Array.from(dates).sort();
  if (sorted.length === 0) {
    return 0;
  }

  let best = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = parseDateKeyLocal(sorted[i - 1]);
    const curr = parseDateKeyLocal(sorted[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      current += 1;
      best = Math.max(best, current);
    } else if (diff > 1) {
      current = 1;
    }
  }

  return best;
}

function parseDateKeyLocal(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}
