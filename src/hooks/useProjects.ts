/** useProjects — projetos do usuário e ações sobre eles. */
import { useContext } from 'react';
import { ProjectContext, type ProjectContextValue } from '../contexts/ProjectContext';
import type { Project, UUID } from '../types';

export function useProjects(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects precisa estar dentro de <ProjectProvider>');
  return ctx;
}

export function useProject(projectId: UUID): Project | undefined {
  return useProjects().projects.find((p) => p.id === projectId);
}
