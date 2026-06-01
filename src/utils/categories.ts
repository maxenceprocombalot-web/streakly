import type { HabitCategory } from '../types/habit';
import { t } from '../i18n';

const CATEGORY_EMOJIS: Record<HabitCategory, string> = {
  sport: '🏃',
  sante: '💊',
  productivite: '🎯',
  esprit: '🧘',
  autre: '✨',
};

export function getCategories(): { id: HabitCategory; label: string; emoji: string }[] {
  const ids: HabitCategory[] = ['sport', 'sante', 'productivite', 'esprit', 'autre'];
  return ids.map((id) => ({
    id,
    label: t(`categories.${id}`),
    emoji: CATEGORY_EMOJIS[id],
  }));
}

export function getCategoryLabel(id: HabitCategory): string {
  return t(`categories.${id}`);
}
