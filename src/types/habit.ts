/** Jour de la semaine (0 = dimanche, aligné sur Date.getDay()) */
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type HabitCategory =
  | 'sport'
  | 'sante'
  | 'productivite'
  | 'esprit'
  | 'autre';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  category: HabitCategory;
  /** Couleur hex de l'habitude */
  color: string;
  daysOfWeek: WeekDay[];
  /** Heure de rappel au format HH:mm */
  reminderTime: string;
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface Completion {
  habitId: string;
  date: string;
  /** Horodatage ISO de la complétion */
  completedAt: string;
}

export interface HabitDraft {
  emoji: string;
  name: string;
  category: HabitCategory;
  color: string;
  reminderTime: string;
  daysOfWeek: WeekDay[];
  notificationsEnabled: boolean;
}
