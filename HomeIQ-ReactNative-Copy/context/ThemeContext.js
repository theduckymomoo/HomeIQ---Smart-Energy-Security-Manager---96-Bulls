// context/ThemeContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);

  // load persisted preference (fallback to system)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@settings');
        if (raw) {
          const s = JSON.parse(raw);
          if (typeof s.darkMode === 'boolean') {
            setDarkMode(s.darkMode);
            return;
          }
        }
        // fallback to system if not stored
        setDarkMode(Appearance.getColorScheme() === 'dark');
      } catch {
        setDarkMode(true);
      }
    })();
  }, []);

  // basic color tokens for the app
  const colors = useMemo(() => {
    if (darkMode) {
      return {
        background: '#0a0a0b',
        card: '#18181b',
        border: 'rgba(255,255,255,0.1)',
        text: '#ffffff',
        subtext: '#a1a1aa',
        primary: '#10b981',
      };
    }
    return {
      background: '#ffffff',
      card: '#f7f7f8',
      border: 'rgba(0,0,0,0.08)',
      text: '#111827',
      subtext: '#6b7280',
      primary: '#10b981',
    };
  }, [darkMode]);

  const value = useMemo(
    () => ({ darkMode, setDarkMode, colors }),
    [darkMode, colors]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
