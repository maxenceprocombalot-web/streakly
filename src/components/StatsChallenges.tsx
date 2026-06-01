import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { cardBase, colors, spacing, typography } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import { useHabitStore } from '../store/habitStore';
import type { Challenge } from '../types/challenge';
import {
  canStartNewChallenge,
  getChallengeProgress,
  MAX_ACTIVE_CHALLENGES,
} from '../utils/challenges';
import { ChallengeCelebrationModal } from './ChallengeCelebrationModal';

export function StatsChallenges() {
  const { t } = useTranslation();
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const challenges = useHabitStore((s) => s.challenges);
  const startChallenge = useHabitStore((s) => s.startChallenge);

  const [celebrationHabitId, setCelebrationHabitId] = useState<string | null>(null);
  const shownCelebrationsRef = useRef<Set<string>>(new Set());

  const activeChallenges = useMemo(
    () => challenges.filter((c) => c.completedAt === null),
    [challenges],
  );

  const completedChallenges = useMemo(
    () => challenges.filter((c) => c.completedAt !== null),
    [challenges],
  );

  const progressList = useMemo(
    () =>
      activeChallenges
        .map((c) => {
          const habit = habits.find((h) => h.id === c.habitId);
          if (!habit) {
            return null;
          }
          return getChallengeProgress(c, habit, completions);
        })
        .filter(Boolean),
    [activeChallenges, habits, completions],
  );

  useEffect(() => {
    for (const c of challenges) {
      if (c.completedAt && !shownCelebrationsRef.current.has(c.id)) {
        const habit = habits.find((h) => h.id === c.habitId);
        if (habit) {
          shownCelebrationsRef.current.add(c.id);
          setCelebrationHabitId(habit.id);
        }
      }
    }
  }, [challenges, habits]);

  const availableHabits = habits.filter(
    (h) => !activeChallenges.some((c) => c.habitId === h.id),
  );

  const handleStart = (habitId: string): void => {
    if (!canStartNewChallenge(challenges)) {
      Alert.alert(
        t('challenges.limitTitle'),
        t('challenges.limitMessage', { max: MAX_ACTIVE_CHALLENGES }),
      );
      return;
    }
    const ok = startChallenge(habitId);
    if (!ok) {
      Alert.alert(t('challenges.errorTitle'), t('challenges.errorStart'));
    }
  };

  const celebrationHabit = habits.find((h) => h.id === celebrationHabitId) ?? null;

  return (
    <View>
      <Text style={styles.sectionTitle}>{t('challenges.active')}</Text>
      {progressList.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{t('challenges.empty')}</Text>
        </View>
      ) : (
        progressList.map((p) =>
          p ? (
            <View key={p.challenge.id} style={styles.challengeCard}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeEmoji}>{p.habit.emoji}</Text>
                <View style={styles.challengeInfo}>
                  <Text style={styles.challengeName}>{p.habit.name}</Text>
                  <Text style={styles.challengeMeta}>
                    {t('challenges.progress', {
                      done: p.completedDays,
                      remaining: p.daysRemaining,
                    })}
                  </Text>
                </View>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${p.progress}%` }]}
                />
              </View>
            </View>
          ) : null,
        )
      )}

      {availableHabits.length > 0 && canStartNewChallenge(challenges) ? (
        <>
          <Text style={[styles.sectionTitle, styles.sectionGap]}>
            {t('challenges.start')}
          </Text>
          {availableHabits.map((h) => (
            <Pressable
              key={h.id}
              style={styles.startRow}
              onPress={() => handleStart(h.id)}
            >
              <Text style={styles.startEmoji}>{h.emoji}</Text>
              <Text style={styles.startName}>{h.name}</Text>
              <Text style={styles.startAction}>+30j</Text>
            </Pressable>
          ))}
        </>
      ) : null}

      {completedChallenges.length > 0 ? (
        <>
          <Text style={[styles.sectionTitle, styles.sectionGap]}>
            {t('challenges.completed')}
          </Text>
          {completedChallenges.map((c: Challenge) => {
            const habit = habits.find((h) => h.id === c.habitId);
            if (!habit) {
              return null;
            }
            return (
              <View key={c.id} style={styles.doneCard}>
                <Text style={styles.doneEmoji}>🏆</Text>
                <Text style={styles.doneName}>
                  {habit.emoji} {habit.name}
                </Text>
              </View>
            );
          })}
        </>
      ) : null}

      <ChallengeCelebrationModal
        visible={celebrationHabitId !== null}
        habit={celebrationHabit}
        onClose={() => setCelebrationHabitId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    ...typography.sectionTitle,
    marginBottom: spacing.md,
  },
  sectionGap: {
    marginTop: spacing.lg,
  },
  emptyCard: {
    ...cardBase,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    lineHeight: 22,
  },
  challengeCard: {
    ...cardBase,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  challengeEmoji: {
    fontSize: 28,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  challengeMeta: {
    ...typography.caption,
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.ringTrack,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  startRow: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  startEmoji: {
    fontSize: 24,
  },
  startName: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  startAction: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  doneCard: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    opacity: 0.7,
  },
  doneEmoji: {
    fontSize: 20,
  },
  doneName: {
    color: colors.text,
    fontSize: 15,
  },
});
