// Business domain types

export type HabitCategory =
  | 'Sport'
  | 'Nutrition'
  | 'Développement'
  | 'Études'
  | 'Méditation'
  | 'Créativité'
  | 'Bien-être'
  | 'Productivité';

export type DayOfWeek = 'L' | 'M' | 'M' | 'J' | 'V' | 'S' | 'D';

export interface Habit {
  id: string;
  emoji: string;
  name: string;
  category: HabitCategory;
  scheduledTime: string; // "HH:mm" format
  activeDays: boolean[]; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  notificationsEnabled: boolean;
  createdAt: number; // timestamp
  completions: {
    [dateISO: string]: {
      timestamp: number;
      manualTime?: string; // "HH:mm" if manually entered
    };
  };
}

export interface CompletionRecord {
  timestamp: number;
  manualTime?: string;
}

export interface HabitStats {
  completionRate: number; // 0-100
  currentStreak: number;
  totalCompleted: number;
  bestWeekRate: number;
}

export interface DailyStats {
  completedCount: number;
  totalCount: number;
  completionRate: number;
  habits: Array<{
    id: string;
    completed: boolean;
  }>;
}

export interface HabitStoreState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (habitId: string, date: string, manualTime?: string) => void;
  uncompleteHabit: (habitId: string, date: string) => void;
  reorderHabits: (habitIds: string[]) => void;
  getHabitsForDate: (date: string) => Habit[];
  loadHabits: (habits: Habit[]) => void;
}
