import { Habit, HabitStats, DailyStats } from '../store/types';
import { getStartOfDay, getDateISO, getDayOfWeek } from '../utils/dateUtils';

export const statsService = {
  getHabitStats(habit: Habit): HabitStats {
    const today = getDateISO(new Date());
    const completions = Object.keys(habit.completions);

    // Current streak
    let currentStreak = 0;
    let checkDate = new Date(today);

    while (true) {
      const dateISO = getDateISO(checkDate);
      if (habit.completions[dateISO]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Completion rate (last 7 days)
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(getDateISO(date));
    }
    const completedInLast7 = last7Days.filter(
      (date) => habit.completions[date]
    ).length;
    const completionRate = Math.round((completedInLast7 / 7) * 100);

    // Best week rate
    let bestWeekRate = 0;
    for (let weekStart = 0; weekStart < 52; weekStart++) {
      let weekCompleted = 0;
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(today);
        date.setDate(
          date.getDate() - (weekStart * 7 + dayOffset)
        );
        if (habit.completions[getDateISO(date)]) {
          weekCompleted++;
        }
      }
      const weekRate = Math.round((weekCompleted / 7) * 100);
      bestWeekRate = Math.max(bestWeekRate, weekRate);
    }

    return {
      currentStreak,
      completionRate,
      totalCompleted: completions.length,
      bestWeekRate,
    };
  },

  getDailyStats(habits: Habit[], date: string): DailyStats {
    let completedCount = 0;
    const totalCount = habits.length;
    const habitStats = habits.map((habit) => ({
      id: habit.id,
      completed: !!habit.completions[date],
    }));

    completedCount = habitStats.filter((h) => h.completed).length;
    const completionRate =
      totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    return {
      completedCount,
      totalCount,
      completionRate,
      habits: habitStats,
    };
  },

  getOverallStats(habits: Habit[]) {
    const today = getDateISO(new Date());
    let totalCompleted = 0;
    let currentStreak = 0;
    let bestWeekRate = 0;

    // Check if at least one habit completed today
    const todayHasCompletion = habits.some(
      (h) => h.completions[today]
    );

    // Calculate overall streak
    let checkDate = new Date(today);
    while (true) {
      const dateISO = getDateISO(checkDate);
      const dayHabits = habits.filter((h) => {
        const dayOfWeek = new Date(dateISO).getDay();
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        return h.activeDays[adjustedDay];
      });

      if (dayHabits.length === 0) break;

      const hasCompletion = dayHabits.some((h) => h.completions[dateISO]);
      if (hasCompletion) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Total and best week
    habits.forEach((habit) => {
      totalCompleted += Object.keys(habit.completions).length;
      const hStats = this.getHabitStats(habit);
      bestWeekRate = Math.max(bestWeekRate, hStats.bestWeekRate);
    });

    // Overall completion rate (last 7 days)
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(getDateISO(date));
    }

    let last7Completed = 0;
    let last7Possible = 0;
    last7Days.forEach((dateISO) => {
      const dayHabits = habits.filter((h) => {
        const dayOfWeek = new Date(dateISO).getDay();
        const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        return h.activeDays[adjustedDay];
      });
      last7Possible += dayHabits.length;
      last7Completed += dayHabits.filter((h) => h.completions[dateISO]).length;
    });

    const completionRate = last7Possible === 0 ? 0 : Math.round((last7Completed / last7Possible) * 100);

    return {
      totalCompleted,
      currentStreak,
      bestWeekRate,
      completionRate,
    };
  },

  getLast7Days(habits: Habit[]) {
    const result = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateISO = getDateISO(date);
      const stats = this.getDailyStats(habits, dateISO);
      result.push({
        date: dateISO,
        ...stats,
      });
    }

    return result;
  },

  getMonthlyHeatmap(habits: Habit[], year: number, month: number) {
    const result = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateISO = getDateISO(date);
      const stats = this.getDailyStats(habits, dateISO);
      result.push({
        day,
        date: dateISO,
        completionRate: stats.completionRate,
      });
    }

    return result;
  },

  getCategoryDistribution(habits: Habit[]) {
    const distribution: { [key: string]: number } = {};

    habits.forEach((habit) => {
      distribution[habit.category] =
        (distribution[habit.category] || 0) +
        Object.keys(habit.completions).length;
    });

    return Object.entries(distribution)
      .map(([category, count]) => ({
        category,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  },
};
