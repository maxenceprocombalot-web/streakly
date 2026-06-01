import { Modal, Pressable, Share, StyleSheet, Text, View } from 'react-native';

import { cardBase, colors, spacing, typography } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import type { Habit } from '../types/habit';
import { getShareChallengeMessage } from '../utils/challenges';
import { ConfettiAnimation } from './ConfettiAnimation';
import { PrimaryButton } from './PrimaryButton';

interface ChallengeCelebrationModalProps {
  visible: boolean;
  habit: Habit | null;
  onClose: () => void;
}

export function ChallengeCelebrationModal({
  visible,
  habit,
  onClose,
}: ChallengeCelebrationModalProps) {
  const { t } = useTranslation();

  if (!habit) {
    return null;
  }

  const handleShare = async (): Promise<void> => {
    await Share.share({
      message: getShareChallengeMessage(habit.name),
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <ConfettiAnimation active={visible} />
        <View style={styles.card}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.title}>{t('challenges.celebrationTitle')}</Text>
          <Text style={styles.sub}>
            {t('challenges.celebrationBody', { emoji: habit.emoji, name: habit.name })}
          </Text>
          <PrimaryButton
            label={t('common.share')}
            onPress={() => void handleShare()}
            style={styles.btn}
          />
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>{t('common.close')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  card: {
    ...cardBase,
    width: '100%',
    padding: spacing.lg,
    alignItems: 'center',
    zIndex: 101,
  },
  trophy: {
    fontSize: 56,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  sub: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  btn: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  closeBtn: {
    paddingVertical: spacing.sm,
  },
  closeText: {
    ...typography.caption,
    color: colors.text,
  },
});
