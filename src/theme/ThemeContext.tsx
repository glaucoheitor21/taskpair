/**
 * ThemeContext — entrega os tokens de cor certos (claro/escuro) para
 * qualquer componente via `useTheme()`. A preferência do usuário
 * (sistema, claro ou escuro) fica salva no AsyncStorage.
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type ThemeColors } from './colors';
import { loadJSON, saveJSON } from '../services/storage';
import { STORAGE_KEYS } from '../services/storage';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    loadJSON<ThemePreference>(STORAGE_KEYS.themePreference).then((p) => {
      if (p) setPreferenceState(p);
    });
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const isDark = preference === 'system' ? system === 'dark' : preference === 'dark';
    return {
      colors: (isDark ? darkTheme : lightTheme) as ThemeColors,
      isDark,
      preference,
      setPreference: (p) => {
        setPreferenceState(p);
        saveJSON(STORAGE_KEYS.themePreference, p);
      },
    };
  }, [preference, system]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  // Fora do provider (ex.: testes de componente isolado) cai no tema claro.
  if (!ctx) {
    return { colors: lightTheme, isDark: false, preference: 'light', setPreference: () => {} };
  }
  return ctx;
}
