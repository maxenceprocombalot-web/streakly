import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const COLORS = ['#7c6dfa', '#22c97a', '#f59e0b', '#ec4899', '#3b82f6', '#e8445a'];
const COUNT = 40;

interface ConfettiPiece {
  startX: number;
  drift: number;
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  color: string;
  size: number;
}

function createPieces(): ConfettiPiece[] {
  return Array.from({ length: COUNT }, () => {
    const startX = Math.random() * SCREEN_W;
    return {
      startX,
      drift: (Math.random() - 0.5) * 120,
      x: new Animated.Value(startX),
      y: new Animated.Value(-20),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(1),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
    };
  });
}

interface ConfettiAnimationProps {
  active: boolean;
}

export function ConfettiAnimation({ active }: ConfettiAnimationProps) {
  const pieces = useRef<ConfettiPiece[]>(createPieces()).current;

  useEffect(() => {
    if (!active) {
      return;
    }

    const animations = pieces.map((p) => {
      p.x.setValue(p.startX);
      p.y.setValue(-20 - Math.random() * 100);
      p.rotate.setValue(0);
      p.opacity.setValue(1);

      return Animated.parallel([
        Animated.timing(p.y, {
          toValue: SCREEN_H + 50,
          duration: 2000 + Math.random() * 1500,
          useNativeDriver: true,
        }),
        Animated.timing(p.x, {
          toValue: p.startX + p.drift,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(p.rotate, {
          toValue: Math.random() * 6,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(1800),
          Animated.timing(p.opacity, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.stagger(30, animations).start();
  }, [active, pieces]);

  if (!active) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.piece,
            {
              backgroundColor: p.color,
              width: p.size,
              height: p.size * 0.6,
              opacity: p.opacity,
              transform: [
                { translateX: p.x },
                { translateY: p.y },
                {
                  rotate: p.rotate.interpolate({
                    inputRange: [0, 6],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  piece: {
    position: 'absolute',
    borderRadius: 2,
  },
});
