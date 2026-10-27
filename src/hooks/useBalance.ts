/** useBalance — Painel de Equilíbrio de um projeto, sempre recalculado (nunca persistido). */
import { useMemo } from 'react';
import type { ProjectBalance, UUID } from '../types';
import { calculateBalance, projectProgress } from '../utils/workload';
import { useProjects } from './useProjects';

export function useBalance(projectId: UUID): { balance: ProjectBalance; progress: number } {
  const { projects, tasks } = useProjects();
  const project = projects.find((p) => p.id === projectId);
  return useMemo(() => {
    const memberIds = project?.members.map((m) => m.userId) ?? [];
    return {
      balance: calculateBalance(projectId, memberIds, tasks),
      progress: projectProgress(projectId, tasks),
    };
  }, [project, projectId, tasks]);
}
