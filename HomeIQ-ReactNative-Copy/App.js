// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import LandingScreen from './screens/LandingScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import Dashboard from './screens/Dashboard';
import Setting from './screens/Settings';
import HelpFAQScreen from './screens/DashboardComponets/SettingsPages/HelpFAQScreen';
import ProfileSetupScreen from './screens/ProfileSetupScreen';
import PrivacyPolicyScreen from './screens/DashboardComponets/SettingsPages/PrivacyPolicyScreen';
import HelpFAQScreenFull from './screens/DashboardComponets/SettingsPages/HelpFAQScreenFull';

const Stack = createNativeStackNavigator();

function AppInner() {
  // Pull colors & dark flag from your ThemeContext everywhere
  const { darkMode, colors } = useTheme();

  // Bridge ThemeContext -> React Navigation theme
  const navTheme = {
    ...(darkMode ? DarkTheme : DefaultTheme),
    dark: darkMode,
    colors: {
      ...(darkMode ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={darkMode ? 'light' : 'dark'} backgroundColor={colors.background} />
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false, // default off; enable per-screen below
          contentStyle: { backgroundColor: colors.background }, // screen bg
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="HelpFAQ" component={HelpFAQScreen} />
        <Stack.Screen
          name="Setting"
          component={Setting}
          options={{ headerShown: true, title: 'Settings' }}
        />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="HelpFAQFull" component={HelpFAQScreenFull} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <AuthProvider>
          <AppInner />
        </AuthProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
