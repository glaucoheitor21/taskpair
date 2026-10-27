/**
 * authService — cadastro, login e sessão.
 * Modo `local`: contas no banco local (AsyncStorage).
 * Modo `supabase`: Supabase Auth + tabela `profiles`.
 */
import type { User } from '../types';
import { AppError, DATA_SOURCE } from './api';
import { getDb, mutateDb, newId, stripPassword } from './localDb';
import { getSupabase } from './supabase';
import { colorFor, initialsOf } from '../utils/user';

export interface ProfileRow {
  id: string;
  name: string;
  email: string;
  initials: string | null;
  color: string | null;
}

export function profileToUser(row: ProfileRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    initials: row.initials ?? initialsOf(row.name),
    color: row.color ?? colorFor(row.id),
  };
}

async function fetchProfile(id: string): Promise<User> {
  const sb = getSupabase();
  const { data, error } = await sb.from('profiles').select('*').eq('id', id).single();
  if (error) throw error;
  return profileToUser(data as ProfileRow);
}

export async function getSession(): Promise<User | null> {
  if (DATA_SOURCE === 'supabase') {
    const { data } = await getSupabase().auth.getSession();
    if (!data.session) return null;
    try {
      return await fetchProfile(data.session.user.id);
    } catch {
      return null;
    }
  }
  const db = await getDb();
  const u = db.users.find((x) => x.id === db.sessionUserId);
  return u ? stripPassword(u) : null;
}

export async function signIn(email: string, password: string): Promise<User> {
  const normalized = email.trim().toLowerCase();
  if (DATA_SOURCE === 'supabase') {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email: normalized, password });
    if (error) throw error;
    return fetchProfile(data.user.id);
  }
  return mutateDb((db) => {
    const u = db.users.find((x) => x.email.toLowerCase() === normalized);
    if (!u || u.password !== password) throw new AppError('E-mail ou senha incorretos.');
    db.sessionUserId = u.id;
    return stripPassword(u);
  });
}

export async function signUp(name: string, email: string, password: string): Promise<User> {
  const normalized = email.trim().toLowerCase();
  const cleanName = name.trim();
  if (DATA_SOURCE === 'supabase') {
    const sb = getSupabase();
    const { data, error } = await sb.auth.signUp({
      email: normalized,
      password,
      options: { data: { name: cleanName } },
    });
    if (error) throw error;
    if (!data.session || !data.user) {
      throw new AppError('Conta criada! Confirme o e-mail que enviamos e depois entre.');
    }
    // O perfil é criado por trigger no banco; garantimos iniciais e cor.
    const profile = {
      id: data.user.id,
      name: cleanName,
      email: normalized,
      initials: initialsOf(cleanName),
      color: colorFor(data.user.id),
    };
    await sb.from('profiles').upsert(profile);
    return profileToUser(profile);
  }
  return mutateDb((db) => {
    if (db.users.some((x) => x.email.toLowerCase() === normalized)) {
      throw new AppError('Este e-mail já tem conta.');
    }
    const id = newId('u');
    const user = { id, name: cleanName, email: normalized, initials: initialsOf(cleanName), color: colorFor(id), password };
    db.users.push(user);
    db.sessionUserId = id;
    return stripPassword(user);
  });
}

export async function signOut(): Promise<void> {
  if (DATA_SOURCE === 'supabase') {
    await getSupabase().auth.signOut();
    return;
  }
  await mutateDb((db) => {
    db.sessionUserId = null;
  });
}
