import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { HabitCategory } from '../store/types';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const CATEGORY_MESSAGES: { [key in HabitCategory]: string } = {
  Sport: 'Ton futur toi te remercie. Allez 💪',
  Nutrition: 'Ce que tu manges aujourd\'hui construit ton corps de demain 🥗',
  Développement: 'Chaque page lue est un pas vers la meilleure version de toi 📚',
  Études: 'Un effort régulier vaut mieux qu\'un marathon de dernière minute ✏️',
  Méditation: 'Prends 10 minutes pour toi. Tu peux bien ça 🧘',
  Créativité: 'Crée quelque chose d\'extraordinaire aujourd\'hui 🎨',
  'Bien-être': 'Prends soin de toi, tu le mérites 💆',
  Productivité: 'C\'est l\'heure d\'avancer. Relève le défi 🚀',
};

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  },

  async getDeviceToken(): Promise<string | null> {
    try {
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.projectId,
        })
      ).data;
      return token;
    } catch (error) {
      console.error('Failed to get device token:', error);
      return null;
    }
  },

  getMessageForCategory(category: HabitCategory): string {
    return CATEGORY_MESSAGES[category] || 'C\'est l\'heure de performer 🔥';
  },

  getWarningMessage(): string {
    return '🔥 Ton streak est en danger. Il te reste encore du temps. Lance-toi.';
  },

  async scheduleHabitNotification(
    habitName: string,
    habitId: string,
    category: HabitCategory,
    scheduledTime: string, // "HH:mm"
    daysToSchedule: boolean[]
  ): Promise<void> {
    try {
      // Schedule for next occurrence
      const [hours, minutes] = scheduledTime.split(':').map(Number);

      // Schedule for today
      const today = new Date();
      today.setHours(hours, minutes, 0, 0);

      if (today > new Date()) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: habitName,
            body: this.getMessageForCategory(category),
            sound: 'default',
            badge: 1,
          },
          trigger: today,
        });

        // Schedule warning for 2 hours later
        const warningTime = new Date(today);
        warningTime.setHours(warningTime.getHours() + 2);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `⚠️ ${habitName}`,
            body: this.getWarningMessage(),
            sound: 'default',
          },
          trigger: warningTime,
        });
      }

      // Schedule for next 30 days (for recurring setup)
      for (let i = 1; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

        const dayOfWeek = date.getDay();
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        if (daysToSchedule[adjustedDay]) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: habitName,
              body: this.getMessageForCategory(category),
              sound: 'default',
              badge: 1,
            },
            trigger: {
              hour: hours,
              minute: minutes,
              repeats: true,
            },
          });
        }
      }
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  },

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
    }
  },

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  },
};
