import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageHeader } from '../components/PageHeader';
import { cardBase, colors, spacing, typography } from '../constants/theme';
import type { AppLocale } from '../i18n';
import { useTranslation } from '../i18n/useTranslation';
import { useSettingsStore } from '../store/settingsStore';
import { useHabitStore } from '../store/habitStore';
import { isJokerAvailable } from '../utils/joker';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t, locale, setLocale } = useTranslation();
  const jokerUsedMonth = useHabitStore((s) => s.jokerUsedMonth);
  const jokerAvailable = isJokerAvailable(jokerUsedMonth);
  const proModeEnabled = useSettingsStore((s) => s.proModeEnabled);
  const setProModeEnabled = useSettingsStore((s) => s.setProModeEnabled);

  const pickLocale = (next: AppLocale): void => {
    if (next !== locale) {
      setLocale(next);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.sm,
        paddingBottom: insets.bottom + 100,
        paddingHorizontal: spacing.md,
      }}
      showsVerticalScrollIndicator={false}
    >
      <PageHeader title={t('settings.title')} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Streakly</Text>
        <Text style={styles.cardText}>{t('settings.version')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.language')}</Text>
        <View style={styles.langRow}>
          <Pressable
            onPress={() => pickLocale('fr')}
            style={[styles.langBtn, locale === 'fr' && styles.langBtnActive]}
          >
            <Text style={[styles.langText, locale === 'fr' && styles.langTextActive]}>
              {t('settings.languageFr')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => pickLocale('en')}
            style={[styles.langBtn, locale === 'en' && styles.langBtnActive]}
          >
            <Text style={[styles.langText, locale === 'en' && styles.langTextActive]}>
              {t('settings.languageEn')}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.cardTitle}>{t('settings.proMode')}</Text>
            <Text style={styles.cardHint}>{t('settings.proHint')}</Text>
          </View>
          <Switch
            value={proModeEnabled}
            onValueChange={setProModeEnabled}
            trackColor={{ false: colors.ringTrack, true: colors.accentSoft }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.joker')}</Text>
        <Text style={styles.cardText}>
          {jokerAvailable ? t('settings.jokerAvailable') : t('settings.jokerUsed')}
        </Text>
        <Text style={styles.cardHint}>{t('settings.jokerHint')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.data')}</Text>
        <Text style={styles.cardText}>{t('settings.dataText')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.notifications')}</Text>
        <Text style={styles.cardText}>{t('settings.notificationsText')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.streakInfo')}</Text>
        <Text style={styles.cardText}>{t('settings.streakInfoText')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    ...cardBase,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
  },
  langRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  langBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: cardBase.borderColor,
    alignItems: 'center',
  },
  langBtnActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  langText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  langTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.xs,
    letterSpacing: -0.2,
  },
  cardText: {
    ...typography.body,
    fontWeight: '500',
  },
  cardHint: {
    ...typography.caption,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
});
