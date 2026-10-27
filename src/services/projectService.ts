/**
 * projectService — projetos, integrantes e perfis.
 * Mesma assinatura nos modos `local` e `supabase`.
 */
import type { ISODate, Member, Project, User, UUID } from '../types';
import { AppError, DATA_SOURCE } from './api';
import { getDb, mutateDb, newId, stripPassword } from './localDb';
import { getSupabase } from './supabase';
import { profileToUser, type ProfileRow } from './authService';
import { todayISO } from '../utils/date';

export interface NewProjectInput {
  name: string;
  subject: string;
  description?: string;
  dueDate: ISODate;
}

interface ProjectRow {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  due_date: string;
  created_by: string;
  created_at: string;
  archived: boolean;
  members?: { user_id: string; role: Member['role']; joined_at: string }[];
}

function rowToProject(r: ProjectRow): Project {
  return {
    id: r.id,
    name: r.name,
    subject: r.subject,
    description: r.description ?? undefined,
    dueDate: r.due_date,
    createdBy: r.created_by,
    createdAt: r.created_at.slice(0, 10),
    archived: r.archived,
    members: (r.members ?? []).map((m) => ({ userId: m.user_id, role: m.role, joinedAt: m.joined_at })),
  };
}

/** Projetos dos quais o usuário participa. */
export async function listProjects(userId: UUID): Promise<Project[]> {
  if (DATA_SOURCE === 'supabase') {
    const { data, error } = await getSupabase()
      .from('projects')
      .select('*, members(*)')
      .order('due_date', { ascending: true });
    if (error) throw error;
    return (data as ProjectRow[]).map(rowToProject);
  }
  const db = await getDb();
  return db.projects
    .filter((p) => p.members.some((m) => m.userId === userId))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}

export async function createProject(input: NewProjectInput, userId: UUID): Promise<Project> {
  if (DATA_SOURCE === 'supabase') {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('projects')
      .insert({
        name: input.name.trim(),
        subject: input.subject.trim(),
        description: input.description?.trim() || null,
        due_date: input.dueDate,
        created_by: userId,
      })
      .select()
      .single();
    if (error) throw error;
    const { error: mErr } = await sb.from('members').insert({ project_id: data.id, user_id: userId, role: 'owner' });
    if (mErr) throw mErr;
    return rowToProject({ ...(data as ProjectRow), members: [{ user_id: userId, role: 'owner', joined_at: todayISO() }] });
  }
  return mutateDb((db) => {
    const project: Project = {
      id: newId('p'),
      name: input.name.trim(),
      subject: input.subject.trim(),
      description: input.description?.trim() || undefined,
      dueDate: input.dueDate,
      members: [{ userId, role: 'owner', joinedAt: todayISO() }],
      createdBy: userId,
      createdAt: todayISO(),
      archived: false,
    };
    db.projects.push(project);
    return project;
  });
}

export async function updateProject(
  id: UUID,
  patch: Partial<Pick<Project, 'name' | 'subject' | 'description' | 'dueDate' | 'archived'>>,
): Promise<void> {
  if (DATA_SOURCE === 'supabase') {
    const row: Record<string, unknown> = {};
    if (patch.name !== undefined) row.name = patch.name;
    if (patch.subject !== undefined) row.subject = patch.subject;
    if (patch.description !== undefined) row.description = patch.description;
    if (patch.dueDate !== undefined) row.due_date = patch.dueDate;
    if (patch.archived !== undefined) row.archived = patch.archived;
    const { error } = await getSupabase().from('projects').update(row).eq('id', id);
    if (error) throw error;
    return;
  }
  await mutateDb((db) => {
    const p = db.projects.find((x) => x.id === id);
    if (p) Object.assign(p, patch);
  });
}

export async function deleteProject(id: UUID): Promise<void> {
  if (DATA_SOURCE === 'supabase') {
    const { error } = await getSupabase().from('projects').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  await mutateDb((db) => {
    db.projects = db.projects.filter((p) => p.id !== id);
    db.tasks = db.tasks.filter((t) => t.projectId !== id);
  });
}

/** Convida um integrante pelo e-mail de uma conta já existente. */
export async function inviteMember(projectId: UUID, email: string): Promise<User> {
  const normalized = email.trim().toLowerCase();
  if (DATA_SOURCE === 'supabase') {
    const sb = getSupabase();
    const { data: prof, error } = await sb.from('profiles').select('*').ilike('email', normalized).maybeSingle();
    if (error) throw error;
    if (!prof) throw new AppError('Nenhuma conta TaskPair com esse e-mail. Peça para a pessoa se cadastrar primeiro.');
    const { error: mErr } = await sb.from('members').insert({ project_id: projectId, user_id: prof.id, role: 'member' });
    if (mErr) {
      if (/duplicate/i.test(mErr.message)) throw new AppError('Essa pessoa já está no projeto.');
      throw mErr;
    }
    return profileToUser(prof as ProfileRow);
  }
  return mutateDb((db) => {
    const u = db.users.find((x) => x.email.toLowerCase() === normalized);
    if (!u) throw new AppError('Nenhuma conta TaskPair com esse e-mail. Peça para a pessoa se cadastrar primeiro.');
    const p = db.projects.find((x) => x.id === projectId);
    if (!p) throw new AppError('Projeto não encontrado.');
    if (p.members.some((m) => m.userId === u.id)) throw new AppError('Essa pessoa já está no projeto.');
    p.members.push({ userId: u.id, role: 'member', joinedAt: todayISO() });
    return stripPassword(u);
  });
}

export async function removeMember(projectId: UUID, userId: UUID): Promise<void> {
  if (DATA_SOURCE === 'supabase') {
    const sb = getSupabase();
    // Tarefas da pessoa voltam para o pool antes de ela sair.
    await sb.from('tasks').update({ assignee_id: null }).eq('project_id', projectId).eq('assignee_id', userId);
    const { error } = await sb.from('members').delete().eq('project_id', projectId).eq('user_id', userId);
    if (error) throw error;
    return;
  }
  await mutateDb((db) => {
    const p = db.projects.find((x) => x.id === projectId);
    if (p) p.members = p.members.filter((m) => m.userId !== userId);
    db.tasks.forEach((t) => {
      if (t.projectId === projectId && t.assigneeId === userId) t.assigneeId = null;
    });
  });
}

/** Perfis públicos dos integrantes (nome, iniciais, cor). */
export async function listUsers(ids: UUID[]): Promise<User[]> {
  if (ids.length === 0) return [];
  if (DATA_SOURCE === 'supabase') {
    const { data, error } = await getSupabase().from('profiles').select('*').in('id', ids);
    if (error) throw error;
    return (data as ProfileRow[]).map(profileToUser);
  }
  const db = await getDb();
  return db.users.filter((u) => ids.includes(u.id)).map(stripPassword);
}
