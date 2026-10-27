/** Persistência local (AsyncStorage): sessão, preferências e banco local. */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  session: '@taskpair:session',
  themePreference: '@taskpair:theme',
  localDb: '@taskpair:db:v1',
} as const;

export async function loadJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Falha de escrita local não deve derrubar a interface.
  }
}

export async function removeKey(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // idem
  }
}
