/** useTasks — tarefas de um projeto (ou de todos, sem argumento). */
import { useMemo } from 'react';
import type { Task, UUID } from '../types';
import { useProjects } from './useProjects';

export function useTasks(projectId?: UUID): Task[] {
  const { tasks } = useProjects();
  return useMemo(
    () => (projectId ? tasks.filter((t) => t.projectId === projectId) : tasks),
    [tasks, projectId],
  );
}

export function useTask(taskId: UUID): Task | undefined {
  return useProjects().tasks.find((t) => t.id === taskId);
}
