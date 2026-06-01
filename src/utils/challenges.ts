import { t } from '../i18n';
import type { Challenge } from '../types/challenge';
import type { Completion, Habit } from '../types/habit';
import { addDays, parseDateKey, startOfToday, toDateKey } from './date';

export const CHALLENGE_DURATION = 30;
export const MAX_ACTIVE_CHALLENGES = 3;

export interface ChallengeProgress {
  challenge: Challenge;
  habit: Habit;
  completedDays: number;
  daysRemaining: number;
  progress: number;
  isComplete: boolean;
}

function isChallengeDayCompleted(
  habitId: string,
  date: Date,
  completions: Completion[],
): boolean {
  const key = toDateKey(date);
  return completions.some((c) => c.habitId === habitId && c.date === key);
}

/** Compte les jours complétés depuis le début du défi (max 30) */
export function countChallengeCompletedDays(
  challenge: Challenge,
  completions: Completion[],
): number {
  const start = parseDateKey(challenge.startDate);
  const today = startOfToday();
  let count = 0;

  for (let i = 0; i < CHALLENGE_DURATION; i++) {
    const day = addDays(start, i);
    if (day > today) {
      break;
    }
    if (isChallengeDayCompleted(challenge.habitId, day, completions)) {
      count += 1;
    }
  }

  return count;
}

export function getChallengeProgress(
  challenge: Challenge,
  habit: Habit,
  completions: Completion[],
): ChallengeProgress {
  const completedDays = countChallengeCompletedDays(challenge, completions);
  const isComplete = completedDays >= CHALLENGE_DURATION || challenge.completedAt !== null;
  const daysRemaining = Math.max(0, CHALLENGE_DURATION - completedDays);
  const progress = Math.min(100, (completedDays / CHALLENGE_DURATION) * 100);

  return {
    challenge,
    habit,
    completedDays,
    daysRemaining,
    progress,
    isComplete,
  };
}

export function getActiveChallenges(challenges: Challenge[]): Challenge[] {
  return challenges.filter((c) => c.completedAt === null);
}

export function canStartNewChallenge(challenges: Challenge[]): boolean {
  return getActiveChallenges(challenges).length < MAX_ACTIVE_CHALLENGES;
}

export function getShareChallengeMessage(habitName: string): string {
  return t('challenges.shareMessage', { name: habitName });
}
