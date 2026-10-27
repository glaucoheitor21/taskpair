/**
 * ProjectContext — projetos, tarefas e perfis do usuário logado.
 *
 * Carrega tudo de uma vez ao entrar e mantém em memória; cada ação chama o
 * service e atualiza o estado local com o resultado, para a interface
 * responder sem esperar um novo carregamento completo.
 */
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Project, Task, User, UUID } from '../types';
import { useAuth } from '../hooks/useAuth';
import * as projectService from '../services/projectService';
import * as taskService from '../services/taskService';
import { createDemoProject } from '../services/demoService';
import { resetDb } from '../services/localDb';
import { errorMessage } from '../services/api';

export interface ProjectContextValue {
  projects: Project[];
  tasks: Task[];
  users: Record<UUID, User>;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createProject: (input: projectService.NewProjectInput) => Promise<Project>;
  updateProject: (id: UUID, patch: Parameters<typeof projectService.updateProject>[1]) => Promise<void>;
  deleteProject: (id: UUID) => Promise<void>;
  inviteMember: (projectId: UUID, email: string) => Promise<User>;
  removeMember: (projectId: UUID, userId: UUID) => Promise<void>;
  createTask: (input: taskService.NewTaskInput) => Promise<Task>;
  updateTask: (task: Task, patch: taskService.TaskPatch) => Promise<Task>;
  deleteTask: (id: UUID) => Promise<void>;
  createDemoProject: () => Promise<Project>;
  resetDemoData: () => Promise<void>;
}

export const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<Record<UUID, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setError(null);
    try {
      const ps = (await projectService.listProjects(user.id)).filter((p) => !p.archived);
      const [ts, us] = await Promise.all([
        taskService.listTasks(ps.map((p) => p.id)),
        projectService.listUsers([...new Set([user.id, ...ps.flatMap((p) => p.members.map((m) => m.userId))])]),
      ]);
      setProjects(ps);
      setTasks(ts);
      setUsers(Object.fromEntries(us.map((u) => [u.id, u])));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    setProjects([]);
    setTasks([]);
    refresh();
  }, [refresh]);

  const value = useMemo<ProjectContextValue>(() => {
    const requireUser = () => {
      if (!user) throw new Error('Sessão expirada.');
      return user;
    };
    return {
      projects,
      tasks,
      users,
      loading,
      error,
      refresh,
      createProject: async (input) => {
        const p = await projectService.createProject(input, requireUser().id);
        setProjects((prev) => [...prev, p].sort((a, b) => a.dueDate.localeCompare(b.dueDate)));
        return p;
      },
      updateProject: async (id, patch) => {
        await projectService.updateProject(id, patch);
        setProjects((prev) =>
          patch.archived ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        );
      },
      deleteProject: async (id) => {
        await projectService.deleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setTasks((prev) => prev.filter((t) => t.projectId !== id));
      },
      inviteMember: async (projectId, email) => {
        const invited = await projectService.inviteMember(projectId, email);
        setUsers((prev) => ({ ...prev, [invited.id]: invited }));
        setProjects((prev) =>
          prev.map((p) =>
            p.id === projectId
              ? { ...p, members: [...p.members, { userId: invited.id, role: 'member', joinedAt: new Date().toISOString().slice(0, 10) }] }
              : p,
          ),
        );
        return invited;
      },
      removeMember: async (projectId, userId) => {
        await projectService.removeMember(projectId, userId);
        setProjects((prev) =>
          prev.map((p) => (p.id === projectId ? { ...p, members: p.members.filter((m) => m.userId !== userId) } : p)),
        );
        setTasks((prev) =>
          prev.map((t) => (t.projectId === projectId && t.assigneeId === userId ? { ...t, assigneeId: null } : t)),
        );
      },
      createTask: async (input) => {
        const t = await taskService.createTask(input);
        setTasks((prev) => [...prev, t]);
        return t;
      },
      updateTask: async (task, patch) => {
        // Otimista: a coluna muda na hora; se falhar, volta.
        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, ...patch } : t)));
        try {
          const saved = await taskService.updateTask(task, patch);
          setTasks((prev) => prev.map((t) => (t.id === task.id ? saved : t)));
          return saved;
        } catch (e) {
          setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
          throw e;
        }
      },
      deleteTask: async (id) => {
        await taskService.deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
      },
      createDemoProject: async () => {
        const p = await createDemoProject(requireUser().id);
        await refresh();
        return p;
      },
      resetDemoData: async () => {
        await resetDb();
        await refresh();
      },
    };
  }, [projects, tasks, users, loading, error, refresh, user]);

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}
