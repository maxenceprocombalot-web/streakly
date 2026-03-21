import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../store/types';

const STORAGE_KEY = 'streakly_habits';

export const storageService = {
  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      const json = JSON.stringify(habits);
      await AsyncStorage.setItem(STORAGE_KEY, json);
    } catch (error) {
      console.error('Failed to save habits:', error);
    }
  },

  async loadHabits(): Promise<Habit[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch (error) {
      console.error('Failed to load habits:', error);
      return [];
    }
  },

  async clearHabits(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear habits:', error);
    }
  },
};
