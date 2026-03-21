// Design system - Animation configurations
export const ANIMATIONS = {
  // Durations (ms)
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  // Curves/Easing
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// Reanimated animation configs
export const REANIMATED_CONFIG = {
  // Standard spring for UI elements
  spring: {
    damping: 10,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
  },
  // Smooth easing for progress rings
  timing: {
    duration: 800,
    useNativeDriver: true,
  },
} as const;
