import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './context/AuthContext';

// Auth Screens
import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';

// Main Screens
import Dashboard from './screens/Dashboard';
import Setting from './screens/Settings';

// Analysis Screens - REPLACED MLAnalytics with SmartSimulator
import SmartSimulator from './screens/DashboardComponets/ML/SmartSimulator';

// Admin Screens
import AdminScreen from './screens/AdminScreen';
import ManageDevicesScreen from './screens/AdminScreens/ManageDevicesScreen';
import ManageUsersScreen from './screens/AdminScreens/ManageUsersScreen';
import ReportsScreen from './screens/AdminScreens/ReportsScreen';
import SystemSettingsScreen from './screens/AdminScreens/SystemSettingsScreen';
import HelpFAQScreen from './screens/DashboardComponets/SettingsPages/HelpFAQScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Landing"
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Auth Flow */}
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />

          {/* Main App */}
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Settings" component={Setting} />
          <Stack.Screen name="HelpFAQ" component={HelpFAQScreen} />

          {/* Analysis Flow - Now uses SmartSimulator instead of MLAnalytics */}
          <Stack.Screen name="SmartSimulator" component={SmartSimulator} />

          {/* Admin Flow */}
          <Stack.Screen name="AdminScreen" component={AdminScreen} />
          <Stack.Screen name="ManageDevices" component={ManageDevicesScreen} />
          <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
          <Stack.Screen name="Reports" component={ReportsScreen} />
          <Stack.Screen name="SystemSettings" component={SystemSettingsScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
