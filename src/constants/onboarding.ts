import type { HabitDraft } from '../types/habit';

export type OnboardingProfile =
  | 'sportif'
  | 'discipline'
  | 'forme'
  | 'productif';

export interface OnboardingProfileOption {
  id: OnboardingProfile;
  label: string;
  emoji: string;
}

export const ONBOARDING_PROFILES: OnboardingProfileOption[] = [
  { id: 'sportif', label: 'Plus sportif', emoji: '💪' },
  { id: 'discipline', label: 'Plus discipliné', emoji: '📚' },
  { id: 'forme', label: 'Plus en forme', emoji: '🥗' },
  { id: 'productif', label: 'Plus productif', emoji: '⚡' },
];

export interface SuggestedHabit {
  key: string;
  draft: Omit<HabitDraft, 'notificationsEnabled'>;
}

export const ONBOARDING_SUGGESTIONS: Record<
  OnboardingProfile,
  SuggestedHabit[]
> = {
  sportif: [
    {
      key: 'sport-1',
      draft: {
        emoji: '🏃',
        name: 'Course ou marche',
        category: 'sport',
        color: '#22c97a',
        reminderTime: '07:00',
        daysOfWeek: [1, 3, 5],
      },
    },
    {
      key: 'sport-2',
      draft: {
        emoji: '💪',
        name: 'Entraînement',
        category: 'sport',
        color: '#e8445a',
        reminderTime: '18:00',
        daysOfWeek: [2, 4, 6],
      },
    },
    {
      key: 'sport-3',
      draft: {
        emoji: '💧',
        name: '2L d\'eau',
        category: 'sante',
        color: '#06b6d4',
        reminderTime: '09:00',
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      },
    },
  ],
  discipline: [
    {
      key: 'disc-1',
      draft: {
        emoji: '📚',
        name: 'Lecture 20 min',
        category: 'esprit',
        color: '#7c6dfa',
        reminderTime: '21:00',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
    },
    {
      key: 'disc-2',
      draft: {
        emoji: '✍️',
        name: 'Journal du soir',
        category: 'esprit',
        color: '#ec4899',
        reminderTime: '22:00',
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      },
    },
    {
      key: 'disc-3',
      draft: {
        emoji: '🧘',
        name: 'Méditation',
        category: 'esprit',
        color: '#3b82f6',
        reminderTime: '07:30',
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      },
    },
  ],
  forme: [
    {
      key: 'forme-1',
      draft: {
        emoji: '🥗',
        name: 'Repas équilibré',
        category: 'sante',
        color: '#22c97a',
        reminderTime: '12:30',
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      },
    },
    {
      key: 'forme-2',
      draft: {
        emoji: '😴',
        name: 'Coucher avant 23h',
        category: 'sante',
        color: '#7c6dfa',
        reminderTime: '22:30',
        daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
      },
    },
    {
      key: 'forme-3',
      draft: {
        emoji: '🚶',
        name: 'Marche 30 min',
        category: 'sport',
        color: '#f07830',
        reminderTime: '17:00',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
    },
  ],
  productif: [
    {
      key: 'prod-1',
      draft: {
        emoji: '🎯',
        name: 'Tâche prioritaire',
        category: 'productivite',
        color: '#f59e0b',
        reminderTime: '09:00',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
    },
    {
      key: 'prod-2',
      draft: {
        emoji: '📵',
        name: '1h sans téléphone',
        category: 'productivite',
        color: '#e8445a',
        reminderTime: '10:00',
        daysOfWeek: [1, 2, 3, 4, 5],
      },
    },
    {
      key: 'prod-3',
      draft: {
        emoji: '🧹',
        name: 'Ranger le bureau',
        category: 'productivite',
        color: '#06b6d4',
        reminderTime: '18:30',
        daysOfWeek: [5],
      },
    },
  ],
};

export const ONBOARDING_STORAGE_KEY = '@streakly/onboarding-complete';
