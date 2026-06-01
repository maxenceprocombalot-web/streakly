import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const RING_SIZE = 160;
const STROKE = 4;
const R = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

interface ProgressRingProps {
  progress: number;
  doneCount: number;
  totalCount: number;
  accentColor?: string;
}

export function ProgressRing({
  progress,
  doneCount,
  totalCount,
  accentColor = colors.accent,
}: ProgressRingProps) {
  const { t } = useTranslation();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const clamped = Math.min(100, Math.max(0, progress));
    Animated.timing(progressAnim, {
      toValue: clamped,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const displayPercent = Math.round(progress);

  return (
    <View style={styles.block}>
      <View style={styles.wrapper}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={R}
            stroke={colors.ringTrack}
            strokeWidth={STROKE}
            fill="none"
          />
          <AnimatedCircle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={R}
            stroke={accentColor}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
          />
        </Svg>
        <View style={styles.label}>
          <Text style={styles.percent}>{displayPercent}%</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        {t('today.progressHabits', { done: doneCount, total: totalCount })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
  },
  wrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '500',
    marginTop: 16,
    letterSpacing: -0.2,
  },
});
