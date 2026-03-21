import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../design/colors';
import { TEXT_STYLES } from '../../design/text';
import { SPACING, RADIUS } from '../../design/spacing';
import { useHabitActions } from '../../hooks/useHabitActions';
import { statsService } from '../../services/statsService';
import { copywriting } from '../../utils/textCopywriting';
import { getDateISO, getWeekDays } from '../../utils/dateUtils';
import HabitCard from '../shared/HabitCard';
import StreakBadge from '../shared/StreakBadge';
import ProgressRing from '../shared/ProgressRing';
import BottomSheet from '../shared/BottomSheet';
import Button from '../shared/Button';

const TodayScreen = () => {
  const { habits, loadHabitsFromStorage, completeHabit, getHabitsForDate } =
    useHabitActions();
  const [selectedDate, setSelectedDate] = useState(getDateISO(new Date()));
  const [dailyStats, setDailyStats] = useState({
    completedCount: 0,
    totalCount: 0,
    completionRate: 0,
    habits: [],
  });
  const [overallStats, setOverallStats] = useState({
    currentStreak: 0,
    completionRate: 0,
    totalCompleted: 0,
    bestWeekRate: 0,
  });
  const [todayHabits, setTodayHabits] = useState([]);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [dailyQuote, setDailyQuote] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadHabitsFromStorage();
    }, [])
  );

  useEffect(() => {
    if (habits.length === 0) return;

    const today = getDateISO(new Date());
    const dayHabits = getHabitsForDate(today);

    setTodayHabits(dayHabits);
    const stats = statsService.getDailyStats(dayHabits, today);
    setDailyStats(stats);

    const overall = statsService.getOverallStats(habits);
    setOverallStats(overall);

    setDailyQuote(copywriting.getRandomQuote());
  }, [habits]);

  const handleHabitPress = (habit) => {
    setSelectedHabit(habit);
    setBottomSheetVisible(true);
  };

  const handleConfirmCompletion = async (manualTime?: string) => {
    if (selectedHabit) {
      await completeHabit(selectedHabit.id, selectedDate, manualTime);
      setSelectedHabit(null);
    }
  };

  const weekDays = getWeekDays();

  const isHabitCompleted = (habitId: string) => {
    return habits
      .find((h) => h.id === habitId)
      ?.completions[selectedDate] !== undefined;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with streak badge */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Aujourd'hui</Text>
            <Text style={styles.headerDate}>
              {new Date(selectedDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          </View>
          <StreakBadge days={overallStats.currentStreak} size="lg" />
        </View>

        {/* Week selector */}
        <ScrollView
          style={styles.weekSelector}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {weekDays.map((day) => (
            <Button
              key={day.label}
              label={day.label}
              onPress={() => setSelectedDate(day.date.toISOString().split('T')[0])}
              variant={
                selectedDate === day.date.toISOString().split('T')[0]
                  ? 'primary'
                  : 'secondary'
              }
              size="sm"
              style={styles.dayButton}
            />
          ))}
        </ScrollView>

        {/* Daily quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"{dailyQuote}"</Text>
        </View>

        {/* Progress ring */}
        <ProgressRing
          percentage={dailyStats.completionRate}
          completed={dailyStats.completedCount}
          total={dailyStats.totalCount}
          size="md"
        />

        {/* Habits section */}
        <View style={styles.habitsSection}>
          <Text style={styles.sectionTitle}>Les habitudes d'aujourd'hui</Text>

          {todayHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>✨</Text>
              <Text style={styles.emptyStateText}>
                Aucune habitude planifiée pour aujourd'hui
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Crée une nouvelle habitude pour commencer ton streak
              </Text>
            </View>
          ) : (
            todayHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                emoji={habit.emoji}
                name={habit.name}
                category={habit.category}
                scheduledTime={habit.scheduledTime}
                isCompleted={isHabitCompleted(habit.id)}
                onPress={() => handleHabitPress(habit)}
              />
            ))
          )}
        </View>

        {/* Motivational message */}
        {todayHabits.length > 0 && (
          <View style={styles.motivationCard}>
            <Text style={styles.motivationText}>
              {copywriting.getMotivationByCompletionRate(
                dailyStats.completionRate
              )}
            </Text>
          </View>
        )}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>

      {/* Bottom sheet for habit completion */}
      {selectedHabit && (
        <BottomSheet
          visible={bottomSheetVisible}
          onClose={() => setBottomSheetVisible(false)}
          onConfirm={handleConfirmCompletion}
          habitName={selectedHabit.name}
          emoji={selectedHabit.emoji}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    ...TEXT_STYLES.h1,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  headerDate: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.secondary,
  },
  weekSelector: {
    marginBottom: SPACING.lg,
  },
  dayButton: {
    marginRight: SPACING.md,
  },
  quoteCard: {
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  quoteText: {
    ...TEXT_STYLES.bodyLg,
    color: COLORS.accent.violet,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  habitsSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TEXT_STYLES.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  emptyStateText: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  emptyStateSubtext: {
    ...TEXT_STYLES.bodySm,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  motivationCard: {
    backgroundColor: COLORS.background.elevated,
    borderRadius: RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent.orange,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  motivationText: {
    ...TEXT_STYLES.bodyLg,
    color: COLORS.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TodayScreen;
