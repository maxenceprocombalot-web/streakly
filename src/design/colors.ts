// Design system - Color tokens for Streakly
export const COLORS = {
  // Backgrounds
  background: {
    primary: '#0d0f14',     // Main dark background
    surface: '#161921',     // Card surfaces
    elevated: '#1e2230',    // Elevated surfaces (bottom sheet, modals)
  },
  // Accents
  accent: {
    violet: '#6c63ff',      // Primary accent (buttons, highlights)
    green: '#22c97a',       // Success/completion
    red: '#ff4d6a',         // Danger/incomplete
    orange: '#ff8c3b',      // Streak/fire
    yellow: '#ffd060',      // Warning
  },
  // Text
  text: {
    primary: '#eef0f7',     // Main text
    secondary: '#7a8099',   // Secondary/muted text
  },
  // Borders
  border: 'rgba(255,255,255,0.07)',
} as const;

export const COLORS_CATEGORIES = {
  Sport: '#ff6b6b',
  Nutrition: '#51cf66',
  Développement: '#4c6ef5',
  Études: '#ffa94d',
  Méditation: '#b197fc',
  Créativité: '#76c7c0',
  'Bien-être': '#ffd43b',
  Productivité: '#748ffc',
} as const;
