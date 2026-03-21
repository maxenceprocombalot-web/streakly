import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../../design/colors';
import { TEXT_STYLES } from '../../design/text';
import { SPACING, RADIUS } from '../../design/spacing';
import Button from './Button';
import { getTimeFromHourMinutes } from '../../utils/dateUtils';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (manualTime?: string) => void;
  habitName: string;
  emoji: string;
}

const BottomSheet = ({
  visible,
  onClose,
  onConfirm,
  habitName,
  emoji,
}: BottomSheetProps) => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [useManualTime, setUseManualTime] = useState(false);
  const [manualHours, setManualHours] = useState('12');
  const [manualMinutes, setManualMinutes] = useState('00');

  const handleNow = () => {
    onConfirm();
    onClose();
  };

  const handleManualTime = () => {
    const time = getTimeFromHourMinutes(
      parseInt(manualHours, 10),
      parseInt(manualMinutes, 10)
    );
    onConfirm(time);
    onClose();
  };

  const handleIncrementHour = () => {
    let hours = parseInt(manualHours, 10);
    hours = (hours + 1) % 24;
    setManualHours(String(hours).padStart(2, '0'));
  };

  const handleDecrementHour = () => {
    let hours = parseInt(manualHours, 10);
    hours = hours - 1 < 0 ? 23 : hours - 1;
    setManualHours(String(hours).padStart(2, '0'));
  };

  const handleIncrementMinute = () => {
    let minutes = parseInt(manualMinutes, 10);
    minutes = (minutes + 15) % 60;
    setManualMinutes(String(minutes).padStart(2, '0'));
  };

  const handleDecrementMinute = () => {
    let minutes = parseInt(manualMinutes, 10);
    minutes = minutes - 15 < 0 ? 45 : minutes - 15;
    setManualMinutes(String(minutes).padStart(2, '0'));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <View style={styles.bottomSheet}>
            {/* Handle bar */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.emoji}>{emoji}</Text>
              <View style={styles.headerText}>
                <Text style={styles.title}>Valider l'habitude</Text>
                <Text style={styles.habitName}>{habitName}</Text>
              </View>
            </View>

            {/* Quick action buttons */}
            <View style={styles.section}>
              <Button
                label="✓ Viens d'être effectuée"
                onPress={handleNow}
                size="lg"
                style={styles.fullButton}
              />
            </View>

            {/* Manual time section */}
            <View style={styles.section}>
              <TouchableOpacity
                onPress={() => setUseManualTime(!useManualTime)}
                style={styles.toggle}
              >
                <View
                  style={[
                    styles.toggleCircle,
                    useManualTime && styles.toggleCircleActive,
                  ]}
                />
                <Text style={styles.toggleLabel}>
                  Entrer une heure manuelle
                </Text>
              </TouchableOpacity>

              {useManualTime && (
                <View style={styles.timePicker}>
                  <View style={styles.timePickerColumn}>
                    <TouchableOpacity
                      onPress={handleIncrementHour}
                      style={styles.timeButton}
                    >
                      <Text style={styles.timeButtonText}>+</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.timeInput}
                      value={manualHours}
                      onChangeText={setManualHours}
                      keyboardType="decimal-pad"
                      maxLength={2}
                    />
                    <TouchableOpacity
                      onPress={handleDecrementHour}
                      style={styles.timeButton}
                    >
                      <Text style={styles.timeButtonText}>−</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.timeSeparator}>:</Text>

                  <View style={styles.timePickerColumn}>
                    <TouchableOpacity
                      onPress={handleIncrementMinute}
                      style={styles.timeButton}
                    >
                      <Text style={styles.timeButtonText}>+</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.timeInput}
                      value={manualMinutes}
                      onChangeText={setManualMinutes}
                      keyboardType="decimal-pad"
                      maxLength={2}
                    />
                    <TouchableOpacity
                      onPress={handleDecrementMinute}
                      style={styles.timeButton}
                    >
                      <Text style={styles.timeButtonText}>−</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {useManualTime && (
                <Button
                  label="✓ Confirmer"
                  onPress={handleManualTime}
                  size="lg"
                  variant="secondary"
                  style={styles.fullButton}
                />
              )}
            </View>

            {/* Close button */}
            <View style={styles.section}>
              <TouchableOpacity
                onPress={onClose}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: COLORS.background.elevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxxl : SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.text.secondary,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 36,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...TEXT_STYLES.h2,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  habitName: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.secondary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  fullButton: {
    width: '100%',
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.accent.violet,
  },
  toggleCircleActive: {
    backgroundColor: COLORS.accent.violet,
  },
  toggleLabel: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.primary,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginVertical: SPACING.lg,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.background.primary,
    borderRadius: RADIUS.md,
  },
  timePickerColumn: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  timeButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accent.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButtonText: {
    fontSize: 20,
    color: COLORS.text.primary,
    fontWeight: 'bold',
  },
  timeInput: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  timeSeparator: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  cancelButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  cancelText: {
    ...TEXT_STYLES.bodyMd,
    color: COLORS.text.secondary,
  },
});

export default BottomSheet;
