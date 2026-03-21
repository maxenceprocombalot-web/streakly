import { TextStyle } from 'react-native';

// Design system - Typography tokens
export const TEXT_STYLES: { [key: string]: TextStyle } = {
  // Display / Hero
  display: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
    letterSpacing: -1,
  },
  // Heading 1
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  // Heading 2
  h2: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
  // Heading 3
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  // Body - Large
  bodyLg: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
  },
  // Body - Medium
  bodyMd: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  // Body - Small
  bodySm: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  // Label - Large
  labelLg: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  // Label - Medium
  labelMd: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  // Label - Small
  labelSm: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  // Caption
  caption: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
};

// Font families (using system fonts as fallback)
export const FONTS = {
  title: 'System', // Would be "Syne" in production
  body: 'System',  // System sans-serif
};
