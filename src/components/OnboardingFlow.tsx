import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ONBOARDING_PROFILES,
  ONBOARDING_STORAGE_KEY,
  ONBOARDING_SUGGESTIONS,
  type OnboardingProfile,
} from '../constants/onboarding';
import { cardBase, colors, spacing, typography } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import { useHabitStore } from '../store/habitStore';
import type { HabitDraft } from '../types/habit';
import { PrimaryButton } from './PrimaryButton';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const addHabits = useHabitStore((s) => s.addHabits);

  const [screen, setScreen] = useState<1 | 2>(1);
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const suggestions = profile ? ONBOARDING_SUGGESTIONS[profile] : [];

  const pickProfile = (id: OnboardingProfile): void => {
    setProfile(id);
    const keys = ONBOARDING_SUGGESTIONS[id].map((s) => s.key);
    setSelectedKeys(new Set(keys));
  };

  const toggleHabit = (key: string): void => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const selectedHabits = suggestions.filter((s) => selectedKeys.has(s.key));
  const streakDays = selectedHabits.length;

  const planReadyText = useMemo(() => {
    if (streakDays === 0) {
      return t('onboarding.planEmpty');
    }
    return streakDays === 1
      ? t('onboarding.planReady', { count: 1 })
      : t('onboarding.planReady_plural', { count: streakDays });
  }, [streakDays, t]);

  const finish = async (): Promise<void> => {
    if (selectedHabits.length > 0) {
      const drafts: HabitDraft[] = selectedHabits.map((s) => ({
        ...s.draft,
        name: t(`onboarding.suggestions.${s.key}`),
        notificationsEnabled: false,
      }));
      await addHabits(drafts);
    }
    await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    onComplete();
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {screen === 1 ? (
          <>
            <Text style={styles.welcome}>{t('onboarding.welcome')}</Text>
            <Text style={styles.question}>{t('onboarding.question')}</Text>

            <View style={styles.profileGrid}>
              {ONBOARDING_PROFILES.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => pickProfile(p.id)}
                  style={[
                    styles.profileCard,
                    profile === p.id && styles.profileCardActive,
                  ]}
                >
                  <Text style={styles.profileEmoji}>{p.emoji}</Text>
                  <Text
                    style={[
                      styles.profileLabel,
                      profile === p.id && styles.profileLabelActive,
                    ]}
                  >
                    {t(`onboarding.profiles.${p.id}`)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {profile ? (
              <>
                <Text style={styles.suggestTitle}>{t('onboarding.suggested')}</Text>
                {suggestions.map((s) => {
                  const active = selectedKeys.has(s.key);
                  return (
                    <Pressable
                      key={s.key}
                      onPress={() => toggleHabit(s.key)}
                      style={[styles.habitRow, active && styles.habitRowActive]}
                    >
                      <Text style={styles.habitEmoji}>{s.draft.emoji}</Text>
                      <Text style={styles.habitName}>
                        {t(`onboarding.suggestions.${s.key}`)}
                      </Text>
                      <Text style={styles.habitCheck}>{active ? '✓' : '○'}</Text>
                    </Pressable>
                  );
                })}
              </>
            ) : null}

            <PrimaryButton
              label={t('onboarding.continue')}
              onPress={() => setScreen(2)}
              style={styles.cta}
              disabled={!profile}
            />
          </>
        ) : (
          <>
            <Text style={styles.welcome}>{t('onboarding.planTitle')}</Text>
            <Text style={styles.question}>{planReadyText}</Text>

            {selectedHabits.map((s) => (
              <View key={s.key} style={styles.recapRow}>
                <Text style={styles.habitEmoji}>{s.draft.emoji}</Text>
                <Text style={styles.habitName}>
                  {t(`onboarding.suggestions.${s.key}`)}
                </Text>
              </View>
            ))}

            <PrimaryButton
              label={t('onboarding.start')}
              onPress={() => void finish()}
              style={styles.cta}
            />

            <Pressable onPress={() => setScreen(1)} style={styles.backLink}>
              <Text style={styles.backText}>{t('common.back')}</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  scroll: {
    flexGrow: 1,
  },
  welcome: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },
  question: {
    ...typography.body,
    fontSize: 17,
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  profileGrid: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  profileCard: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  profileCardActive: {
    borderColor: colors.accent,
    borderWidth: 1,
  },
  profileEmoji: {
    fontSize: 28,
  },
  profileLabel: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  profileLabelActive: {
    color: colors.text,
    fontWeight: '600',
  },
  suggestTitle: {
    ...typography.sectionTitle,
    marginBottom: spacing.md,
  },
  habitRow: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    opacity: 0.5,
  },
  habitRowActive: {
    opacity: 1,
    borderColor: colors.accentSoft,
    borderWidth: 1,
  },
  habitEmoji: {
    fontSize: 24,
  },
  habitName: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  habitCheck: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '600',
  },
  recapRow: {
    ...cardBase,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  cta: {
    marginTop: spacing.lg,
    width: '100%',
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  backText: {
    ...typography.caption,
    color: colors.text,
  },
});
