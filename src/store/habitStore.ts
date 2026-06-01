import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_HABIT_COLOR } from '../constants/habitColors';
import { sendIdentityNotification } from '../services/identityNotifications';
import {
  cancelHabitNotifications,
  scheduleHabitNotifications,
} from '../services/notifications';
import type { Challenge } from '../types/challenge';
import type { Completion, Habit, HabitDraft } from '../types/habit';
import { canStartNewChallenge, CHALLENGE_DURATION, countChallengeCompletedDays } from '../utils/challenges';
import { getNewlyUnlockedIdentities } from '../utils/habitStreak';
import { getMonthKey } from '../utils/joker';
import { addDays, clampSelectedDateKey, startOfToday, toDateKey } from '../utils/date';

interface HabitState {
  habits: Habit[];
  completions: Completion[];
  selectedDate: string;
  jokerUsedMonth: string | null;
  jokerSavedDate: string | null;
  challenges: Challenge[];
  /** Habitudes ayant déjà reçu la notif identité 21j */
  identityNotifiedHabitIds: string[];
  addHabit: (draft: HabitDraft) => Promise<void>;
  addHabits: (drafts: HabitDraft[]) => Promise<void>;
  updateHabit: (id: string, patch: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  setSelectedDate: (dateKey: string) => void;
  confirmCompletion: (
    habitId: string,
    date: Date,
    completedAt: Date,
  ) => Promise<void>;
  removeCompletion: (habitId: string, dateKey: string) => void;
  isCompleted: (habitId: string, dateKey: string) => boolean;
  getCompletion: (habitId: string, dateKey: string) => Completion | undefined;
  useJokerForYesterday: () => boolean;
  startChallenge: (habitId: string) => boolean;
  completeChallenge: (challengeId: string) => void;
  markIdentityNotified: (habitId: string) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function draftToHabit(draft: HabitDraft): Habit {
  return {
    id: generateId(),
    name: draft.name.trim(),
    emoji: draft.emoji,
    category: draft.category,
    color: draft.color || DEFAULT_HABIT_COLOR,
    daysOfWeek: draft.daysOfWeek,
    reminderTime: draft.reminderTime,
    notificationsEnabled: draft.notificationsEnabled,
    createdAt: new Date().toISOString(),
  };
}

async function checkIdentityAfterCompletion(
  habit: Habit,
  completions: Completion[],
  notifiedIds: string[],
  markNotified: (id: string) => void,
): Promise<void> {
  if (!getNewlyUnlockedIdentities(habit, completions, notifiedIds)) {
    return;
  }
  await sendIdentityNotification(habit);
  markNotified(habit.id);
}

async function checkChallengeCompletion(
  challenges: Challenge[],
  completions: Completion[],
  completeChallenge: (id: string) => void,
): Promise<void> {
  for (const challenge of challenges) {
    if (challenge.completedAt !== null) {
      continue;
    }
    const done = countChallengeCompletedDays(challenge, completions);
    if (done >= CHALLENGE_DURATION) {
      completeChallenge(challenge.id);
    }
  }
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: [],
      selectedDate: toDateKey(startOfToday()),
      jokerUsedMonth: null,
      jokerSavedDate: null,
      challenges: [],
      identityNotifiedHabitIds: [],

      addHabit: async (draft: HabitDraft) => {
        const habit = draftToHabit(draft);
        set((s) => ({ habits: [...s.habits, habit] }));
        if (habit.notificationsEnabled) {
          await scheduleHabitNotifications(habit);
        }
      },

      addHabits: async (drafts: HabitDraft[]) => {
        const newHabits = drafts.map(draftToHabit);
        set((s) => ({ habits: [...s.habits, ...newHabits] }));
        for (const h of newHabits) {
          if (h.notificationsEnabled) {
            await scheduleHabitNotifications(h);
          }
        }
      },

      updateHabit: async (id: string, patch: Partial<Habit>) => {
        let updated: Habit | undefined;
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id === id) {
              updated = { ...h, ...patch };
              return updated;
            }
            return h;
          }),
        }));
        if (updated) {
          await scheduleHabitNotifications(updated);
        }
      },

      deleteHabit: async (id: string) => {
        await cancelHabitNotifications(id);
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
          completions: s.completions.filter((c) => c.habitId !== id),
          challenges: s.challenges.filter((c) => c.habitId !== id),
        }));
      },

      setSelectedDate: (dateKey: string) => {
        set({ selectedDate: clampSelectedDateKey(dateKey) });
      },

      confirmCompletion: async (habitId: string, date: Date, completedAt: Date) => {
        const dateKey = toDateKey(date);
        const wasDone = get().completions.some(
          (c) => c.habitId === habitId && c.date === dateKey,
        );

        set((s) => ({
          completions: [
            ...s.completions.filter(
              (c) => !(c.habitId === habitId && c.date === dateKey),
            ),
            {
              habitId,
              date: dateKey,
              completedAt: completedAt.toISOString(),
            },
          ],
        }));

        if (wasDone) {
          return;
        }

        const habit = get().habits.find((h) => h.id === habitId);
        if (habit) {
          await checkIdentityAfterCompletion(
            habit,
            get().completions,
            get().identityNotifiedHabitIds,
            get().markIdentityNotified,
          );
        }

        await checkChallengeCompletion(
          get().challenges,
          get().completions,
          get().completeChallenge,
        );
      },

      removeCompletion: (habitId: string, dateKey: string) => {
        set((s) => ({
          completions: s.completions.filter(
            (c) => !(c.habitId === habitId && c.date === dateKey),
          ),
        }));
      },

      isCompleted: (habitId: string, dateKey: string) =>
        get().completions.some(
          (c) => c.habitId === habitId && c.date === dateKey,
        ),

      getCompletion: (habitId: string, dateKey: string) =>
        get().completions.find(
          (c) => c.habitId === habitId && c.date === dateKey,
        ),

      useJokerForYesterday: () => {
        const month = getMonthKey();
        if (get().jokerUsedMonth === month) {
          return false;
        }
        const yesterday = addDays(startOfToday(), -1);
        const yesterdayKey = toDateKey(yesterday);
        set({
          jokerUsedMonth: month,
          jokerSavedDate: yesterdayKey,
        });
        return true;
      },

      startChallenge: (habitId: string) => {
        if (!canStartNewChallenge(get().challenges)) {
          return false;
        }
        const alreadyActive = get().challenges.some(
          (c) => c.habitId === habitId && c.completedAt === null,
        );
        if (alreadyActive) {
          return false;
        }
        const challenge: Challenge = {
          id: generateId(),
          habitId,
          startDate: toDateKey(startOfToday()),
          completedAt: null,
        };
        set((s) => ({ challenges: [...s.challenges, challenge] }));
        return true;
      },

      completeChallenge: (challengeId: string) => {
        set((s) => ({
          challenges: s.challenges.map((c) =>
            c.id === challengeId
              ? { ...c, completedAt: new Date().toISOString() }
              : c,
          ),
        }));
      },

      markIdentityNotified: (habitId: string) => {
        set((s) => ({
          identityNotifiedHabitIds: s.identityNotifiedHabitIds.includes(habitId)
            ? s.identityNotifiedHabitIds
            : [...s.identityNotifiedHabitIds, habitId],
        }));
      },
    }),
    {
      name: 'streakly-storage-v1',
      storage: createJSONStorage(() => AsyncStorage),
      migrate: (persisted) => {
        const state = persisted as HabitState;
        if (state?.habits) {
          state.habits = state.habits.map((h) => ({
            ...h,
            color: h.color ?? DEFAULT_HABIT_COLOR,
          }));
        }
        if (state && state.jokerUsedMonth === undefined) {
          state.jokerUsedMonth = null;
        }
        if (state && state.jokerSavedDate === undefined) {
          state.jokerSavedDate = null;
        }
        if (state && !state.challenges) {
          state.challenges = [];
        }
        if (state && !state.identityNotifiedHabitIds) {
          state.identityNotifiedHabitIds = [];
        }
        return state;
      },
      version: 3,
      partialize: (state) => ({
        habits: state.habits,
        completions: state.completions,
        jokerUsedMonth: state.jokerUsedMonth,
        jokerSavedDate: state.jokerSavedDate,
        challenges: state.challenges,
        identityNotifiedHabitIds: state.identityNotifiedHabitIds,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.selectedDate = toDateKey(startOfToday());
        }
      },
    },
  ),
);
