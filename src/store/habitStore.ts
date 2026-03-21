import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitStoreState, HabitCategory } from './types';

export const useHabitStore = create<HabitStoreState>((set) => ({
  habits: [],

  addHabit: (habitData) => {
    const newHabit: Habit = {
      ...habitData,
      id: uuidv4(),
      createdAt: Date.now(),
      completions: {},
    };
    set((state) => ({
      habits: [...state.habits, newHabit],
    }));
  },

  updateHabit: (id, updates) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id ? { ...habit, ...updates } : habit
      ),
    }));
  },

  deleteHabit: (id) => {
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== id),
    }));
  },

  completeHabit: (habitId, date, manualTime) => {
    set((state) => ({
      habits: state.habits.map((habit) => {
        if (habit.id === habitId) {
          return {
            ...habit,
            completions: {
              ...habit.completions,
              [date]: {
                timestamp: Date.now(),
                manualTime,
              },
            },
          };
        }
        return habit;
      }),
    }));
  },

  uncompleteHabit: (habitId, date) => {
    set((state) => ({
      habits: state.habits.map((habit) => {
        if (habit.id === habitId) {
          const newCompletions = { ...habit.completions };
          delete newCompletions[date];
          return {
            ...habit,
            completions: newCompletions,
          };
        }
        return habit;
      }),
    }));
  },

  reorderHabits: (habitIds) => {
    set((state) => {
      const habitMap = Object.fromEntries(
        state.habits.map((h) => [h.id, h])
      );
      return {
        habits: habitIds.map((id) => habitMap[id]).filter(Boolean),
      };
    });
  },

  getHabitsForDate: (date) => {
    return useHabitStore.getState().habits.filter((habit) => {
      const dayOfWeek = new Date(date).getDay();
      // Convert JS day (0=Sun) to our format (0=Mon)
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      return habit.activeDays[adjustedDay];
    });
  },

  loadHabits: (habits) => {
    set({ habits });
  },
}));
