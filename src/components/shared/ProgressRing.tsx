import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../../design/colors';
import { TEXT_STYLES } from '../../design/text';
import { SPACING, RADIUS } from '../../design/spacing';

interface ProgressRingProps {
  percentage: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  completed?: number;
  total?: number;
}

const ProgressRing = ({
  percentage,
  size = 'md',
  completed = 0,
  total = 0,
}: ProgressRingProps) => {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(percentage, {
      duration: 800,
    });
    setDisplayPercentage(percentage);
  }, [percentage]);

  const sizeConfig = {
    sm: { size: 80, fontSize: 24 },
    md: { size: 120, fontSize: 36 },
    lg: { size: 160, fontSize: 48 },
  }[size];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: COLORS.accent.violet,
    };
  });

  const circumference = 314; // 2 * π * 50 (approx for visual reference)

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.ring,
          {
            width: sizeConfig.size,
            height: sizeConfig.size,
            borderRadius: sizeConfig.size / 2,
          },
          animatedStyle,
        ]}
      >
        {/* Background circuit */}
        <View
          style={[
            styles.ringInner,
            {
              width: sizeConfig.size - 16,
              height: sizeConfig.size - 16,
              borderRadius: (sizeConfig.size - 16) / 2,
            },
          ]}
        />
      </View>

      <View style={styles.overlay}>
        <Text
          style={[
            styles.percentage,
            { fontSize: sizeConfig.fontSize },
          ]}
        >
          {displayPercentage}%
        </Text>
        {total > 0 && (
          <Text style={styles.count}>
            {completed}/{total}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.lg,
  },
  ring: {
    borderWidth: 6,
    borderColor: COLORS.accent.violet,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    shadowColor: COLORS.accent.violet,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  ringInner: {
    backgroundColor: COLORS.background.primary,
  },
  overlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    color: COLORS.accent.violet,
    fontWeight: '700',
  },
  count: {
    ...TEXT_STYLES.bodySm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
});

export default ProgressRing;
