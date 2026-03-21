import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { useHabitActions } from './src/hooks/useHabitActions';
import { notificationService } from './src/services/notificationService';
import { COLORS } from './src/design/colors';

// Keep the splash screen visible until we're done initializing
SplashScreen.preventAutoHideAsync();

const App = () => {
  const { loadHabitsFromStorage } = useHabitActions();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load habits from storage
        await loadHabitsFromStorage();

        // Request notification permissions
        const hasPermission = await notificationService.requestPermissions();
        if (hasPermission) {
          const token = await notificationService.getDeviceToken();
          console.log('Device token:', token);
        }

        // Setup notification listener
        const subscription = Notifications.addNotificationResponseReceivedListener(
          (response) => {
            console.log('Notification clicked:', response);
            // Handle notification press
          }
        );

        return () => subscription.remove();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor={COLORS.background.primary} />
          <BottomTabNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
