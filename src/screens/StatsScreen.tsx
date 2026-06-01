import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoachSection } from '../components/CoachSection';
import { IdentitiesSection } from '../components/IdentitiesSection';
import { PageHeader } from '../components/PageHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatsCalendar } from '../components/StatsCalendar';
import { StatsChallenges } from '../components/StatsChallenges';
import { StatsOverview } from '../components/StatsOverview';
import { colors, spacing, typography } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import { useHabitStore } from '../store/habitStore';
import { getHabitsWithIdentity } from '../utils/habitStreak';
import { getWeekProgress } from '../utils/stats';
import { startOfToday } from '../utils/date';
import { getBestStreak, getCurrentStreak } from '../utils/streak';

type StatsTab = 'overview' | 'calendar' | 'challenges';

export function StatsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [tab, setTab] = useState<StatsTab>('overview');
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const habits = useHabitStore((s) => s.habits);
  const completions = useHabitStore((s) => s.completions);
  const jokerSavedDate = useHabitStore((s) => s.jokerSavedDate);

  const today = useMemo(() => startOfToday(), []);

  const weekProgress = useMemo(
    () => getWeekProgress(habits, completions, today),
    [habits, completions, today],
  );

  const weekTotal = weekProgress.reduce((a, d) => a + d.total, 0);
  const weekDone = weekProgress.reduce((a, d) => a + d.done, 0);
  const weekRate =
    weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

  const currentStreak = useMemo(
    () => getCurrentStreak(completions, jokerSavedDate),
    [completions, jokerSavedDate],
  );
  const bestStreak = useMemo(
    () => getBestStreak(completions, jokerSavedDate),
    [completions, jokerSavedDate],
  );

  const identityHabits = useMemo(
    () => getHabitsWithIdentity(habits, completions),
    [habits, completions],
  );

  const handleShare = async (): Promise<void> => {
    await Share.share({
      message: t('stats.shareMessage', { streak: currentStreak }),
    });
  };

  const tabs: { id: StatsTab; labelKey: string }[] = [
    { id: 'overview', labelKey: 'stats.overview' },
    { id: 'calendar', labelKey: 'stats.calendar' },
    { id: 'challenges', labelKey: 'stats.challenges' },
  ];

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
      <PageHeader title={t('stats.title')} />

      <View style={styles.tabs}>
        {tabs.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.tab, tab === item.id && styles.tabActive]}
            onPress={() => setTab(item.id)}
          >
            <Text style={[styles.tabText, tab === item.id && styles.tabTextActive]}>
              {t(item.labelKey)}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === 'overview' ? (
        <>
          <StatsOverview
            totalHabits={habits.length}
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            weekRate={weekRate}
            weekDone={weekDone}
            weekTotal={weekTotal}
            weekProgress={weekProgress}
          />
          <PrimaryButton
            label={t('stats.shareStreak')}
            onPress={() => void handleShare()}
            style={styles.shareBtn}
          />

          <Text style={styles.sectionTitle}>{t('stats.identities')}</Text>
          <IdentitiesSection habits={identityHabits} />

          <CoachSection />
        </>
      ) : null}

      {tab === 'calendar' ? (
        <StatsCalendar
          habits={habits}
          completions={completions}
          month={calendarMonth}
          onChangeMonth={setCalendarMonth}
        />
      ) : null}

      {tab === 'challenges' ? <StatsChallenges /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  tab: {
    paddingBottom: spacing.sm,
  },
  tabActive: {
    borderBottomWidth: 1,
    borderBottomColor: colors.text,
    marginBottom: -1,
  },
  tabText: {
    ...typography.caption,
    fontSize: 13,
  },
  tabTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  shareBtn: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});
