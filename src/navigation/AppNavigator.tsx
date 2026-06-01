import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';

import { cardBorder, colors, radius, spacing } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import { CreateScreen } from '../screens/CreateScreen';
import { ManageScreen } from '../screens/ManageScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { TodayScreen } from '../screens/TodayScreen';

export type RootTabParamList = {
  Today: undefined;
  Manage: undefined;
  Create: undefined;
  Stats: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    border: cardBorder,
    primary: colors.accent,
    text: colors.text,
  },
};

const TAB_EMOJI: Record<keyof RootTabParamList, string> = {
  Today: '⚡',
  Manage: '☰',
  Create: '＋',
  Stats: '◫',
  Settings: '⚙',
};

const TAB_LABEL_KEY: Record<keyof RootTabParamList, string> = {
  Today: 'tabs.today',
  Manage: 'tabs.manage',
  Create: 'tabs.create',
  Stats: 'tabs.stats',
  Settings: 'tabs.settings',
};

export function AppNavigator() {
  const { t } = useTranslation();

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const emoji = TAB_EMOJI[route.name];
          const label = t(TAB_LABEL_KEY[route.name]);
          return {
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarShowLabel: false,
            tabBarIcon: ({ focused }) => (
              <View style={[styles.tabItem, focused && styles.tabItemActive]}>
                <Text style={[styles.icon, focused && styles.iconActive]}>
                  {emoji}
                </Text>
                <Text style={[styles.label, focused && styles.labelActive]}>
                  {label}
                </Text>
              </View>
            ),
          };
        }}
      >
        <Tab.Screen name="Today" component={TodayScreen} />
        <Tab.Screen name="Manage" component={ManageScreen} />
        <Tab.Screen name="Create" component={CreateScreen} />
        <Tab.Screen name="Stats" component={StatsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: cardBorder,
    height: 70,
    paddingTop: 8,
    paddingBottom: 8,
    elevation: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    minWidth: 56,
  },
  tabItemActive: {
    backgroundColor: colors.accentSoft,
  },
  icon: {
    fontSize: 24,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  iconActive: {
    color: colors.accent,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.accent,
    fontWeight: '600',
  },
});
