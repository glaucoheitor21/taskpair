/**
 * Cliente Supabase. Só é criado quando `DATA_SOURCE === 'supabase'`.
 * A sessão do Supabase Auth é persistida no AsyncStorage.
 */
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';
import { DATA_SOURCE, SUPABASE_ANON_KEY, SUPABASE_URL } from './api';

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (DATA_SOURCE !== 'supabase') {
    throw new Error('Supabase não configurado (defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY).');
  }
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    // Renova o token só com o app em primeiro plano (recomendação do Supabase para RN).
    if (Platform.OS !== 'web') {
      AppState.addEventListener('change', (state) => {
        if (state === 'active') client?.auth.startAutoRefresh();
        else client?.auth.stopAutoRefresh();
      });
    }
  }
  return client;
}
