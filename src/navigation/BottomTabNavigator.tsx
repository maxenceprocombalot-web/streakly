import React from 'react';
import { Platform, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../design/colors';
import { TEXT_STYLES } from '../design/text';

import TodayScreen from '../components/screens/TodayScreen';
import ManageHabitsScreen from '../components/screens/ManageHabitsScreen';
import CreateHabitScreen from '../components/screens/CreateHabitScreen';
import StatsScreen from '../components/screens/StatsScreen';
import WidgetScreen from '../components/screens/WidgetScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: COLORS.background.elevated,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 80 : 56,
        },
        tabBarLabelStyle: {
          ...TEXT_STYLES.labelSm,
          marginTop: -4,
        },
        tabBarActiveTintColor: COLORS.accent.violet,
        tabBarInactiveTintColor: COLORS.text.secondary,
      }}
    >
      <Tab.Screen
        name="Today"
        component={TodayScreen}
        options={{
          tabBarLabel: 'Aujourd\'hui',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color: color }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="Manage"
        component={ManageHabitsScreen}
        options={{
          tabBarLabel: 'Gérer',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color: color }}>⚙️</Text>,
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateHabitScreen}
        options={{
          tabBarLabel: 'Créer',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color: color }}>✚</Text>,
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color: color }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Widget"
        component={WidgetScreen}
        options={{
          tabBarLabel: 'Widget',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color: color }}>📱</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
