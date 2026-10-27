/**
 * Banco local do modo `local`: os JSONs de `src/mocks` são copiados para o
 * AsyncStorage na primeira execução e, daí em diante, toda escrita
 * (criar tarefa, mover de coluna, convidar integrante) persiste no aparelho.
 */
import usersSeed from '../mocks/users.json';
import projectsSeed from '../mocks/projects.json';
import tasksSeed from '../mocks/tasks.json';
import type { Project, Task, User } from '../types';
import { loadJSON, saveJSON, STORAGE_KEYS } from './storage';

/** Senha das contas de demonstração do modo local. */
export const DEMO_PASSWORD = '123456';

export interface LocalUser extends User {
  password: string;
}

export interface LocalDb {
  users: LocalUser[];
  projects: Project[];
  tasks: Task[];
  sessionUserId: string | null;
}

function seed(): LocalDb {
  return {
    users: (usersSeed as User[]).map((u) => ({ ...u, password: DEMO_PASSWORD })),
    projects: projectsSeed as Project[],
    tasks: tasksSeed as Task[],
    sessionUserId: null,
  };
}

let cache: LocalDb | null = null;

export async function getDb(): Promise<LocalDb> {
  if (cache) return cache;
  cache = (await loadJSON<LocalDb>(STORAGE_KEYS.localDb)) ?? seed();
  return cache;
}

/** Aplica uma alteração e persiste. */
export async function mutateDb<T>(fn: (db: LocalDb) => T): Promise<T> {
  const db = await getDb();
  const result = fn(db);
  await saveJSON(STORAGE_KEYS.localDb, db);
  return result;
}

/** Volta aos dados de demonstração (mantém o usuário logado, se existir no seed). */
export async function resetDb(): Promise<void> {
  const current = cache?.sessionUserId ?? null;
  cache = seed();
  if (current && cache.users.some((u) => u.id === current)) cache.sessionUserId = current;
  await saveJSON(STORAGE_KEYS.localDb, cache);
}

/** Só para testes: esquece o cache em memória. */
export function __clearCache() {
  cache = null;
}

export function newId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function stripPassword({ password: _p, ...user }: LocalUser): User {
  return user;
}
