/**
 * taskService — tarefas dos projetos.
 * Mesma assinatura nos modos `local` e `supabase`.
 */
import type { ISODate, Task, TaskStatus, TaskWeight, UUID } from '../types';
import { DATA_SOURCE } from './api';
import { getDb, mutateDb, newId } from './localDb';
import { getSupabase } from './supabase';
import { todayISO } from '../utils/date';

export interface NewTaskInput {
  projectId: UUID;
  title: string;
  description?: string;
  weight: TaskWeight;
  assigneeId: UUID | null;
  dueDate: ISODate | null;
  status?: TaskStatus;
}

export type TaskPatch = Partial<Pick<Task, 'title' | 'description' | 'weight' | 'assigneeId' | 'dueDate' | 'status'>>;

interface TaskRow {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  weight: TaskWeight;
  assignee_id: string | null;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
}

function rowToTask(r: TaskRow): Task {
  return {
    id: r.id,
    projectId: r.project_id,
    title: r.title,
    description: r.description ?? undefined,
    status: r.status,
    weight: r.weight,
    assigneeId: r.assignee_id,
    dueDate: r.due_date,
    createdAt: r.created_at.slice(0, 10),
    completedAt: r.completed_at ? r.completed_at.slice(0, 10) : null,
  };
}

/** Ao concluir, marca a data; ao reabrir, limpa. */
function completionFor(status: TaskStatus | undefined, current: ISODate | null): ISODate | null {
  if (status === undefined) return current;
  return status === 'done' ? (current ?? todayISO()) : null;
}

export async function listTasks(projectIds: UUID[]): Promise<Task[]> {
  if (projectIds.length === 0) return [];
  if (DATA_SOURCE === 'supabase') {
    const { data, error } = await getSupabase()
      .from('tasks')
      .select('*')
      .in('project_id', projectIds)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data as TaskRow[]).map(rowToTask);
  }
  const db = await getDb();
  return db.tasks.filter((t) => projectIds.includes(t.projectId));
}

export async function createTask(input: NewTaskInput): Promise<Task> {
  const status = input.status ?? 'todo';
  if (DATA_SOURCE === 'supabase') {
    const { data, error } = await getSupabase()
      .from('tasks')
      .insert({
        project_id: input.projectId,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        weight: input.weight,
        assignee_id: input.assigneeId,
        due_date: input.dueDate,
        status,
        completed_at: status === 'done' ? todayISO() : null,
      })
      .select()
      .single();
    if (error) throw error;
    return rowToTask(data as TaskRow);
  }
  return mutateDb((db) => {
    const task: Task = {
      id: newId('t'),
      projectId: input.projectId,
      title: input.title.trim(),
      description: input.description?.trim() || undefined,
      status,
      weight: input.weight,
      assigneeId: input.assigneeId,
      dueDate: input.dueDate,
      createdAt: todayISO(),
      completedAt: status === 'done' ? todayISO() : null,
    };
    db.tasks.push(task);
    return task;
  });
}

export async function updateTask(task: Task, patch: TaskPatch): Promise<Task> {
  const completedAt = completionFor(patch.status, task.completedAt);
  const next: Task = { ...task, ...patch, completedAt };
  if (DATA_SOURCE === 'supabase') {
    const row: Record<string, unknown> = { completed_at: completedAt };
    if (patch.title !== undefined) row.title = patch.title.trim();
    if (patch.description !== undefined) row.description = patch.description?.trim() || null;
    if (patch.weight !== undefined) row.weight = patch.weight;
    if (patch.assigneeId !== undefined) row.assignee_id = patch.assigneeId;
    if (patch.dueDate !== undefined) row.due_date = patch.dueDate;
    if (patch.status !== undefined) row.status = patch.status;
    const { data, error } = await getSupabase().from('tasks').update(row).eq('id', task.id).select().single();
    if (error) throw error;
    return rowToTask(data as TaskRow);
  }
  return mutateDb((db) => {
    const i = db.tasks.findIndex((t) => t.id === task.id);
    if (i >= 0) db.tasks[i] = next;
    return next;
  });
}

export async function deleteTask(id: UUID): Promise<void> {
  if (DATA_SOURCE === 'supabase') {
    const { error } = await getSupabase().from('tasks').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  await mutateDb((db) => {
    db.tasks = db.tasks.filter((t) => t.id !== id);
  });
}
