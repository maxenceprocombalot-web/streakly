/** Couleurs disponibles par habitude */
export const HABIT_COLOR_OPTIONS = [
  { id: 'violet', hex: '#7c6dfa' },
  { id: 'green', hex: '#22c97a' },
  { id: 'red', hex: '#e8445a' },
  { id: 'orange', hex: '#f07830' },
  { id: 'blue', hex: '#3b82f6' },
  { id: 'pink', hex: '#ec4899' },
  { id: 'yellow', hex: '#f59e0b' },
  { id: 'cyan', hex: '#06b6d4' },
] as const;

export type HabitColorId = (typeof HABIT_COLOR_OPTIONS)[number]['id'];

export const DEFAULT_HABIT_COLOR = '#7c6dfa';

export function resolveHabitColor(color?: string): string {
  if (!color) {
    return DEFAULT_HABIT_COLOR;
  }
  return color;
}
