import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { t } from '../i18n';
import type { Completion, Habit } from '../types/habit';
import { getHabitsForDate, startOfToday, toDateKey } from '../utils/date';
import { getCurrentStreak } from '../utils/streak';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const STREAK_DANGER_ID = 'streak-danger-daily';

/** Demande les permissions de notification */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') {
    return true;
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function parseTime(hhmm: string): { hour: number; minute: number } {
  const [h, m] = hhmm.split(':').map(Number);
  return { hour: h, minute: m };
}

/** Planifie les rappels hebdomadaires pour une habitude */
export async function scheduleHabitNotifications(habit: Habit): Promise<void> {
  await cancelHabitNotifications(habit.id);

  if (!habit.notificationsEnabled) {
    return;
  }

  const granted = await requestNotificationPermissions();
  if (!granted) {
    return;
  }

  const { hour, minute } = parseTime(habit.reminderTime);

  for (const day of habit.daysOfWeek) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notifications.habitReminderTitle'),
        body: t('notifications.habitReminderBody', {
          emoji: habit.emoji,
          name: habit.name,
        }),
        data: { habitId: habit.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: day + 1,
        hour,
        minute,
      },
      identifier: `${habit.id}-${day}`,
    });
  }
}

export async function cancelHabitNotifications(habitId: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if (n.identifier.startsWith(habitId)) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
}

export async function rescheduleAll(habits: Habit[]): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  for (const h of habits) {
    if (h.notificationsEnabled) {
      await scheduleHabitNotifications(h);
    }
  }
}

/** Alerte streak en danger à 21h si le jour n'est pas terminé */
export async function scheduleStreakDangerNotification(
  habits: Habit[],
  completions: Completion[],
  jokerSavedDate: string | null,
): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Notifications.cancelScheduledNotificationAsync(STREAK_DANGER_ID);
  } catch {
    // Pas encore planifiée
  }

  const today = startOfToday();
  const scheduled = getHabitsForDate(habits, today);
  if (scheduled.length === 0) {
    return;
  }

  const todayKey = toDateKey(today);
  const allDone = scheduled.every((h) =>
    completions.some((c) => c.habitId === h.id && c.date === todayKey),
  );
  if (allDone) {
    return;
  }

  const triggerDate = new Date(today);
  triggerDate.setHours(21, 0, 0, 0);
  if (new Date() >= triggerDate) {
    return;
  }

  const granted = await requestNotificationPermissions();
  if (!granted) {
    return;
  }

  const streak = getCurrentStreak(completions, jokerSavedDate);

  await Notifications.scheduleNotificationAsync({
    identifier: STREAK_DANGER_ID,
    content: {
      title: t('notifications.streakDangerTitle'),
      body: t('notifications.streakDangerBody', { streak: String(streak) }),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}

export async function setupNotificationsOnLaunch(
  habits: Habit[],
  completions: Completion[],
  jokerSavedDate: string | null,
): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  await requestNotificationPermissions();
  await rescheduleAll(habits);
  await scheduleStreakDangerNotification(habits, completions, jokerSavedDate);
}
