import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { t } from '../i18n';
import type { Habit } from '../types/habit';
import { getIdentityNotificationBody } from '../utils/habitStreak';
import { requestNotificationPermissions } from './notifications';

/** Notification push quand une habitude atteint 21 jours consécutifs */
export async function sendIdentityNotification(habit: Habit): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  const granted = await requestNotificationPermissions();
  if (!granted) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: t('notifications.identityTitle'),
      body: getIdentityNotificationBody(habit),
      data: { habitId: habit.id, type: 'identity' },
    },
    trigger: null,
  });
}
