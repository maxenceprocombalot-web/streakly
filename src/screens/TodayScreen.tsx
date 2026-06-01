import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HabitCard } from '../components/HabitCard';
import { JokerBanner } from '../components/JokerBanner';
import { MotivationalQuote } from '../components/MotivationalQuote';
import { PageHeader } from '../components/PageHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressRing } from '../components/ProgressRing';
import { PulsingEmptyRing } from '../components/PulsingEmptyRing';
import { StreakBadge } from '../components/StreakBadge';
import { WeekDayBar } from '../components/WeekDayBar';
import { resolveHabitColor } from '../constants/habitColors';
import { colors, spacing, typography } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import type { RootTabParamList } from '../navigation/AppNavigator';
import { useHabitStore } from '../store/habitStore';
import type { Habit } from '../types/habit';
import {
  addDays,
  formatDayHeaderLabel,
  formatFullDateLabel,
  getHabitsForDate,
  getTodayKey,
  getDaysUntil,
  isFutureDay,
  isPastDay,
  isToday,
  parseDateKey,
  startOfToday,
  toDateKey,
} from '../utils/date';
import { hapticMedium, hapticSuccess } from '../utils/haptics';
import { canOfferJoker } from '../utils/joker';
import { getCurrentStreak, getStreakUpToDate } from '../utils/streak';

export function TodayScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [celebratingId, setCelebratingId] = useState<string | null>(null);
  const [undoHabitId, setUndoHabitId] = useState<string | null>(null);

  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const selectedDateKey = useHabitStore((s) => s.selectedDate);
  const jokerUsedMonth = useHabitStore((s) => s.jokerUsedMonth);
  const jokerSavedDate = useHabitStore((s) => s.jokerSavedDate);
  const setSelectedDate = useHabitStore((s) => s.setSelectedDate);
  const confirmCompletion = useHabitStore((s) => s.confirmCompletion);
  const removeCompletion = useHabitStore((s) => s.removeCompletion);
  const isCompleted = useHabitStore((s) => s.isCompleted);
  const useJokerForYesterday = useHabitStore((s) => s.useJokerForYesterday);

  const didMountSync = useRef(false);
  useEffect(() => {
    if (didMountSync.current) {
      return;
    }
    didMountSync.current = true;
    setSelectedDate(getTodayKey());
  }, [setSelectedDate]);

  const selectedDate = useMemo(
    () => parseDateKey(selectedDateKey),
    [selectedDateKey],
  );

  const todayKey = getTodayKey();
  const headerLabel = formatDayHeaderLabel(selectedDate);
  const dateSubtitle = formatFullDateLabel(selectedDate);
  const viewingToday = isToday(selectedDate);
  const viewingPast = isPastDay(selectedDate);
  const viewingFuture = isFutureDay(selectedDate);
  const daysUntilSelected = getDaysUntil(selectedDate);

  const dayHabits = useMemo(
    () => getHabitsForDate(habits, selectedDate),
    [habits, selectedDate],
  );

  const doneCount = dayHabits.filter((h) =>
    isCompleted(h.id, selectedDateKey),
  ).length;

  const progress =
    dayHabits.length > 0 ? (doneCount / dayHabits.length) * 100 : 0;

  const ringColor = resolveHabitColor(dayHabits[0]?.color);

  const streak = useMemo(
    () => getCurrentStreak(completions, jokerSavedDate),
    [completions, jokerSavedDate],
  );

  const showJoker = useMemo(() => {
    if (selectedDateKey !== todayKey) {
      return false;
    }
    return canOfferJoker(completions, jokerUsedMonth, jokerSavedDate);
  }, [completions, jokerUsedMonth, jokerSavedDate, selectedDateKey, todayKey]);

  const jokerStreakDays = useMemo(() => {
    const yesterday = addDays(startOfToday(), -1);
    const dayBeforeYesterday = addDays(yesterday, -1);
    return getStreakUpToDate(completions, dayBeforeYesterday, jokerSavedDate);
  }, [completions, jokerSavedDate]);

  const validateHabit = async (habit: Habit): Promise<void> => {
    const habitId = habit.id;
    const streakBefore = getCurrentStreak(completions, jokerSavedDate);
    const now = new Date();
    const completedAt = new Date(selectedDate);
    completedAt.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), 0);

    setUndoHabitId(null);
    await confirmCompletion(habitId, selectedDate, completedAt);
    void hapticSuccess();

    setCelebratingId(habitId);
    setTimeout(() => setCelebratingId(null), 900);

    const newCompletions = [
      ...completions.filter(
        (c) => !(c.habitId === habitId && c.date === selectedDateKey),
      ),
      {
        habitId,
        date: selectedDateKey,
        completedAt: completedAt.toISOString(),
      },
    ];
    const streakAfter = getCurrentStreak(newCompletions, jokerSavedDate);
    if (streakAfter > streakBefore) {
      void hapticMedium();
    }
  };

  const handleHabitPress = (habit: Habit): void => {
    if (viewingFuture) {
      return;
    }
    if (isCompleted(habit.id, selectedDateKey)) {
      setUndoHabitId((prev) => (prev === habit.id ? null : habit.id));
      return;
    }
    void validateHabit(habit);
  };

  const handleUndoConfirm = (habitId: string): void => {
    removeCompletion(habitId, selectedDateKey);
    setUndoHabitId(null);
  };

  const handleUseJoker = (): void => {
    if (useJokerForYesterday()) {
      void hapticSuccess();
    }
  };

  const noHabitsAtAll = habits.length === 0;
  const noHabitsToday = dayHabits.length === 0 && !noHabitsAtAll;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <PageHeader
          title={headerLabel}
          titleAccent={viewingToday}
          right={<StreakBadge streak={streak} />}
        />
        <Text style={styles.dateSubtitle}>{dateSubtitle}</Text>

        <WeekDayBar
          selectedDate={selectedDate}
          onSelectDate={(d) => {
            setUndoHabitId(null);
            setSelectedDate(toDateKey(d));
          }}
        />

        <MotivationalQuote date={selectedDate} />

        {showJoker ? (
          <JokerBanner streakDays={jokerStreakDays} onUseJoker={handleUseJoker} />
        ) : null}

        <View style={styles.progressSection}>
          {noHabitsAtAll ? (
            <View style={styles.emptyRingBlock}>
              <PulsingEmptyRing />
              <Text style={styles.emptyRingText}>{t('today.emptyRing')}</Text>
            </View>
          ) : (
            <ProgressRing
              progress={progress}
              doneCount={doneCount}
              totalCount={dayHabits.length}
              accentColor={ringColor}
            />
          )}
        </View>

        <Text style={styles.section}>{t('today.habits')}</Text>

        {noHabitsAtAll ? (
          <PrimaryButton
            label={t('today.createFirst')}
            onPress={() => navigation.navigate('Create')}
            style={styles.emptyBtn}
          />
        ) : noHabitsToday ? (
          <View style={styles.freeDay}>
            <Text style={styles.freeEmoji}>☕</Text>
            <Text style={styles.freeTitle}>{t('today.freeDayTitle')}</Text>
            <Text style={styles.freeText}>{t('today.freeDayText')}</Text>
          </View>
        ) : (
          dayHabits.map((item) => {
            const completed = isCompleted(item.id, selectedDateKey);
            const isMissed = viewingPast && !completed;
            const isLocked = viewingFuture;

            return (
              <HabitCard
                key={item.id}
                habit={item}
                completed={completed}
                isMissed={isMissed}
                isLocked={isLocked}
                daysUntilAvailable={daysUntilSelected}
                isCelebrating={celebratingId === item.id}
                showUndoPrompt={!viewingFuture && undoHabitId === item.id}
                onPress={() => handleHabitPress(item)}
                onLateValidate={() => void validateHabit(item)}
                onUndoConfirm={() => handleUndoConfirm(item.id)}
                onUndoCancel={() => setUndoHabitId(null)}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  scroll: {
    paddingBottom: 120,
  },
  dateSubtitle: {
    ...typography.caption,
    marginTop: -spacing.md,
    marginBottom: spacing.md,
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  emptyRingBlock: {
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyRingText: {
    ...typography.body,
    textAlign: 'center',
    maxWidth: 260,
  },
  section: {
    ...typography.sectionTitle,
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  emptyBtn: {
    width: '100%',
  },
  freeDay: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  freeEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  freeTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  freeText: {
    ...typography.body,
    textAlign: 'center',
  },
});
