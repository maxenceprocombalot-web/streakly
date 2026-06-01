import { useCallback } from 'react';

import { useSettingsStore } from '../store/settingsStore';
import { i18n, setI18nLocale, t as translate, type AppLocale } from './index';

export function useTranslation() {
  const locale = useSettingsStore((s) => s.locale);
  const setLocale = useSettingsStore((s) => s.setLocale);

  const t = useCallback(
    (scope: string, options?: Record<string, string | number>) => {
      if (i18n.locale !== locale) {
        setI18nLocale(locale);
      }
      return translate(scope, options);
    },
    [locale],
  );

  const changeLocale = useCallback(
    (next: AppLocale) => {
      setLocale(next);
    },
    [setLocale],
  );

  return { t, locale, setLocale: changeLocale };
}
