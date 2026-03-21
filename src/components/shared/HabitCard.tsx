import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, COLORS_CATEGORIES } from '../../design/colors';
import { TEXT_STYLES } from '../../design/text';
import { SPACING, RADIUS } from '../../design/spacing';
import { formatTime } from '../../utils/dateUtils';

interface HabitCardProps {
  emoji: string;
  name: string;
  category: string;
  scheduledTime: string; // "HH:mm"
  isCompleted: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const HabitCard = ({
  emoji,
  name,
  category,
  scheduledTime,
  isCompleted,
  onPress,
  style,
}: HabitCardProps) => {
  const borderColor = isCompleted ? COLORS.accent.green : COLORS.accent.red;
  const backgroundColor = isCompleted
    ? 'rgba(34,201,122,0.05)'
    : COLORS.background.surface;

  const categoryColor =
    COLORS_CATEGORIES[category as keyof typeof COLORS_CATEGORIES] ||
    COLORS.accent.violet;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          borderLeftColor: borderColor,
          backgroundColor,
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{emoji}</Text>
          <View style={styles.titleSection}>
            <Text style={styles.name} numberOfLines={2}>
              {name}
            </Text>
            <View style={styles.meta}>
              <View
                style={[
                  styles.categoryBadge,
                  { backgroundColor: categoryColor },
                ]}
              >
                <Text style={styles.categoryText}>{category}</Text>
              </View>
              <Text style={styles.time}>{formatTime(scheduledTime)}</Text>
            </View>
          </View>
        </View>

        {isCompleted && (
          <View style={styles.completedIndicator}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderLeftColor: COLORS.accent.red,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  emoji: {
    fontSize: 28,
    marginTop: SPACING.sm,
  },
  titleSection: {
    flex: 1,
  },
  name: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  categoryText: {
    ...TEXT_STYLES.labelSm,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  time: {
    ...TEXT_STYLES.bodySm,
    color: COLORS.text.secondary,
  },
  completedIndicator: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accent.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.md,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
});

export default HabitCard;
