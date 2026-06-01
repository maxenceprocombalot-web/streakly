import { useEffect, useMemo, useRef } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { cardBase, colors, spacing } from '../constants/theme';
import {
  getDayNavigationRange,
  isFutureDay,
  isSameDay,
  isToday,
  toDateKey,
} from '../utils/date';

const CHIP = 52;
const GAP = spacing.sm;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface WeekDayBarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function WeekDayBar({ selectedDate, onSelectDate }: WeekDayBarProps) {
  const scrollRef = useRef<ScrollView>(null);
  const hasInitialScroll = useRef(false);

  const days = useMemo(() => getDayNavigationRange(), []);

  const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const scrollToDate = (date: Date, animated: boolean): void => {
    const allDays = getDayNavigationRange();
    const index = allDays.findIndex((d) => isSameDay(d, date));
    if (index < 0 || !scrollRef.current) {
      return;
    }
    const chipStride = CHIP + GAP;
    const visibleWidth = SCREEN_WIDTH - spacing.md * 2;
    const x = Math.max(
      0,
      index * chipStride - visibleWidth / 2 + CHIP / 2,
    );
    scrollRef.current.scrollTo({ x, animated });
  };

  useEffect(() => {
    scrollToDate(selectedDate, hasInitialScroll.current);
    hasInitialScroll.current = true;
  }, [selectedDate]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {days.map((date) => {
        const selected = isSameDay(date, selectedDate);
        const todayChip = isToday(date);
        const future = isFutureDay(date);
        const key = toDateKey(date);

        return (
          <Pressable
            key={key}
            onPress={() => onSelectDate(date)}
            style={[
              styles.chip,
              selected && styles.chipSelected,
              todayChip && !selected && styles.chipToday,
              future && !selected && styles.chipFuture,
            ]}
          >
            <Text
              style={[
                styles.dayName,
                selected && styles.textActive,
                future && !selected && styles.futureText,
              ]}
            >
              {dayNames[date.getDay()]}
            </Text>
            <Text
              style={[
                styles.dayNum,
                selected && styles.textActive,
                future && !selected && styles.futureText,
              ]}
            >
              {date.getDate()}
            </Text>
          </Pressable>
        );
      })}
      {/* Espace à droite pour voir le dernier jour (ex. 1er du mois suivant) */}
      <View style={styles.trailingSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingBottom: spacing.md,
    gap: GAP,
    paddingLeft: 0,
  },
  chip: {
    width: CHIP,
    height: CHIP,
    borderRadius: 12,
    ...cardBase,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipToday: {
    borderColor: colors.accentSoft,
    borderWidth: 1,
  },
  chipFuture: {
    opacity: 0.6,
  },
  dayName: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  dayNum: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  futureText: {
    color: colors.textSecondary,
  },
  textActive: {
    color: colors.white,
  },
  trailingSpacer: {
    width: SCREEN_WIDTH - CHIP - spacing.md * 2,
  },
});
