import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useCallback, useMemo } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingActionButton } from '../components/FloatingActionButton';
import { ManageHabitCard } from '../components/ManageHabitCard';
import { PageHeader } from '../components/PageHeader';
import { cardBase, colors, spacing, typography } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import type { RootTabParamList } from '../navigation/AppNavigator';
import { useHabitStore } from '../store/habitStore';
import type { Habit, WeekDay } from '../types/habit';
import { getHabitWeekRate } from '../utils/stats';
import { hasIdentityUnlocked } from '../utils/habitStreak';

export function ManageScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation =
    useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const updateHabit = useHabitStore((s) => s.updateHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const handleToggleDay = useCallback(
    (habit: Habit, day: WeekDay) => {
      const days = habit.daysOfWeek.includes(day)
        ? habit.daysOfWeek.filter((d) => d !== day)
        : [...habit.daysOfWeek, day];
      if (days.length === 0) {
        Alert.alert(t('manage.alertTitle'), t('manage.keepOneDay'));
        return;
      }
      void updateHabit(habit.id, { daysOfWeek: days });
    },
    [updateHabit, t],
  );

  const confirmDelete = (habit: Habit): void => {
    Alert.alert(
      t('manage.deleteTitle'),
      t('manage.deleteMessage', { name: habit.name }),
      [
        { text: t('manage.cancel'), style: 'cancel' },
        {
          text: t('manage.deleteConfirm'),
          style: 'destructive',
          onPress: () => void deleteHabit(habit.id),
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PageHeader title={t('manage.title')} />

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {habits.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>{t('manage.emptyTitle')}</Text>
            <Text style={styles.emptyText}>{t('manage.emptyText')}</Text>
          </View>
        ) : (
          habits.map((habit) => (
            <ManageHabitCard
              key={habit.id}
              habit={habit}
              weekRate={getHabitWeekRate(habit.id, habit, completions, today)}
              hasIdentity={hasIdentityUnlocked(habit, completions)}
              onToggleDay={(day) => handleToggleDay(habit, day)}
              onDelete={() => confirmDelete(habit)}
            />
          ))
        )}
      </ScrollView>

      <FloatingActionButton
        bottom={insets.bottom + 78}
        onPress={() => navigation.navigate('Create')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  list: {
    flex: 1,
    paddingBottom: 120,
  },
  emptyCard: {
    ...cardBase,
    alignItems: 'center',
    padding: spacing.lg,
    paddingVertical: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
  },
});
