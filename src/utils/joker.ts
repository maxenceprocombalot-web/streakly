import type { Completion } from '../types/habit';
import { addDays, getHabitsForDate, startOfToday, toDateKey } from './date';
import { getStreakUpToDate, hasAnyCompletionOnDate } from './streak';

/** Clé mois YYYY-MM */
export function getMonthKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function isJokerAvailable(jokerUsedMonth: string | null): boolean {
  return jokerUsedMonth !== getMonthKey();
}

/** Hier sans complétion et joker dispo */
export function canOfferJoker(
  completions: Completion[],
  jokerUsedMonth: string | null,
  jokerSavedDate: string | null,
): boolean {
  if (!isJokerAvailable(jokerUsedMonth)) {
    return false;
  }

  const today = startOfToday();
  const yesterday = addDays(today, -1);
  const yesterdayKey = toDateKey(yesterday);

  if (jokerSavedDate === yesterdayKey) {
    return false;
  }

  if (hasAnyCompletionOnDate(completions, yesterday, jokerSavedDate)) {
    return false;
  }

  const dayBeforeYesterday = addDays(yesterday, -1);
  const streakBefore = getStreakUpToDate(
    completions,
    dayBeforeYesterday,
    jokerSavedDate,
  );
  return streakBefore > 0;
}
