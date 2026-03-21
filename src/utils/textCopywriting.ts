// Copywriting and motivational messages

const DAILY_QUOTES = [
  'Les champions ne sont jamais nés. Ils ont été forged.',
  'Laisse les résultats parler plus fort que les mots.',
  'Chaque jour est une nouvelle chance de performer.',
  'La discipline est la différence entre qui tu es et qui tu veux être.',
  'Ton futur toi dépend des choix d\'aujourd\'hui.',
  'La constance est la clé.',
  'Des habits, c\'est juste 1% chacun.',
  'Tu te lèves à 5h du matin. Tu ne plaisantes pas.',
];

const COMPLETION_MESSAGES = [
  '🔥 Encore un pas forward.',
  '💪 C\'est ça qui s\'appelle prendre du momentum.',
  '✨ Tu es en feu aujourd\'hui.',
  '🎯 C\'est exactement ce qui était prévu.',
  '⚡ Streak maintenu. Bravo.',
  '🏆 Champion move.',
  '🚀 La machine tourne rond.',
  '💯 Parfait. Zéro compromis.',
];

const STREAK_MESSAGES = {
  first: '🔥 Jour 1 du changement commence maintenant.',
  week: 'Une semaine. Ça montre de la sérieux.',
  month: 'Un mois. À ce stade, c\'est un habit maintenant.',
  twoMonth: 'Deux mois. Tu es un animal accompli.',
  threeMonth: 'Trois mois. Les résultats vont bientôt être visibles.',
  sixMonth: 'Six mois. C\'est décider à haut niveau.',
  year: '🔥 UN AN 🔥 Tu n\'es pas une personne normale.',
};

const MOTIVATION_BY_COMPLETION_RATE = {
  low: 'Allez, relance la machine 💪',
  medium: 'Tu construis quelque chose d\'important ⚡',
  high: 'Tu es en feu cette semaine 🔥',
  onFire: 'Incroyable. Tu es inarrêtable 🚀',
};

export const copywriting = {
  getRandomQuote(): string {
    return DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)];
  },

  getCompletionMessage(): string {
    return COMPLETION_MESSAGES[Math.floor(Math.random() * COMPLETION_MESSAGES.length)];
  },

  getStreakMessage(days: number): string {
    if (days === 1) return STREAK_MESSAGES.first;
    if (days === 7) return STREAK_MESSAGES.week;
    if (days === 30) return STREAK_MESSAGES.month;
    if (days === 60) return STREAK_MESSAGES.twoMonth;
    if (days === 90) return STREAK_MESSAGES.threeMonth;
    if (days === 180) return STREAK_MESSAGES.sixMonth;
    if (days === 365) return STREAK_MESSAGES.year;
    return `🔥 ${days} jours. Impressionnant.`;
  },

  getMotivationByCompletionRate(rate: number): string {
    if (rate < 30) return MOTIVATION_BY_COMPLETION_RATE.low;
    if (rate < 60) return MOTIVATION_BY_COMPLETION_RATE.medium;
    if (rate < 90) return MOTIVATION_BY_COMPLETION_RATE.high;
    return MOTIVATION_BY_COMPLETION_RATE.onFire;
  },

  getCategoryDescription(category: string): string {
    const descriptions: { [key: string]: string } = {
      Sport: 'Prendre soin de ton corps',
      Nutrition: 'Manger pour performer',
      Développement: 'Apprendre en continu',
      Études: 'Investir dans ton potentiel',
      Méditation: 'Calmer ton mental',
      Créativité: 'Exprimer tes idées',
      'Bien-être': 'Prendre soin de toi',
      Productivité: 'Avancer sur tes objectifs',
    };
    return descriptions[category] || '';
  },

  getHabitSuggestions(category: string): string[] {
    const suggestions: { [key: string]: string[] } = {
      Sport: [
        '💪 Séance de gym',
        '🏃 Courir',
        '🧘 Yoga',
        '🚴 Cyclisme',
        '🏊 Natation',
      ],
      Nutrition: [
        '🥗 Manger des légumes',
        '💧 Boire 3L d\'eau',
        '🍎 Fruit frais',
        '🥤 Smoothie protéiné',
        '🍽️ Repas sain',
      ],
      Développement: [
        '📚 Lire un chapitre',
        '📖 Podcast de croissance',
        '💻 Apprendre une skill',
        '🎓 Cours en ligne',
        '📝 Prendre des notes',
      ],
      Études: [
        '✏️ Étudier 1h',
        '📐 Maths',
        '🔬 Sciences',
        '📚 Réviser',
        '✍️ Écrire un essai',
      ],
      Méditation: [
        '🧘 10 min de méditation',
        '🌬️ Respiration',
        '🎵 Méditation guidée',
        '📿 Pleine conscience',
        '🕯️ Moment de calm',
      ],
      Créativité: [
        '🎨 Dessiner',
        '✒️ Écrire',
        '🎵 Composer',
        '📸 Photographie',
        '🎭 Créer quelque chose',
      ],
      'Bien-être': [
        '💆 Se relaxer',
        '🛁 Bain/douche',
        '🌿 Self-care',
        '💅 Prenez soin',
        '😴 Bon sommeil',
      ],
      Productivité: [
        '📋 Planifier ta journée',
        '⚡ Deep work',
        '🎯 Compléter une task',
        '📧 Inbox zéro',
        '📊 Tracker le progrès',
      ],
    };
    return suggestions[category] || [];
  },
};
