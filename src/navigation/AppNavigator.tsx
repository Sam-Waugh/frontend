import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../models';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import DailyLogScreen from '../screens/DailyLogScreen';
import ImageDiaryScreen from '../screens/ImageDiaryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResearchScreen from '../screens/ResearchScreen';
import DoctorReportScreen from '../screens/DoctorReportScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TestScreen from '../screens/TestScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#757575',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="home" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen
        name="DailyLog"
        component={DailyLogScreen}
        options={{
          tabBarLabel: 'Log',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="add-circle" size={size} color={color} />
          // ),
        }}
        initialParams={{ childId: '' }}
      />
      <Tab.Screen
        name="ImageDiary"
        component={ImageDiaryScreen}
        options={{
          tabBarLabel: 'Photos',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="photo-library" size={size} color={color} />
          // ),
        }}
        initialParams={{ childId: '' }}
      />
      <Tab.Screen
        name="Research"
        component={ResearchScreen}
        options={{
          tabBarLabel: 'Research',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="library-books" size={size} color={color} />
          // ),
        }}
      />
      <Tab.Screen
        name="Test"
        component={TestScreen}
        options={{
          tabBarLabel: 'API Test',
          // tabBarIcon: ({ color, size }) => (
          //   <Icon name="bug-report" size={size} color={color} />
          // ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="TabNavigator"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Child Profile' }}
      />
      <Stack.Screen
        name="DoctorReport"
        component={DoctorReportScreen}
        options={{ title: 'Doctor Report' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}
