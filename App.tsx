import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { OnboardingFlow } from './src/components/OnboardingFlow';
import { ONBOARDING_STORAGE_KEY } from './src/constants/onboarding';
import { AppNavigator } from './src/navigation/AppNavigator';
import { setupNotificationsOnLaunch } from './src/services/notifications';
import { sendIdentityNotification } from './src/services/identityNotifications';
import { initAppLocale } from './src/store/settingsStore';
import { useHabitStore } from './src/store/habitStore';
import { getNewlyUnlockedIdentities } from './src/utils/habitStreak';

export default function App() {
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const jokerSavedDate = useHabitStore((s) => s.jokerSavedDate);
  const identityNotifiedHabitIds = useHabitStore((s) => s.identityNotifiedHabitIds);
  const markIdentityNotified = useHabitStore((s) => s.markIdentityNotified);

  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [localeReady, setLocaleReady] = useState(false);

  useEffect(() => {
    void initAppLocale().then(() => setLocaleReady(true));
  }, []);

  useEffect(() => {
    void AsyncStorage.getItem(ONBOARDING_STORAGE_KEY).then((value) => {
      setOnboardingDone(value === 'true');
    });
  }, []);

  useEffect(() => {
    if (onboardingDone !== true || !localeReady) {
      return;
    }
    void setupNotificationsOnLaunch(habits, completions, jokerSavedDate);

    for (const habit of habits) {
      if (
        getNewlyUnlockedIdentities(habit, completions, identityNotifiedHabitIds)
      ) {
        void sendIdentityNotification(habit).then(() =>
          markIdentityNotified(habit.id),
        );
      }
    }
  }, [
    habits,
    completions,
    jokerSavedDate,
    onboardingDone,
    identityNotifiedHabitIds,
    markIdentityNotified,
    localeReady,
  ]);

  if (onboardingDone === null || !localeReady) {
    return null;
  }

  if (!onboardingDone) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <OnboardingFlow onComplete={() => setOnboardingDone(true)} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
