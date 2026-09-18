import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  background: string;
  card: string;
  darkText: string;
  mutedText: string;
  border: string;
  white: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  info: string;
  infoLight: string;
  activeTab: string;
  inactiveTab: string;
}

export const LIGHT_COLORS: ThemeColors = {
  primary: '#16A085',
  primaryDark: '#0E6655',
  primaryLight: '#E8F8F5',
  secondary: '#1ABC9C',
  background: '#F5F8F7',
  card: '#FFFFFF',
  darkText: '#14213D',
  mutedText: '#7A8793',
  border: '#E2E8E6',
  white: '#FFFFFF',
  success: '#16A085',
  successLight: '#EAFAF1',
  warning: '#F4A261',
  warningLight: '#FEF9E7',
  danger: '#E76F51',
  dangerLight: '#FDEDEC',
  info: '#2980B9',
  infoLight: '#EBF5FB',
  activeTab: '#16A085',
  inactiveTab: '#7A8793'
};

export const DARK_COLORS: ThemeColors = {
  primary: '#1ABC9C',
  primaryDark: '#16A085',
  primaryLight: '#123730',
  secondary: '#48C9B0',
  background: '#0F172A',
  card: '#1E293B',
  darkText: '#F8FAFC',
  mutedText: '#94A3B8',
  border: '#334155',
  white: '#FFFFFF',
  success: '#2ECC71',
  successLight: '#143823',
  warning: '#F39C12',
  warningLight: '#3D2E14',
  danger: '#E74C3C',
  dangerLight: '#3B1815',
  info: '#3498DB',
  infoLight: '#152C3D',
  activeTab: '#1ABC9C',
  inactiveTab: '#64748B'
};

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const THEME_STORAGE_KEY = 'parishak_theme_preference';

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  isDark: false,
  colors: LIGHT_COLORS,
  setThemeMode: async () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((val) => {
        if (val === 'light' || val === 'dark' || val === 'system') {
          setThemeModeState(val as ThemeMode);
        }
      })
      .catch(() => {});
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // safe fallback
    }
  };

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, colors, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
