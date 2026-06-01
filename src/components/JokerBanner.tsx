import { StyleSheet, Text, View } from 'react-native';

import { cardBase, colors, spacing, typography } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import { PrimaryButton } from './PrimaryButton';

interface JokerBannerProps {
  streakDays: number;
  onUseJoker: () => void;
}

export function JokerBanner({ streakDays, onUseJoker }: JokerBannerProps) {
  const { t } = useTranslation();
  const body =
    streakDays === 1
      ? t('joker.bodyOne')
      : t('joker.bodyMany', { days: streakDays });

  return (
    <View style={styles.banner}>
      <Text style={styles.emoji}>🃏</Text>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{t('joker.title')}</Text>
        <Text style={styles.sub}>{body}</Text>
      </View>
      <PrimaryButton label={t('joker.use')} onPress={onUseJoker} style={styles.btn} />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    ...cardBase,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderColor: colors.accentSoft,
    borderWidth: 1,
  },
  emoji: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  textBlock: {
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.xs,
    letterSpacing: -0.2,
  },
  sub: {
    ...typography.body,
    lineHeight: 20,
  },
  btn: {
    width: '100%',
  },
});
