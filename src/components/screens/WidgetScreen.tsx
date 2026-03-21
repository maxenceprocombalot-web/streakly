import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../design/colors';
import { TEXT_STYLES } from '../../design/text';
import { SPACING, RADIUS } from '../../design/spacing';
import { useHabitActions } from '../../hooks/useHabitActions';
import { statsService } from '../../services/statsService';
import StreakBadge from '../shared/StreakBadge';
import { getDateISO } from '../../utils/dateUtils';

const WidgetScreen = () => {
  const { habits, loadHabitsFromStorage } = useHabitActions();
  const [todayStats, setTodayStats] = useState({
    completedCount: 0,
    totalCount: 0,
    completionRate: 0,
  });
  const [overallStats, setOverallStats] = useState({
    currentStreak: 0,
  });

  useFocusEffect(
    React.useCallback(() => {
      loadHabitsFromStorage();
    }, [])
  );

  useEffect(() => {
    if (habits.length === 0) return;

    const today = getDateISO(new Date());
    const dayHabits = habits.filter((h) => {
      const dayOfWeek = new Date(today).getDay();
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      return h.activeDays[adjustedDay];
    });

    const stats = statsService.getDailyStats(dayHabits, today);
    setTodayStats(stats);

    const overall = statsService.getOverallStats(habits);
    setOverallStats(overall);
  }, [habits]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Widgets d'accueil</Text>
          <Text style={styles.subtitle}>
            Ajoute ces widgets à ton écran d'accueil
          </Text>
        </View>

        {/* Compact Widget */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Widget Compact</Text>
          <Text style={styles.sectionDescription}>
            Affiche le streak et la complétion du jour
          </Text>

          <View style={styles.compactWidgetPreview}>
            <View style={styles.compactWidget}>
              <View style={styles.compactContent}>
                <View style={styles.compactLeft}>
                  <Text style={styles.flame}>🔥</Text>
                  <Text style={styles.compactStreakText}>
                    {overallStats.currentStreak}
                  </Text>
                </View>
                <View style={styles.compactDivider} />
                <View style={styles.compactRight}>
                  <Text style={styles.compactPercentage}>
                    {todayStats.completionRate}%
                  </Text>
                  <Text style={styles.compactLabel}>
                    Complété
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.info}>
            <Text style={styles.infoText}>
              ✓ Refresh automatique: Toutes les 15 minutes
            </Text>
            <Text style={styles.infoText}>
              ✓ Taille: Small (1x1 sur iOS, 2x2 sur Android)
            </Text>
            <Text style={styles.infoText}>
              ✓ Mise à jour: Synchronisée avec l'app
            </Text>
          </View>
        </View>

        {/* Extended Widget */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Widget Étendu</Text>
          <Text style={styles.sectionDescription}>
            Affiche plus de détails et les habitudes du jour
          </Text>

          <View style={styles.extendedWidgetPreview}>
            <View style={styles.extendedWidget}>
              <View style={styles.extendedHeader}>
                <View>
                  <Text style={styles.extendedTitle}>Streakly</Text>
                  <Text style={styles.extendedDate}>
                    {new Date().toLocaleDateString('fr-FR', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.extendedStreakBadge}>
                  <Text style={styles.flame}>🔥</Text>
                  <Text style={styles.extendedStreakCount}>
                    {overallStats.currentStreak}
                  </Text>
                </View>
              </View>

              <View style={styles.extendedProgress}>
                <View style={styles.extendedProgressLabel}>
                  <Text style={styles.extendedProgressText}>
                    Habitudes du jour
                  </Text>
                </View>
                <View style={styles.extendedProgressBar}>
                  <View
                    style={[
                      styles.extendedProgressFill,
                      {
                        width: `${Math.max(
                          2,
                          todayStats.completionRate
                        )}%`,
                      },
                    ]}
                  />
                </View>
                <View style={styles.extendedProgressStats}>
                  <Text style={styles.extendedProgressStat}>
                    {todayStats.completedCount}/{
                    todayStats.totalCount
                    }
                  </Text>
                  <Text style={styles.extendedProgressStat}>
                    {todayStats.completionRate}%
                  </Text>
                </View>
              </View>

              <View style={styles.extendedFooter}>
                <Text style={styles.extendedFooterText}>
                  ← Swipe pour ouvrir Streakly →
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.info}>
            <Text style={styles.infoText}>
              ✓ Refresh automatique: Toutes les 15 minutes
            </Text>
            <Text style={styles.infoText}>
              ✓ Taille: Medium (2x2 sur iOS, 4x2 sur Android)
            </Text>
            <Text style={styles.infoText}>
              ✓ Affiche: Streak, progression, compte habituesl
            </Text>
            <Text style={styles.infoText}>
              ✓ Tap pour ouvrir l'app Streakly
            </Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comment ajouter?</Text>

          <View style={styles.instructionCard}>
            <Text style={styles.instructionNumber}>1</Text>
            <View style={styles.instructionContent}>
              <Text style={styles.instructionTitle}>
                Sur l'écran d'accueil
              </Text>
              <Text style={styles.instructionText}>
                Appuie longuement sur un espace vide
              </Text>
            </View>
          </View>

          <View style={styles.instructionCard}>
            <Text style={styles.instructionNumber}>2</Text>
            <View style={styles.instructionContent}>
              <Text style={styles.instructionTitle}>
                Sélectionne "Widget"
              </Text>
              <Text style={styles.instructionText}>
                Cherche "Streakly" dans la liste
              </Text>
            </View>
          </View>

          <View style={styles.instructionCard}>
            <Text style={styles.instructionNumber}>3</Text>
            <View style={styles.instructionContent}>
              <Text style={styles.instructionTitle}>
                Choisis la taille
              </Text>
              <Text style={styles.instructionText}>
                Compact ou Étendu - à toi de jouer!
              </Text>
            </View>
          </View>
        </View>

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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...TEXT_STYLES.h1,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.secondary,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    ...TEXT_STYLES.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  sectionDescription: {
    ...TEXT_STYLES.bodySm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  compactWidgetPreview: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  compactWidget: {
    width: 140,
    height: 140,
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  compactLeft: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  compactRight: {
    flex: 1,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  flame: {
    fontSize: 20,
  },
  compactStreakText: {
    ...TEXT_STYLES.labelLg,
    color: COLORS.accent.orange,
  },
  compactDivider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.border,
  },
  compactPercentage: {
    ...TEXT_STYLES.h3,
    color: COLORS.accent.violet,
  },
  compactLabel: {
    ...TEXT_STYLES.caption,
    color: COLORS.text.secondary,
  },
  extendedWidgetPreview: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  extendedWidget: {
    width: 280,
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  extendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  extendedTitle: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  extendedDate: {
    ...TEXT_STYLES.bodySm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  extendedStreakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.accent.orange,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  extendedStreakCount: {
    ...TEXT_STYLES.labelMd,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  extendedProgress: {
    marginBottom: SPACING.lg,
  },
  extendedProgressLabel: {
    marginBottom: SPACING.sm,
  },
  extendedProgressText: {
    ...TEXT_STYLES.bodySm,
    color: COLORS.text.secondary,
  },
  extendedProgressBar: {
    height: 12,
    backgroundColor: COLORS.background.primary,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  extendedProgressFill: {
    height: '100%',
    backgroundColor: COLORS.accent.violet,
    borderRadius: RADIUS.sm,
  },
  extendedProgressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  extendedProgressStat: {
    ...TEXT_STYLES.labelSm,
    color: COLORS.accent.violet,
    fontWeight: '600',
  },
  extendedFooter: {
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  extendedFooterText: {
    ...TEXT_STYLES.bodySm,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  info: {
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  infoText: {
    ...TEXT_STYLES.bodySm,
    color: COLORS.text.secondary,
  },
  instructionCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    gap: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent.violet,
  },
  instructionNumber: {
    ...TEXT_STYLES.h2,
    color: COLORS.accent.violet,
    width: 30,
    textAlign: 'center',
  },
  instructionContent: {
    flex: 1,
  },
  instructionTitle: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  instructionText: {
    ...TEXT_STYLES.bodySm,
    color: COLORS.text.secondary,
  },
});

export default WidgetScreen;
