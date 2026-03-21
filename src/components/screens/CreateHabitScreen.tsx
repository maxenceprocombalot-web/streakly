import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { COLORS, COLORS_CATEGORIES } from '../../design/colors';
import { TEXT_STYLES } from '../../design/text';
import { SPACING, RADIUS } from '../../design/spacing';
import { useHabitActions } from '../../hooks/useHabitActions';
import { copywriting } from '../../utils/textCopywriting';
import EmojiGrid from '../shared/EmojiGrid';
import Button from '../shared/Button';
import HabitCard from '../shared/HabitCard';
import { getTimeFromHourMinutes, getWeekDayInitial } from '../../utils/dateUtils';

type HabitCategory =
  | 'Sport'
  | 'Nutrition'
  | 'Développement'
  | 'Études'
  | 'Méditation'
  | 'Créativité'
  | 'Bien-être'
  | 'Productivité';

const CATEGORIES: HabitCategory[] = [
  'Sport',
  'Nutrition',
  'Développement',
  'Études',
  'Méditation',
  'Créativité',
  'Bien-être',
  'Productivité',
];

interface CreateHabitFormData {
  emoji: string;
  name: string;
  category: HabitCategory | null;
  scheduledTime: string;
  activeDays: boolean[];
  notificationsEnabled: boolean;
}

const CreateHabitScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateHabitFormData>({
    emoji: '💪',
    name: '',
    category: null,
    scheduledTime: '09:00',
    activeDays: [true, true, true, true, true, false, false],
    notificationsEnabled: true,
  });
  const [suggestions, setSuggestions] = useState([]);
  const { createHabit } = useHabitActions();

  const handleCategorySelect = (category: HabitCategory) => {
    setFormData({ ...formData, category });
    setSuggestions(copywriting.getHabitSuggestions(category));
  };

  const handleSuggestionSelect = (name: string) => {
    setFormData({ ...formData, name });
  };

  const handleToggleDay = (dayIndex: number) => {
    const newDays = [...formData.activeDays];
    newDays[dayIndex] = !newDays[dayIndex];
    setFormData({ ...formData, activeDays: newDays });
  };

  const handleTimeChange = (hours: number, minutes: number) => {
    const time = getTimeFromHourMinutes(hours, minutes);
    setFormData({ ...formData, scheduledTime: time });
  };

  const handleCreateHabit = async () => {
    if (!formData.category || !formData.name) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    await createHabit({
      emoji: formData.emoji,
      name: formData.name,
      category: formData.category,
      scheduledTime: formData.scheduledTime,
      activeDays: formData.activeDays,
      notificationsEnabled: formData.notificationsEnabled,
    });

    navigation.navigate('Manage');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Step counter */}
      <View style={styles.stepIndicator}>
        <Text style={styles.stepNumber}>Étape {step}/5</Text>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${(step / 5) * 100}%` }]}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: Emoji selection */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Choisis un emoji</Text>
            <Text style={styles.stepDescription}>
              Cet emoji représentera ton habitude
            </Text>
            <EmojiGrid
              selectedEmoji={formData.emoji}
              onSelect={(emoji) =>
                setFormData({ ...formData, emoji })
              }
            />
          </View>
        )}

        {/* STEP 2: Name & Category */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Nomme ton habitude</Text>
            <Text style={styles.stepDescription}>
              Quoi? Et dans quelle catégorie?
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="Nom de l'habitude"
              placeholderTextColor={COLORS.text.secondary}
              value={formData.name}
              onChangeText={(name) =>
                setFormData({ ...formData, name })
              }
            />

            <Text style={styles.categoryLabel}>Catégorie</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesList}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    formData.category === cat &&
                    styles.categoryButtonActive,
                  ]}
                  onPress={() => handleCategorySelect(cat)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      formData.category === cat &&
                      styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {suggestions.length > 0 && (
              <>
                <Text style={styles.suggestionsLabel}>Suggestions</Text>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionSelect(suggestion)}
                  >
                    <Text style={styles.suggestionText}>
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        )}

        {/* STEP 3: Time & Days */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>
              À quelle heure? Quels jours?
            </Text>
            <Text style={styles.stepDescription}>
              Construis ton plan d'action
            </Text>

            <View style={styles.timeSection}>
              <Text style={styles.label}>Heure prévue</Text>
              <View style={styles.timePickerSimple}>
                <TextInput
                  style={styles.timeInput}
                  value={formData.scheduledTime.split(':')[0]}
                  maxLength={2}
                  keyboardType="decimal-pad"
                  onChangeText={(hours) => {
                    const h = Math.min(23, Math.max(0, parseInt(hours) || 0));
                    const m = parseInt(formData.scheduledTime.split(':')[1]);
                    handleTimeChange(h, m);
                  }}
                />
                <Text style={styles.timeSeparator}>:</Text>
                <TextInput
                  style={styles.timeInput}
                  value={formData.scheduledTime.split(':')[1]}
                  maxLength={2}
                  keyboardType="decimal-pad"
                  onChangeText={(minutes) => {
                    const h = parseInt(formData.scheduledTime.split(':')[0]);
                    const m = Math.min(59, Math.max(0, parseInt(minutes) || 0));
                    handleTimeChange(h, m);
                  }}
                />
              </View>
            </View>

            <View style={styles.daysSection}>
              <Text style={styles.label}>Jours actifs</Text>
              <View style={styles.daysList}>
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayButton,
                      formData.activeDays[index] &&
                      styles.dayButtonActive,
                    ]}
                    onPress={() => handleToggleDay(index)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        formData.activeDays[index] &&
                        styles.dayButtonTextActive,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* STEP 4: Notifications */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>
              Activations les notifications
            </Text>
            <Text style={styles.stepDescription}>
              Reçois des messages motivants
            </Text>

            <TouchableOpacity
              style={styles.notificationToggle}
              onPress={() =>
                setFormData({
                  ...formData,
                  notificationsEnabled: !formData.notificationsEnabled,
                })
              }
            >
              <View
                style={[
                  styles.notificationToggleCircle,
                  formData.notificationsEnabled &&
                  styles.notificationToggleCircleActive,
                ]}
              />
              <Text style={styles.notificationToggleText}>
                {formData.notificationsEnabled
                  ? 'Notifications activées'
                  : 'Notifications désactivées'}
              </Text>
            </TouchableOpacity>

            {formData.category && (
              <View style={styles.notificationExampleCard}>
                <Text style={styles.notificationExampleLabel}>
                  Exemple de message ({formData.category}):
                </Text>
                <Text style={styles.notificationExampleText}>
                  {copywriting.getHabitSuggestions(formData.category)[0]}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* STEP 5: Preview */}
        {step === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>
              Vérifie ton habitude
            </Text>
            <Text style={styles.stepDescription}>
              Ça te plaît?
            </Text>

            <HabitCard
              emoji={formData.emoji}
              name={formData.name}
              category={formData.category || 'Sport'}
              scheduledTime={formData.scheduledTime}
              isCompleted={false}
              onPress={() => {}}
            />

            <View style={styles.previewDetails}>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Catégorie:</Text>
                <Text style={styles.previewValue}>
                  {formData.category}
                </Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Jours:</Text>
                <Text style={styles.previewValue}>
                  {formData.activeDays
                    .map((active, i) => (active ? ['L', 'M', 'M', 'J', 'V', 'S', 'D'][i] : null))
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Heure:</Text>
                <Text style={styles.previewValue}>
                  {formData.scheduledTime}
                </Text>
              </View>
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Notifications:</Text>
                <Text style={styles.previewValue}>
                  {formData.notificationsEnabled
                    ? 'Activées'
                    : 'Désactivées'}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.footer}>
        {step > 1 && (
          <Button
            label="← Retour"
            onPress={() => setStep(step - 1)}
            variant="secondary"
            size="md"
            style={styles.backButton}
          />
        )}
        {step < 5 && (
          <Button
            label="Suivant →"
            onPress={() => setStep(step + 1)}
            size="md"
            style={styles.nextButton}
          />
        )}
        {step === 5 && (
          <Button
            label="✦ Créer l'habitude"
            onPress={handleCreateHabit}
            size="lg"
            style={styles.nextButton}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  stepIndicator: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  stepNumber: {
    ...TEXT_STYLES.labelMd,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.background.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.accent.violet,
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  stepTitle: {
    ...TEXT_STYLES.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  stepDescription: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
  },
  textInput: {
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    color: COLORS.text.primary,
    ...TEXT_STYLES.bodyMd,
    marginBottom: SPACING.lg,
  },
  categoryLabel: {
    ...TEXT_STYLES.labelMd,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  categoriesList: {
    marginBottom: SPACING.lg,
  },
  categoryButton: {
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.md,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.accent.violet,
    borderColor: COLORS.accent.violet,
  },
  categoryText: {
    ...TEXT_STYLES.labelSm,
    color: COLORS.text.secondary,
  },
  categoryTextActive: {
    color: COLORS.text.primary,
  },
  suggestionsLabel: {
    ...TEXT_STYLES.labelMd,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  suggestionItem: {
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent.violet,
  },
  suggestionText: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.primary,
  },
  timeSection: {
    marginBottom: SPACING.xl,
  },
  daysSection: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TEXT_STYLES.labelMd,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  timePickerSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.lg,
  },
  timeInput: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlign: 'center',
    color: COLORS.text.primary,
    ...TEXT_STYLES.h3,
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  daysList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.sm,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonActive: {
    backgroundColor: COLORS.accent.violet,
    borderColor: COLORS.accent.violet,
  },
  dayButtonText: {
    ...TEXT_STYLES.labelMd,
    color: COLORS.text.secondary,
  },
  dayButtonTextActive: {
    color: COLORS.text.primary,
  },
  notificationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  notificationToggleCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: COLORS.accent.violet,
  },
  notificationToggleCircleActive: {
    backgroundColor: COLORS.accent.violet,
  },
  notificationToggleText: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.primary,
  },
  notificationExampleCard: {
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
  },
  notificationExampleLabel: {
    ...TEXT_STYLES.labelMd,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  notificationExampleText: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.primary,
    fontStyle: 'italic',
  },
  previewDetails: {
    backgroundColor: COLORS.background.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  previewLabel: {
    ...TEXT_STYLES.labelMd,
    color: COLORS.text.secondary,
  },
  previewValue: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
});

export default CreateHabitScreen;
