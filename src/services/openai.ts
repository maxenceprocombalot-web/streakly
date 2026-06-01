import {
  getCoachDemoResponse,
  i18n,
  t,
  type AppLocale,
} from '../i18n';
import type { Completion, Habit } from '../types/habit';
import { startOfToday } from '../utils/date';
import { getHabitWeekRate } from '../utils/stats';
import { getCurrentStreak } from '../utils/streak';

const DEMO_PLACEHOLDER_KEY = 'sk-ta-clé-ici';

const SYSTEM_PROMPTS: Record<AppLocale, string> = {
  fr: "Tu es un coach haute performance qui analyse les habitudes d'un utilisateur. Ton ton est direct, motivant, jamais condescendant. Réponds en français en maximum 3 paragraphes courts.",
  en: 'You are a high-performance coach analyzing a user\'s habits. Your tone is direct, motivating, never condescending. Respond in English in at most 3 short paragraphs.',
};

export interface CoachAnalysisResult {
  content: string;
  isDemo: boolean;
}

export function isCoachDemoMode(): boolean {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_KEY;
  return !apiKey || apiKey === DEMO_PLACEHOLDER_KEY;
}

function buildUserPrompt(
  habits: Habit[],
  completions: Completion[],
  currentStreak: number,
): string {
  const today = startOfToday();
  const locale = i18n.locale as AppLocale;
  const lines = habits.map((h) => {
    const rate = getHabitWeekRate(h.id, h, completions, today);
    if (locale === 'fr') {
      return `- ${h.emoji} ${h.name} : ${rate}% sur les 7 derniers jours`;
    }
    return `- ${h.emoji} ${h.name}: ${rate}% over the last 7 days`;
  });

  const header =
    locale === 'fr'
      ? `Streak global actuel : ${currentStreak} jours.`
      : `Current overall streak: ${currentStreak} days.`;
  const habitsHeader =
    locale === 'fr'
      ? 'Habitudes et taux de complétion (7 derniers jours) :'
      : 'Habits and completion rate (last 7 days):';
  const ask =
    locale === 'fr'
      ? 'Analyse ma semaine et donne-moi 2-3 conseils concrets pour progresser.'
      : 'Analyze my week and give me 2-3 concrete tips to improve.';

  return [header, '', habitsHeader, ...lines, '', ask].join('\n');
}

export async function analyzeWeekWithCoach(
  habits: Habit[],
  completions: Completion[],
  jokerSavedDate: string | null,
): Promise<CoachAnalysisResult> {
  if (isCoachDemoMode()) {
    return { content: getCoachDemoResponse(), isDemo: true };
  }

  const apiKey = process.env.EXPO_PUBLIC_OPENAI_KEY!;
  const currentStreak = getCurrentStreak(completions, jokerSavedDate);
  const userPrompt = buildUserPrompt(habits, completions, currentStreak);
  const locale = i18n.locale as AppLocale;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS[locale] },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error: ${response.status} — ${err}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error(t('coach.emptyResponse'));
  }

  return { content, isDemo: false };
}
