import { StyleSheet, Text, View } from 'react-native';

import { getQuoteForDate } from '../i18n';
import { useSettingsStore } from '../store/settingsStore';
import { cardBase, colors, spacing } from '../constants/theme';

interface MotivationalQuoteProps {
  date: Date;
}

export function MotivationalQuote({ date }: MotivationalQuoteProps) {
  const locale = useSettingsStore((s) => s.locale);
  const quote = getQuoteForDate(date, locale);

  return (
    <View style={styles.container}>
      <View style={styles.leftBorder} />
      <Text style={styles.quote}>{quote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...cardBase,
    padding: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.accent,
  },
  quote: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '400',
    fontStyle: 'italic',
    paddingLeft: spacing.xs,
  },
});
