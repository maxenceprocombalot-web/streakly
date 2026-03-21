import React from 'react';
import { Text } from 'react-native';

// Tab icons for bottom navigation
export const TabIcons = {
  Today: '📅',
  Manage: '⚙️',
  Create: '✚',
  Stats: '📊',
  Widget: '📱',
};

export const EmojiIcon = ({ emoji, size = 20 }) => (
  <Text style={{ fontSize: size, marginBottom: -4 }}>
    {emoji}
  </Text>
);

export default TabIcons;
