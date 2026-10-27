/** Ponto de entrada: fontes, splash, provedores (tema e sessão) e navegação. */
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Sora_600SemiBold, Sora_700Bold } from '@expo-google-fonts/sora';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme';
import { AuthProvider } from './src/contexts/AuthContext';
import { useAuth } from './src/hooks/useAuth';
import { RootNavigator } from './src/navigation/RootNavigator';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Root({ fontsReady }: { fontsReady: boolean }) {
  const { restoring } = useAuth();
  const { isDark } = useTheme();
  const ready = fontsReady && !restoring;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) return null;
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
}

export default function App() {
  const [loaded, error] = useFonts({ Sora_600SemiBold, Sora_700Bold, Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <Root fontsReady={loaded || !!error} />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
