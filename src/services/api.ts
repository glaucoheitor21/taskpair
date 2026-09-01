/**
 * Cliente HTTP do TaskPair.
 *
 * CP5: `USE_MOCKS = true` — os repositórios em `services/` resolvem a
 *      partir de `src/mocks/*.json`, sem rede.
 * CP6: `USE_MOCKS = false` — mesmas funções passam a falar com a API REST.
 *
 * Manter a fronteira aqui é o que permite trocar mock por API sem tocar
 * em nenhuma tela.
 */

export const USE_MOCKS = true;

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export const ENDPOINTS = {
  signIn: '/auth/sign-in',
  signUp: '/auth/sign-up',
  projects: '/projects',
  project: (id: string) => `/projects/${id}`,
  projectMembers: (id: string) => `/projects/${id}/members`,
  projectBalance: (id: string) => `/projects/${id}/balance`,
  tasks: '/tasks',
  task: (id: string) => `/tasks/${id}`,
} as const;

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  throw new Error('Cliente HTTP sera implementado no CP6');
}
