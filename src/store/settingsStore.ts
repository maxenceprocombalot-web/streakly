import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  getDeviceLocale,
  LOCALE_STORAGE_KEY,
  setI18nLocale,
  type AppLocale,
} from '../i18n';

interface SettingsState {
  proModeEnabled: boolean;
  locale: AppLocale;
  setProModeEnabled: (enabled: boolean) => void;
  setLocale: (locale: AppLocale) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      proModeEnabled: false,
      locale: getDeviceLocale(),
      setProModeEnabled: (enabled: boolean) => set({ proModeEnabled: enabled }),
      setLocale: (locale: AppLocale) => {
        setI18nLocale(locale);
        void AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
        set({ locale });
      },
    }),
    {
      name: 'streakly-settings-v1',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.locale) {
          setI18nLocale(state.locale);
        }
      },
    },
  ),
);

/** Initialise la locale (stockée ou appareil) au démarrage */
export async function initAppLocale(): Promise<AppLocale> {
  const saved = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
  const locale: AppLocale =
    saved === 'fr' || saved === 'en' ? saved : getDeviceLocale();
  setI18nLocale(locale);
  useSettingsStore.setState({ locale });
  return locale;
}
