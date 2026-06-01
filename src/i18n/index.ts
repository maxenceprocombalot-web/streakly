import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import { en } from './en';
import { fr } from './fr';
import { MOTIVATIONAL_QUOTES_EN } from './quotes/en';
import { MOTIVATIONAL_QUOTES_FR } from './quotes/fr';

export type AppLocale = 'fr' | 'en';

export const LOCALE_STORAGE_KEY = '@streakly/locale';

export const i18n = new I18n({ fr, en });
i18n.enableFallback = true;
i18n.defaultLocale = 'en';
i18n.locale = getDeviceLocale();

/** Langue du téléphone : fr → fr, sinon en */
export function getDeviceLocale(): AppLocale {
  const code = getLocales()[0]?.languageCode ?? 'en';
  return code === 'fr' ? 'fr' : 'en';
}

export function setI18nLocale(locale: AppLocale): void {
  i18n.locale = locale;
}

export function t(scope: string, options?: Record<string, string | number>): string {
  return i18n.t(scope, options);
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getQuoteIndexForDate(date: Date): number {
  const quotes =
    (i18n.locale as AppLocale) === 'fr' ? MOTIVATIONAL_QUOTES_FR : MOTIVATIONAL_QUOTES_EN;
  return getDayOfYear(date) % quotes.length;
}

export function getQuoteForDate(date: Date, locale: AppLocale = i18n.locale as AppLocale): string {
  const quotes = locale === 'fr' ? MOTIVATIONAL_QUOTES_FR : MOTIVATIONAL_QUOTES_EN;
  const index = getDayOfYear(date) % quotes.length;
  return quotes[index];
}

export function getCoachDemoResponse(): string {
  return `${t('coachDemo.p1')}\n\n${t('coachDemo.p2')}\n\n${t('coachDemo.p3')}`;
}

export function getDaysShortLabels(): string[] {
  const locale = i18n.locale as AppLocale;
  return locale === 'fr' ? [...fr.dates.daysShort] : [...en.dates.daysShort];
}

export function getDaysLongLabels(): string[] {
  const locale = i18n.locale as AppLocale;
  return locale === 'fr' ? [...fr.dates.daysLong] : [...en.dates.daysLong];
}

export function getMonthLabels(): string[] {
  const locale = i18n.locale as AppLocale;
  return locale === 'fr' ? [...fr.dates.months] : [...en.dates.months];
}

export function getWeekDayShortLabels(): string[] {
  const locale = i18n.locale as AppLocale;
  return locale === 'fr' ? [...fr.weekDays.short] : [...en.weekDays.short];
}

export function getWeekDayLongLabels(): { day: number; label: string }[] {
  const locale = i18n.locale as AppLocale;
  const long = locale === 'fr' ? fr.weekDays.long : en.weekDays.long;
  return [
    { day: 1, label: long[0] },
    { day: 2, label: long[1] },
    { day: 3, label: long[2] },
    { day: 4, label: long[3] },
    { day: 5, label: long[4] },
    { day: 6, label: long[5] },
    { day: 0, label: long[6] },
  ];
}

export function getCreateSteps(): string[] {
  const locale = i18n.locale as AppLocale;
  return locale === 'fr' ? [...fr.create.steps] : [...en.create.steps];
}

export function getWeekDayShortForManage(): { day: number; short: string }[] {
  const locale = i18n.locale as AppLocale;
  const short = locale === 'fr' ? fr.weekDays.short : en.weekDays.short;
  return [
    { day: 1, short: short[0] },
    { day: 2, short: short[1] },
    { day: 3, short: short[2] },
    { day: 4, short: short[3] },
    { day: 5, short: short[4] },
    { day: 6, short: short[5] },
    { day: 0, short: short[6] },
  ];
}
