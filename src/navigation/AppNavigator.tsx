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
import PollenScreen from '../screens/PollenScreen'; // Back to original to test with fixed map
import PollenDebugScreen from '../screens/PollenDebugScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (    <Tab.Navigator
      id={undefined}
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
        }}
      />
      <Tab.Screen
        name="DailyLog"
        component={DailyLogScreen}
        options={{
          tabBarLabel: 'Log',
        }}
        initialParams={{ childId: '' }}
      />
      <Tab.Screen
        name="ImageDiary"
        component={ImageDiaryScreen}
        options={{
          tabBarLabel: 'Photos',
        }}
        initialParams={{ childId: '' }}
      />
      <Tab.Screen
        name="Research"
        component={ResearchScreen}
        options={{
          tabBarLabel: 'Research',
        }}
      />
      <Tab.Screen
        name="Pollen"
        component={PollenScreen}
        options={{
          tabBarLabel: 'Pollen',
        }}
      />
      <Tab.Screen
        name="Test"
        component={TestScreen}
        options={{
          tabBarLabel: 'API Test',
        }}
      />
      <Tab.Screen
        name="PollenDebug"
        component={PollenDebugScreen}
        options={{
          tabBarLabel: 'Debug',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {  return (
    <Stack.Navigator
      id={undefined}
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
