import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageHeader } from '../components/PageHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import {
  DEFAULT_HABIT_COLOR,
  HABIT_COLOR_OPTIONS,
} from '../constants/habitColors';
import { cardBase, cardBorder, colors, spacing, typography } from '../constants/theme';
import { getCreateSteps } from '../i18n';
import { useTranslation } from '../i18n/useTranslation';
import { requestNotificationPermissions } from '../services/notifications';
import { useHabitStore } from '../store/habitStore';
import type { HabitCategory, HabitDraft, WeekDay } from '../types/habit';
import { getCategories } from '../utils/categories';
import { getWeekDayFull } from '../utils/date';

const EMOJI_OPTIONS = [
  '💪', '🏃', '📚', '🧘', '💧', '🥗', '😴', '✍️',
  '🎯', '🎸', '🧹', '💊', '🚭', '📵', '🌅', '❤️',
];

const DEFAULT_DAYS: WeekDay[] = [1, 2, 3, 4, 5];

export function CreateScreen() {
  const insets = useSafeAreaInsets();
  const { t, locale } = useTranslation();
  const addHabit = useHabitStore((s) => s.addHabit);

  const steps = useMemo(() => getCreateSteps(), [locale]);
  const categories = useMemo(() => getCategories(), [locale]);
  const weekDayFull = useMemo(() => getWeekDayFull(), [locale]);

  const [step, setStep] = useState<number>(0);
  const [emoji, setEmoji] = useState<string>('💪');
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<HabitCategory>('sport');
  const [color, setColor] = useState<string>(DEFAULT_HABIT_COLOR);
  const [reminderTime, setReminderTime] = useState<string>('08:00');
  const [daysOfWeek, setDaysOfWeek] = useState<WeekDay[]>(DEFAULT_DAYS);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const toggleDay = (day: WeekDay): void => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const next = (): void => {
    if (step === 1 && !name.trim()) {
      setError(t('create.errors.nameRequired'));
      return;
    }
    if (step === 2 && daysOfWeek.length === 0) {
      setError(t('create.errors.daysRequired'));
      return;
    }
    setError('');
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const back = (): void => {
    setError('');
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleCreate = async (): Promise<void> => {
    if (!name.trim()) {
      setError(t('create.errors.nameRequired'));
      return;
    }
    if (notificationsEnabled) {
      await requestNotificationPermissions();
    }
    const draft: HabitDraft = {
      emoji,
      name: name.trim(),
      category,
      color,
      reminderTime,
      daysOfWeek,
      notificationsEnabled,
    };
    await addHabit(draft);
    setStep(0);
    setName('');
    setEmoji('💪');
    setCategory('sport');
    setColor(DEFAULT_HABIT_COLOR);
    setReminderTime('08:00');
    setDaysOfWeek(DEFAULT_DAYS);
    setNotificationsEnabled(true);
    setError('');
  };

  const catLabel = categories.find((c) => c.id === category)?.label ?? category;
  const daysLabel = weekDayFull
    .filter((d) => daysOfWeek.includes(d.day as WeekDay))
    .map((d) => d.label)
    .join(', ');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.sm,
        paddingBottom: insets.bottom + 100,
        paddingHorizontal: spacing.md,
      }}
      showsVerticalScrollIndicator={false}
    >
      <PageHeader title={t('create.title')} />

      <Text style={styles.stepLabel}>
        {t('create.stepLabel', {
          current: step + 1,
          total: steps.length,
          name: steps[step] ?? '',
        })}
      </Text>

      <View style={styles.stepContent}>
        {step === 0 && (
          <View style={styles.emojiGrid}>
            {EMOJI_OPTIONS.map((e) => (
              <Pressable key={e} onPress={() => setEmoji(e)}>
                <Text style={[styles.emojiLarge, emoji === e && styles.emojiSelected]}>
                  {e}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {step === 1 && (
          <>
            <Text style={styles.fieldLabel}>{t('create.name')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('create.namePlaceholder')}
              placeholderTextColor={colors.textSecondary}
              maxLength={60}
            />
            <Text style={styles.fieldLabel}>{t('create.category')}</Text>
            <View style={styles.catRow}>
              {categories.map((c) => (
                <Pressable key={c.id} onPress={() => setCategory(c.id)}>
                  <Text
                    style={[
                      styles.catText,
                      category === c.id && styles.catTextActive,
                    ]}
                  >
                    {c.emoji} {c.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.fieldLabel}>{t('create.color')}</Text>
            <View style={styles.colorRow}>
              {HABIT_COLOR_OPTIONS.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setColor(c.hex)}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c.hex },
                    color === c.hex && styles.colorDotActive,
                  ]}
                />
              ))}
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.fieldLabel}>{t('create.time')}</Text>
            <TextInput
              style={styles.input}
              value={reminderTime}
              onChangeText={setReminderTime}
              placeholder={t('create.timePlaceholder')}
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.fieldLabel}>{t('create.days')}</Text>
            <View style={styles.daysRow}>
              {weekDayFull.map(({ day, label }) => {
                const weekDay = day as WeekDay;
                const active = daysOfWeek.includes(weekDay);
                return (
                  <Pressable key={day} onPress={() => toggleDay(weekDay)}>
                    <Text style={[styles.dayText, active && styles.dayActive]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {step === 3 && (
          <View style={styles.notifRow}>
            <View style={styles.notifText}>
              <Text style={styles.notifTitle}>{t('create.notifications')}</Text>
              <Text style={styles.notifSub}>
                {t('create.reminderAt', { time: reminderTime })}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.ringTrack, true: colors.accentSoft }}
              thumbColor={colors.white}
            />
          </View>
        )}

        {step === 4 && (
          <View style={styles.preview}>
            <View style={[styles.previewBar, { backgroundColor: color }]} />
            <Text style={styles.previewEmoji}>{emoji}</Text>
            <Text style={styles.previewName}>{name || '—'}</Text>
            <Text style={styles.previewLine}>{catLabel}</Text>
            <Text style={styles.previewLine}>{reminderTime}</Text>
            <Text style={styles.previewLine}>{daysLabel}</Text>
            <Text style={styles.previewLine}>
              {notificationsEnabled
                ? t('create.previewNotificationsOn')
                : t('create.previewNotificationsOff')}
            </Text>
          </View>
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.actions}>
        {step > 0 ? (
          <Pressable onPress={back} style={styles.backBtn}>
            <Text style={styles.backText}>{t('common.back')}</Text>
          </Pressable>
        ) : null}
        {step < steps.length - 1 ? (
          <PrimaryButton label={t('common.next')} onPress={next} style={styles.actionBtn} />
        ) : (
          <PrimaryButton
            label={t('create.createHabit')}
            onPress={() => void handleCreate()}
            style={styles.actionBtn}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stepLabel: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  stepContent: {
    ...cardBase,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 180,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  emojiLarge: {
    fontSize: 32,
    opacity: 0.4,
  },
  emojiSelected: {
    opacity: 1,
  },
  fieldLabel: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 10,
    padding: spacing.md,
    color: colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: cardBorder,
    marginBottom: spacing.lg,
  },
  catRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  catText: {
    ...typography.body,
    opacity: 0.4,
  },
  catTextActive: {
    color: colors.text,
    opacity: 1,
    fontWeight: '600',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorDotActive: {
    borderWidth: 2,
    borderColor: colors.white,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  dayText: {
    ...typography.body,
    opacity: 0.35,
  },
  dayActive: {
    color: colors.text,
    opacity: 1,
    fontWeight: '600',
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifText: {
    flex: 1,
  },
  notifTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  notifSub: {
    ...typography.caption,
    marginTop: 2,
  },
  preview: {
    alignItems: 'flex-start',
    overflow: 'hidden',
    width: '100%',
  },
  previewBar: {
    position: 'absolute',
    left: -spacing.md,
    top: -spacing.md,
    bottom: -spacing.md,
    width: 3,
  },
  previewEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  previewName: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.4,
    marginBottom: spacing.sm,
  },
  previewLine: {
    ...typography.body,
    marginTop: 4,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  actions: {
    gap: spacing.sm,
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  backText: {
    ...typography.caption,
    color: colors.text,
  },
  actionBtn: {
    width: '100%',
  },
});
