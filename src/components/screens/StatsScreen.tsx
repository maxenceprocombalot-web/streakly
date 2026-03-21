import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../design/colors';
import { TEXT_STYLES } from '../../design/text';
import { SPACING, RADIUS } from '../../design/spacing';
import { useHabitActions } from '../../hooks/useHabitActions';
import { statsService } from '../../services/statsService';
import { copywriting } from '../../utils/textCopywriting';
import { getDateISO } from '../../utils/dateUtils';

const StatsScreen = () => {
  const { habits, loadHabitsFromStorage } = useHabitActions();
  const [tab, setTab] = useState('overview');
  const [overallStats, setOverallStats] = useState({
    totalCompleted: 0,
    currentStreak: 0,
    bestWeekRate: 0,
    completionRate: 0,
  });
  const [last7Days, setLast7Days] = useState([]);
  const [monthlyHeatmap, setMonthlyHeatmap] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadHabitsFromStorage();
    }, [])
  );

  useEffect(() => {
    if (habits.length === 0) return;

    const overall = statsService.getOverallStats(habits);
    setOverallStats(overall);

    const last7 = statsService.getLast7Days(habits);
    setLast7Days(last7);

    const today = new Date();
    const heatmap = statsService.getMonthlyHeatmap(
      habits,
      today.getFullYear(),
      today.getMonth()
    );
    setMonthlyHeatmap(heatmap);

    const distribution = statsService.getCategoryDistribution(habits);
    setCategoryDistribution(distribution);
  }, [habits]);

  const getMotivationMessage = () => {
    return copywriting.getMotivationByCompletionRate(
      overallStats.completionRate
    );
  };

  const getHeatmapColor = (rate: number) => {
    if (rate === 0) return COLORS.background.surface;
    if (rate < 30) return '#2d2d3d';
    if (rate < 60) return '#6c63ff33';
    if (rate < 90) return '#6c63ff66';
    return '#6c63ff';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity
          style={[
            styles.tab,
            tab === 'overview' && styles.tabActive,
          ]}
          onPress={() => setTab('overview')}
        >
          <Text
            style={[
              styles.tabText,
              tab === 'overview' && styles.tabTextActive,
            ]}
          >
            Aperçu
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            tab === 'calendar' && styles.tabActive,
          ]}
          onPress={() => setTab('calendar')}
        >
          <Text
            style={[
              styles.tabText,
              tab === 'calendar' && styles.tabTextActive,
            ]}
          >
            Calendrier
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {tab === 'overview' && (
          <>
            {/* Motivation message */}
            <View style={styles.motivationBanner}>
              <Text style={styles.motivationText}>
                {getMotivationMessage()}
              </Text>
            </View>

            {/* Key metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Taux de complétions</Text>
                <Text style={styles.metricValue}>
                  {overallStats.completionRate}%
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Streak actuel</Text>
                <Text style={styles.metricValue}>
                  {overallStats.currentStreak}🔥
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Total réalisé</Text>
                <Text style={styles.metricValue}>
                  {overallStats.totalCompleted}
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Meilleure semaine</Text>
                <Text style={styles.metricValue}>
                  {overallStats.bestWeekRate}%
                </Text>
              </View>
            </View>

            {/* Last 7 days histogram */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>7 derniers jours</Text>
              <View style={styles.histogram}>
                {last7Days.map((day, index) => (
                  <View key={index} style={styles.histogramColumn}>
                    <View
                      style={[
                        styles.histogramBar,
                        {
                          height: `${Math.max(
                            10,
                            day.completionRate
                          )}%`,
                          backgroundColor:
                            day.completionRate === 0
                              ? COLORS.background.surface
                              : COLORS.accent.violet,
                        },
                      ]}
                    />
                    <Text style={styles.histogramLabel}>
                      {day.completionRate}%
                    </Text>
                    <Text style={styles.histogramDate}>
                      {new Date(day.date).getDate()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Category distribution */}
            {categoryDistribution.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Répartition par catégorie
                </Text>
                {categoryDistribution.map((category, index) => {
                  const maxCount = Math.max(
                    ...categoryDistribution.map((c) => c.count)
                  );
                  const percentage = Math.round(
                    (category.count / maxCount) * 100
                  );
                  return (
                    <View
                      key={index}
                      style={styles.categoryDistributionRow}
                    >
                      <Text style={styles.categoryName}>
                        {category.category}
                      </Text>
                      <View style={styles.categoryBar}>
                        <View
                          style={[
                            styles.categoryBarFill,
                            { width: `${percentage}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.categoryCount}>
                        {category.count}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}

        {tab === 'calendar' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Heatmap de {new Date().toLocaleDateString('fr-FR', {
                month: 'long',
              })}
            </Text>
            <View style={styles.heatmapContainer}>
              <View style={styles.heatmapGrid}>
                {Array(7)
                  .fill(0)
                  .map((_, i) => (
                    <Text
                      key={`header-${i}`}
                      style={styles.heatmapHeader}
                    >
                      {['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}
                    </Text>
                  ))}

                {monthlyHeatmap.map((day, index) => (
                  <View
                    key={index}
                    style={[
                      styles.heatmapDay,
                      {
                        backgroundColor: getHeatmapColor(
                          day.completionRate
                        ),
                      },
                    ]}
                  >
                    <Text style={styles.heatmapDayText}>
                      {day.day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Legend */}
              <View style={styles.heatmapLegend}>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      {
                        backgroundColor: COLORS.background.surface,
                      },
                    ]}
                  />
                  <Text style={styles.legendText}>0%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: '#2d2d3d' },
                    ]}
                  />
                  <Text style={styles.legendText}>1-30%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: '#6c63ff33' },
                    ]}
                  />
                  <Text style={styles.legendText}>30-60%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: '#6c63ff66' },
                    ]}
                  />
                  <Text style={styles.legendText}>60-90%</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: '#6c63ff' },
                    ]}
                  />
                  <Text style={styles.legendText}>90-100%</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  tabSelector: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.accent.violet,
  },
  tabText: {
    ...TEXT_STYLES.labelMd,
    color: COLORS.text.secondary,
  },
  tabTextActive: {
    color: COLORS.accent.violet,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  motivationBanner: {
    backgroundColor: COLORS.accent.violet,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  motivationText: {
    ...TEXT_STYLES.bodyLg,
    color: COLORS.text.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  metricLabel: {
    ...TEXT_STYLES.bodySm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  metricValue: {
    ...TEXT_STYLES.h2,
    color: COLORS.accent.violet,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TEXT_STYLES.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.lg,
  },
  histogram: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 150,
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
  histogramColumn: {
    alignItems: 'center',
    flex: 1,
    gap: SPACING.sm,
  },
  histogramBar: {
    width: '70%',
    borderRadius: RADIUS.sm,
  },
  histogramLabel: {
    ...TEXT_STYLES.labelSm,
    color: COLORS.text.secondary,
  },
  histogramDate: {
    ...TEXT_STYLES.labelSm,
    color: COLORS.text.secondary,
  },
  categoryDistributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  categoryName: {
    ...TEXT_STYLES.bodySm,
    color: COLORS.text.secondary,
    width: 80,
  },
  categoryBar: {
    flex: 1,
    height: 24,
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent.violet,
  },
  categoryCount: {
    ...TEXT_STYLES.labelSm,
    color: COLORS.text.primary,
    fontWeight: '600',
    width: 30,
    textAlign: 'right',
  },
  heatmapContainer: {
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  heatmapHeader: {
    width: '14%',
    textAlign: 'center',
    ...TEXT_STYLES.labelSm,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  heatmapDay: {
    width: '14%',
    aspectRatio: 1,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatmapDayText: {
    ...TEXT_STYLES.labelMd,
    color: COLORS.text.primary,
  },
  heatmapLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.sm,
  },
  legendItem: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: RADIUS.sm,
  },
  legendText: {
    ...TEXT_STYLES.caption,
    color: COLORS.text.secondary,
  },
});

export default StatsScreen;
