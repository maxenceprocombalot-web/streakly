import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

async function safeHaptic(fn: () => Promise<void>): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  try {
    await fn();
  } catch {
    // Haptics indisponibles sur simulateur
  }
}

/** Tap sur une carte habitude */
export async function hapticLight(): Promise<void> {
  await safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

/** Validation d'une habitude */
export async function hapticSuccess(): Promise<void> {
  await safeHaptic(() =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  );
}

/** Streak qui augmente */
export async function hapticMedium(): Promise<void> {
  await safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}
