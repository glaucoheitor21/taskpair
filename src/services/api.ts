/**
 * Configuração da fonte de dados do TaskPair.
 *
 * O app tem duas implementações da mesma interface de serviços:
 *
 *  - `supabase` — banco PostgreSQL + Auth no Supabase. Ativado quando as
 *    variáveis EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY
 *    existem (arquivo `.env`, ver `.env.example`).
 *  - `local` — dados mockados de `src/mocks/*.json`, copiados para o
 *    AsyncStorage no primeiro uso e persistidos no aparelho. Funciona
 *    sem rede e é o modo usado nos testes automatizados.
 *
 * Nenhuma tela sabe qual das duas está ativa: tudo passa por `services/`.
 */

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export type DataSource = 'supabase' | 'local';

export const DATA_SOURCE: DataSource =
  SUPABASE_URL && SUPABASE_ANON_KEY && process.env.NODE_ENV !== 'test' ? 'supabase' : 'local';

export const USE_MOCKS = DATA_SOURCE === 'local';

/** Erro de negócio com mensagem pronta para a interface (pt-BR). */
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

/** Converte qualquer erro em uma mensagem legível. */
export function errorMessage(e: unknown): string {
  if (e instanceof AppError) return e.message;
  const msg = e instanceof Error ? e.message : String(e);
  if (/invalid login credentials/i.test(msg)) return 'E-mail ou senha incorretos.';
  if (/already registered|already exists/i.test(msg)) return 'Este e-mail já tem conta.';
  if (/email not confirmed/i.test(msg)) return 'Confirme seu e-mail antes de entrar.';
  if (/network|fetch/i.test(msg)) return 'Sem conexão com o servidor. Tente de novo.';
  return msg || 'Algo deu errado. Tente de novo.';
}
