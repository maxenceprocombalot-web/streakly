import { useCallback } from 'react';
import { useHabitStore } from '../store/habitStore';
import { storageService } from '../services/storageService';
import { getDateISO } from '../utils/dateUtils';
import { Habit, HabitCategory } from '../store/types';

export const useHabitActions = () => {
  const store = useHabitStore();

  const createHabit = useCallback(
    async (habitData: Omit<Habit, 'id' | 'createdAt' | 'completions'>) => {
      store.addHabit(habitData);
      await storageService.saveHabits(store.habits);
    },
    [store]
  );

  const updateHabit = useCallback(
    async (id: string, updates: Partial<Habit>) => {
      store.updateHabit(id, updates);
      await storageService.saveHabits(store.habits);
    },
    [store]
  );

  const deleteHabit = useCallback(
    async (id: string) => {
      store.deleteHabit(id);
      await storageService.saveHabits(store.habits);
    },
    [store]
  );

  const completeHabit = useCallback(
    async (habitId: string, date?: string, manualTime?: string) => {
      const finalDate = date || getDateISO(new Date());
      store.completeHabit(habitId, finalDate, manualTime);
      await storageService.saveHabits(store.habits);
    },
    [store]
  );

  const uncompleteHabit = useCallback(
    async (habitId: string, date?: string) => {
      const finalDate = date || getDateISO(new Date());
      store.uncompleteHabit(habitId, finalDate);
      await storageService.saveHabits(store.habits);
    },
    [store]
  );

  const toggleHabitDay = useCallback(
    async (habitId: string, dayIndex: number) => {
      const habit = store.habits.find((h) => h.id === habitId);
      if (!habit) return;

      const updatedDays = [...habit.activeDays];
      updatedDays[dayIndex] = !updatedDays[dayIndex];

      store.updateHabit(habitId, { activeDays: updatedDays });
      await storageService.saveHabits(store.habits);
    },
    [store]
  );

  const reorderHabits = useCallback(
    async (habitIds: string[]) => {
      store.reorderHabits(habitIds);
      await storageService.saveHabits(store.habits);
    },
    [store]
  );

  const loadHabitsFromStorage = useCallback(async () => {
    const habits = await storageService.loadHabits();
    store.loadHabits(habits);
  }, [store]);

  return {
    habits: store.habits,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    toggleHabitDay,
    reorderHabits,
    loadHabitsFromStorage,
    getHabitsForDate: store.getHabitsForDate,
  };
};
