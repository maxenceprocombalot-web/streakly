import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../../design/colors';
import { SPACING, RADIUS } from '../../design/spacing';

const EMOJIS = [
  '💪', '🏃', '🧘', '🚴', '🏊', '🤸', '⛹️', '🤾',
  '🥗', '🍎', '🥤', '🍽️', '🥕', '🍊', '🥑', '🥦',
  '📚', '📖', '📝', '✍️', '🎓', '💻', '🧠', '📊',
  '🎨', '🎭', '🎵', '🎸', '🎬', '✏️', '🖌️', '📸',
  '🧘', '🕯️', '🌿', '💆', '🛀', '😴', '🧖', '💅',
  '🏆', '🎯', '⚡', '🔥', '✨', '🚀', '💯', '🌟',
  '🎁', '🎉', '🎊', '🌅', '🌙', '☀️', '⭐', '💎',
];

interface EmojiGridProps {
  onSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

const EmojiGrid = ({ onSelect, selectedEmoji }: EmojiGridProps) => {
  const itemsPerRow = 4;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.grid}>
        {EMOJIS.map((emoji) => (
          <TouchableOpacity
            key={emoji}
            style={[
              styles.emojiButton,
              selectedEmoji === emoji && styles.emojiButtonSelected,
            ]}
            onPress={() => onSelect(emoji)}
          >
            <Text style={styles.emoji}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    padding: SPACING.lg,
    justifyContent: 'space-around',
  },
  emojiButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiButtonSelected: {
    borderColor: COLORS.accent.violet,
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
  },
  emoji: {
    fontSize: 32,
  },
});

export default EmojiGrid;
