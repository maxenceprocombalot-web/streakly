import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, COLORS_CATEGORIES } from '../../design/colors';
import { TEXT_STYLES } from '../../design/text';
import { SPACING, RADIUS } from '../../design/spacing';
import { useHabitActions } from '../../hooks/useHabitActions';
import { statsService } from '../../services/statsService';
import Button from '../shared/Button';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

const ManageHabitsScreen = ({ navigation }) => {
  const {
    habits,
    loadHabitsFromStorage,
    deleteHabit,
    toggleHabitDay,
    updateHabit,
  } = useHabitActions();
  const [displayHabits, setDisplayHabits] = useState([]);
  const [habitStats, setHabitStats] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      loadHabitsFromStorage();
    }, [])
  );

  useEffect(() => {
    if (habits.length === 0) {
      setDisplayHabits([]);
      return;
    }

    setDisplayHabits(habits);

    const stats = {};
    habits.forEach((habit) => {
      stats[habit.id] = statsService.getHabitStats(habit);
    });
    setHabitStats(stats);
  }, [habits]);

  const handleDeleteHabit = (habitId) => {
    Alert.alert(
      'Supprimer cette habitude?',
      'Cette action est irréversible.',
      [
        { text: 'Annuler', onPress: () => {}, style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: () => deleteHabit(habitId),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gérer mes habitudes</Text>
      </View>

      {displayHabits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>🎯</Text>
          <Text style={styles.emptyStateText}>
            Aucune habitude créée
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Crée ta première habitude pour commencer ton journey
          </Text>
          <Button
            label="+ Créer une habitude"
            onPress={() => navigation.navigate('Create')}
            size="lg"
            style={styles.emptyStateButton}
          />
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.habitsList}
            showsVerticalScrollIndicator={false}
          >
            {displayHabits.map((habit) => {
              const stats = habitStats[habit.id];
              const categoryColor =
                COLORS_CATEGORIES[
                habit.category as keyof typeof COLORS_CATEGORIES
                ] || COLORS.accent.violet;

              return (
                <View key={habit.id} style={styles.habitItem}>
                  <View style={styles.habitContent}>
                    <Text style={styles.habitEmoji}>{habit.emoji}</Text>

                    <View style={styles.habitInfo}>
                      <Text style={styles.habitName}>{habit.name}</Text>

                      <View style={styles.metaRow}>
                        <View
                          style={[
                            styles.categoryBadge,
                            { backgroundColor: categoryColor },
                          ]}
                        >
                          <Text style={styles.categoryBadgeText}>
                            {habit.category}
                          </Text>
                        </View>

                        {stats && (
                          <View style={styles.statBadge}>
                            <Text style={styles.statBadgeText}>
                              {stats.completionRate}%
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Day toggles */}
                      <View style={styles.daysToggle}>
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(
                          (day, index) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.dayToggle,
                                habit.activeDays[index] &&
                                styles.dayToggleActive,
                              ]}
                              onPress={() => toggleHabitDay(habit.id, index)}
                            >
                              <Text
                                style={[
                                  styles.dayToggleText,
                                  habit.activeDays[index] &&
                                  styles.dayToggleTextActive,
                                ]}
                              >
                                {day}
                              </Text>
                            </TouchableOpacity>
                          )
                        )}
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteHabit(habit.id)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
            <View style={{ height: SPACING.xxxl }} />
          </ScrollView>

          {/* Floating action button */}
          <View style={styles.fab}>
            <Button
              label="+ Créer une nouvelle"
              onPress={() => navigation.navigate('Create')}
              size="lg"
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
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
  },
  habitsList: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
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
    marginBottom: SPACING.xl,
  },
  emptyStateButton: {
    width: '100%',
  },
  habitItem: {
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitContent: {
    flex: 1,
    flexDirection: 'row',
    gap: SPACING.md,
  },
  habitEmoji: {
    fontSize: 28,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  categoryBadgeText: {
    ...TEXT_STYLES.labelSm,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  statBadge: {
    backgroundColor: COLORS.accent.violet,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  statBadgeText: {
    ...TEXT_STYLES.labelSm,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  daysToggle: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  dayToggle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayToggleActive: {
    backgroundColor: COLORS.accent.green,
    borderColor: COLORS.accent.green,
  },
  dayToggleText: {
    ...TEXT_STYLES.labelSm,
    color: COLORS.text.secondary,
  },
  dayToggleTextActive: {
    color: COLORS.text.primary,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accent.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
  },
  fab: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
});

export default ManageHabitsScreen;
