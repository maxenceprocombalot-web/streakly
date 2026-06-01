import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

/** Tokens Streakly — sombre, épuré */
export const colors = {
  background: '#080a0e',
  surface: '#0f1117',
  surfaceElevated: '#141720',
  accent: '#7c6dfa',
  accentSoft: 'rgba(124, 109, 250, 0.18)',
  success: '#1db868',
  danger: '#e8445a',
  orange: '#f07830',
  text: '#f0f2fa',
  textSecondary: '#565d7a',
  ringTrack: '#1a1d26',
  white: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.75)',
} as const;

export const cardBorder = 'rgba(255, 255, 255, 0.05)' as const;

/** Padding standard 24px */
export const spacing = {
  xs: 8,
  sm: 12,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

export const radius = {
  sm: 8,
  button: 10,
  card: 12,
  pill: 14,
  full: 999,
} as const;

export const typography = {
  pageTitle: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: colors.text,
    letterSpacing: -1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.textSecondary,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    fontWeight: '400' as const,
  },
};

export const cardBase: ViewStyle = {
  backgroundColor: colors.surface,
  borderRadius: radius.card,
  borderWidth: 1,
  borderColor: cardBorder,
};

export const primaryButtonText: TextStyle = {
  color: colors.white,
  fontSize: 16,
  fontWeight: '600',
};

export const sharedStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenPadding: {
    paddingHorizontal: spacing.md,
  },
  pageTitle: typography.pageTitle,
  sectionTitle: typography.sectionTitle,
  body: typography.body,
  card: cardBase,
});
