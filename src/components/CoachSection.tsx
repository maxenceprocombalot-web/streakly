import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cardBase, colors, spacing, typography } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import { analyzeWeekWithCoach } from '../services/openai';
import { useHabitStore } from '../store/habitStore';
import { useSettingsStore } from '../store/settingsStore';
import { LoadingDots } from './LoadingDots';
import { PrimaryButton } from './PrimaryButton';

export function CoachSection() {
  const { t } = useTranslation();
  const proModeEnabled = useSettingsStore((s) => s.proModeEnabled);
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const jokerSavedDate = useHabitStore((s) => s.jokerSavedDate);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (): Promise<void> => {
    if (habits.length === 0) {
      setError(t('coach.needHabit'));
      return;
    }
    setLoading(true);
    setError(null);
    setResponse(null);
    setIsDemo(false);
    try {
      const result = await analyzeWeekWithCoach(habits, completions, jokerSavedDate);
      setResponse(result.content);
      setIsDemo(result.isDemo);
    } catch (e) {
      setError(e instanceof Error ? e.message : t('coach.emptyResponse'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('coach.title')}</Text>
        {!proModeEnabled ? <Text style={styles.lock}>🔒</Text> : null}
      </View>

      {!proModeEnabled ? (
        <View style={styles.lockedCard}>
          <Text style={styles.lockedText}>{t('coach.locked')}</Text>
        </View>
      ) : (
        <>
          {!response && !loading ? (
            <PrimaryButton
              label={t('coach.analyze')}
              onPress={() => void handleAnalyze()}
              style={styles.btn}
            />
          ) : null}

          {loading ? (
            <View style={styles.responseCard}>
              <LoadingDots />
            </View>
          ) : null}

          {error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
              <Pressable onPress={() => void handleAnalyze()}>
                <Text style={styles.retry}>{t('common.retry')}</Text>
              </Pressable>
            </View>
          ) : null}

          {response ? (
            <View style={styles.responseCard}>
              {isDemo ? (
                <View style={styles.demoBadge}>
                  <Text style={styles.demoBadgeText}>{t('coach.demoBadge')}</Text>
                </View>
              ) : null}
              <Text style={styles.responseText}>{response}</Text>
              <Pressable onPress={() => void handleAnalyze()} style={styles.retryBtn}>
                <Text style={styles.retry}>{t('coach.newAnalysis')}</Text>
              </Pressable>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.sectionTitle,
  },
  lock: {
    fontSize: 18,
  },
  lockedCard: {
    ...cardBase,
    padding: spacing.md,
  },
  lockedText: {
    ...typography.body,
    lineHeight: 22,
  },
  btn: {
    width: '100%',
  },
  responseCard: {
    ...cardBase,
    padding: spacing.md,
    backgroundColor: colors.surfaceElevated,
  },
  demoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: spacing.sm,
  },
  demoBadgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  responseText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
  },
  errorCard: {
    ...cardBase,
    padding: spacing.md,
    borderColor: 'rgba(232, 68, 90, 0.3)',
    borderWidth: 1,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  retry: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  retryBtn: {
    marginTop: spacing.md,
  },
});
