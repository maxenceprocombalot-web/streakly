import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

import { resolveHabitColor } from '../constants/habitColors';
import { cardBase, colors, spacing } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import type { Habit } from '../types/habit';

interface HabitCardProps {
  habit: Habit;
  completed: boolean;
  onPress: () => void;
  /** Jour passé non validé */
  isMissed?: boolean;
  onLateValidate?: () => void;
  /** Jour futur — lecture seule */
  isLocked?: boolean;
  daysUntilAvailable?: number;
  /** Déclenche l'animation de validation */
  isCelebrating?: boolean;
  /** Confirmation d'annulation */
  showUndoPrompt?: boolean;
  onUndoConfirm?: () => void;
  onUndoCancel?: () => void;
}

export function HabitCard({
  habit,
  completed,
  onPress,
  isMissed = false,
  onLateValidate,
  isLocked = false,
  daysUntilAvailable = 0,
  isCelebrating = false,
  showUndoPrompt = false,
  onUndoConfirm,
  onUndoCancel,
}: HabitCardProps) {
  const { t } = useTranslation();
  const borderColor = isLocked
    ? colors.textSecondary
    : completed
      ? colors.success
      : isMissed
        ? colors.danger
        : resolveHabitColor(habit.color);

  const cardScale = useRef(new Animated.Value(1)).current;
  const barScale = useRef(new Animated.Value(1)).current;
  const circleScale = useRef(new Animated.Value(0)).current;
  const circleOpacity = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!isCelebrating) {
      return;
    }

    cardScale.setValue(1);
    barScale.setValue(1);
    circleScale.setValue(0.2);
    circleOpacity.setValue(0.7);
    checkOpacity.setValue(0);
    checkScale.setValue(0.4);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(cardScale, {
          toValue: 1.02,
          duration: 100,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cardScale, {
          toValue: 1,
          duration: 100,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(barScale, {
          toValue: 1.02,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(barScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(circleScale, {
          toValue: 2.8,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(circleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(checkOpacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(450),
      Animated.timing(checkOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    isCelebrating,
    cardScale,
    barScale,
    circleScale,
    circleOpacity,
    checkOpacity,
    checkScale,
  ]);

  return (
    <View style={styles.wrap}>
      <Animated.View style={{ transform: [{ scale: cardScale }] }}>
        <Pressable
          onPress={onPress}
          disabled={isLocked}
          style={({ pressed }) => [
            styles.card,
            completed && !isLocked && styles.cardCompleted,
            isLocked && styles.cardLocked,
            pressed && !isLocked && styles.pressed,
          ]}
        >
          <Animated.View
            style={[
              styles.leftBar,
              { backgroundColor: borderColor, transform: [{ scaleY: barScale }] },
            ]}
          />
          <Text style={[styles.emoji, isLocked && styles.lockedDim]}>{habit.emoji}</Text>
          <Text
            style={[styles.name, completed && !isLocked && styles.nameDone, isLocked && styles.lockedDim]}
            numberOfLines={1}
          >
            {habit.name}
          </Text>
          {isLocked ? (
            <View style={styles.lockBlock}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.lockText}>
                {daysUntilAvailable === 1
                  ? t('today.availableIn', { count: 1 })
                  : t('today.availableIn_plural', { count: daysUntilAvailable })}
              </Text>
            </View>
          ) : null}
          {completed && !isCelebrating && !isLocked ? (
            <Text style={styles.check}>✓</Text>
          ) : null}

          <Animated.View
            pointerEvents="none"
            style={[
              styles.circleBurst,
              {
                opacity: circleOpacity,
                transform: [{ scale: circleScale }],
              },
            ]}
          />

          <Animated.View
            pointerEvents="none"
            style={[
              styles.checkOverlay,
              {
                opacity: checkOpacity,
                transform: [{ scale: checkScale }],
              },
            ]}
          >
            <Text style={styles.bigCheck}>✓</Text>
          </Animated.View>
        </Pressable>
      </Animated.View>

      {showUndoPrompt ? (
        <View style={styles.undoRow}>
          <Text style={styles.undoText}>{t('today.undoPrompt')}</Text>
          <View style={styles.undoActions}>
            <Pressable onPress={onUndoConfirm} style={styles.undoYes}>
              <Text style={styles.undoYesText}>{t('common.yes')}</Text>
            </Pressable>
            <Pressable onPress={onUndoCancel} style={styles.undoNo}>
              <Text style={styles.undoNoText}>{t('common.no')}</Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {isMissed ? (
        <Pressable onPress={onLateValidate} style={styles.lateBtn}>
          <Text style={styles.lateBtnText}>{t('today.lateValidate')}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  card: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.md + 4,
    overflow: 'hidden',
    gap: spacing.md,
  },
  cardCompleted: {
    backgroundColor: 'rgba(29, 184, 104, 0.1)',
    borderColor: 'rgba(29, 184, 104, 0.25)',
  },
  cardLocked: {
    backgroundColor: colors.surface,
    borderColor: cardBase.borderColor,
    opacity: 0.85,
  },
  lockedDim: {
    opacity: 0.45,
  },
  lockBlock: {
    alignItems: 'center',
    maxWidth: 88,
  },
  lockIcon: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  lockText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 13,
  },
  leftBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
  },
  emoji: {
    fontSize: 36,
  },
  name: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  nameDone: {
    opacity: 0.75,
    color: colors.success,
  },
  check: {
    color: colors.success,
    fontSize: 18,
    fontWeight: '700',
  },
  circleBurst: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
  },
  checkOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigCheck: {
    color: colors.success,
    fontSize: 48,
    fontWeight: '800',
  },
  undoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    marginLeft: spacing.md + 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: cardBase.borderColor,
  },
  undoText: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
  },
  undoActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  undoYes: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(232, 68, 90, 0.15)',
    borderRadius: 6,
  },
  undoYesText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  undoNo: {
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.accentSoft,
    borderRadius: 6,
  },
  undoNoText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  lateBtn: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
    marginLeft: spacing.md + 4,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    backgroundColor: 'rgba(232, 68, 90, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(232, 68, 90, 0.35)',
  },
  lateBtnText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
});
