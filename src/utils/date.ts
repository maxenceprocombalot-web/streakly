import {
  getDaysLongLabels,
  getDaysShortLabels,
  getMonthLabels,
  t,
} from '../i18n';
import type { Habit, WeekDay } from '../types/habit';

/** Nombre de jours passés navigables depuis aujourd'hui */
export const DAY_HISTORY_RANGE = 30;

/** Nombre de jours futurs navigables depuis aujourd'hui */
export const DAY_FUTURE_RANGE = 7;

/** Tous les jours affichés dans la barre (-30 … +7) */
export function getDayNavigationRange(): Date[] {
  const today = startOfToday();
  const days: Date[] = [];
  for (let i = -DAY_HISTORY_RANGE; i <= DAY_FUTURE_RANGE; i++) {
    days.push(addDays(today, i));
  }
  return days;
}

/** Jours restants avant une date future (0 si passé ou aujourd'hui) */
export function getDaysUntil(date: Date): number {
  const today = startOfToday();
  const diffMs = date.getTime() - today.getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

/** Date du jour à minuit (heure locale) */
export function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(date: Date, delta: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + delta);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function getTodayKey(): string {
  return toDateKey(startOfToday());
}

/** Limite la date sélectionnée à [aujourd'hui - 30 j, aujourd'hui + 7 j] */
export function clampSelectedDateKey(dateKey: string): string {
  const today = startOfToday();
  const minKey = toDateKey(addDays(today, -DAY_HISTORY_RANGE));
  const maxKey = toDateKey(addDays(today, DAY_FUTURE_RANGE));
  if (dateKey > maxKey) {
    return maxKey;
  }
  if (dateKey < minKey) {
    return minKey;
  }
  return dateKey;
}

export function isToday(date: Date): boolean {
  return isSameDay(date, startOfToday());
}

export function isYesterday(date: Date): boolean {
  return isSameDay(date, addDays(startOfToday(), -1));
}

export function isPastDay(date: Date): boolean {
  return toDateKey(date) < getTodayKey();
}

export function isFutureDay(date: Date): boolean {
  return toDateKey(date) > getTodayKey();
}

/** Libellé d'en-tête : Today / Yesterday / Mon 29 */
export function formatDayHeaderLabel(date: Date): string {
  if (isToday(date)) {
    return t('dates.today');
  }
  if (isYesterday(date)) {
    return t('dates.yesterday');
  }
  const daysShort = getDaysShortLabels();
  const dayName = daysShort[date.getDay()] ?? '';
  return `${dayName} ${date.getDate()}`;
}

export function getWeekDay(date: Date): WeekDay {
  return date.getDay() as WeekDay;
}

export function getHabitsForDate(habits: Habit[], date: Date): Habit[] {
  const day = getWeekDay(date);
  return habits.filter((h) => h.daysOfWeek.includes(day));
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function daysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export { getWeekDayLongLabels as getWeekDayFull, getWeekDayShortForManage as getWeekDayLabels } from '../i18n';

/** Ex. "Sunday 31 May" / "Dimanche 31 mai" */
export function formatFullDateLabel(date: Date): string {
  const daysLong = getDaysLongLabels();
  const months = getMonthLabels();
  const day = daysLong[date.getDay()] ?? '';
  const month = months[date.getMonth()] ?? '';
  return `${day} ${date.getDate()} ${month}`;
}

export function formatTime(isoOrHHmm: string): string {
  if (isoOrHHmm.includes('T')) {
    const d = new Date(isoOrHHmm);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  return isoOrHHmm;
}

export function formatDisplayTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
