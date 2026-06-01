import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '../constants/theme';
import { RING_SIZE } from './ProgressRing';

const STROKE = 4;
const R = (RING_SIZE - STROKE) / 2;

interface PulsingEmptyRingProps {
  color?: string;
}

/** Anneau vide avec pulse doux pour l'état sans habitudes */
export function PulsingEmptyRing({ color = colors.accent }: PulsingEmptyRingProps) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale: pulse }] }]}>
      <Svg width={RING_SIZE} height={RING_SIZE}>
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={R}
          stroke={color}
          strokeWidth={STROKE}
          fill="none"
          opacity={0.35}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
