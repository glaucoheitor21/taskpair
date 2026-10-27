/**
 * Cria um projeto de exemplo para a conta logada — útil no primeiro acesso
 * com Supabase, quando o banco ainda está vazio.
 */
import type { Project, TaskStatus, TaskWeight, UUID } from '../types';
import { createProject } from './projectService';
import { createTask } from './taskService';
import { addDaysISO } from '../utils/date';

const DEMO_TASKS: { title: string; weight: TaskWeight; status: TaskStatus; mine: boolean; due: number }[] = [
  { title: 'Definir tema e escopo', weight: 2, status: 'done', mine: true, due: -10 },
  { title: 'Levantamento bibliográfico', weight: 5, status: 'done', mine: true, due: -3 },
  { title: 'Fundamentação teórica', weight: 8, status: 'doing', mine: true, due: 2 },
  { title: 'Metodologia', weight: 5, status: 'todo', mine: true, due: 6 },
  { title: 'Formatar referências (ABNT)', weight: 1, status: 'todo', mine: false, due: 12 },
  { title: 'Slides da apresentação', weight: 3, status: 'todo', mine: false, due: 14 },
];

export async function createDemoProject(userId: UUID): Promise<Project> {
  const project = await createProject(
    {
      name: 'Projeto de exemplo — Artigo científico',
      subject: 'Metodologia Científica',
      description: 'Projeto criado automaticamente para você explorar o TaskPair.',
      dueDate: addDaysISO(21),
    },
    userId,
  );
  for (const t of DEMO_TASKS) {
    await createTask({
      projectId: project.id,
      title: t.title,
      weight: t.weight,
      status: t.status,
      assigneeId: t.mine ? userId : null,
      dueDate: addDaysISO(t.due),
    });
  }
  return project;
}
