import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, sharedStyles, spacing } from '../constants/theme';

interface PageHeaderProps {
  title: string;
  right?: ReactNode;
  style?: ViewStyle;
  /** Titre en violet (ex. "Aujourd'hui") */
  titleAccent?: boolean;
}

export function PageHeader({ title, right, style, titleAccent }: PageHeaderProps) {
  return (
    <View style={[styles.wrap, style]}>
      <Text
        style={[
          sharedStyles.pageTitle,
          titleAccent && styles.titleAccent,
        ]}
      >
        {title}
      </Text>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  right: {
    marginLeft: spacing.md,
  },
  titleAccent: {
    color: colors.accent,
  },
});
