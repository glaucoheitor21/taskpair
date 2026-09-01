/**
 * Cálculo do Painel de Equilíbrio — o diferencial funcional do TaskPair.
 *
 * A ideia é simples e propositalmente transparente: o app não julga
 * ninguém, ele apenas torna visível a distribuição de esforço que o
 * próprio grupo criou. Por isso o cálculo é documentado e não escondido
 * atrás de uma "nota de participação".
 */

import type { Task, ProjectBalance, WorkloadShare, UUID } from '../types';

/**
 * Desvio máximo tolerado, em pontos percentuais, antes de o app sinalizar
 * desequilíbrio. Com 4 integrantes a divisão ideal é 25% cada; um
 * integrante com 43% (desvio de 18 p.p.) dispara o alerta.
 */
export const UNBALANCE_THRESHOLD_POINTS = 15;

export function calculateBalance(
  projectId: UUID,
  memberIds: UUID[],
  tasks: Task[],
): ProjectBalance {
  const projectTasks = tasks.filter((t) => t.projectId === projectId);

  // Tarefas sem responsável formam o "pool" (RF12) e ficam FORA do
  // denominador: o Painel mede como o trabalho já distribuído foi
  // dividido, não como ele se compara ao que ninguém pegou ainda.
  // Sem isso, um projeto novo com muitas tarefas no pool apareceria
  // como equilibrado só porque todo mundo tem pouco.
  const assignedTasks = projectTasks.filter((t) => t.assigneeId !== null);
  const totalWeight = assignedTasks.reduce((sum, t) => sum + t.weight, 0);
  const unassignedWeight = projectTasks
    .filter((t) => t.assigneeId === null)
    .reduce((sum, t) => sum + t.weight, 0);

  // Projeto sem integrantes não tem divisão ideal — devolve estado neutro.
  if (memberIds.length === 0) {
    return {
      projectId,
      shares: [],
      unassignedWeight,
      balanceScore: 100,
      isUnbalanced: false,
    };
  }

  const idealShare = 100 / memberIds.length;

  const shares: WorkloadShare[] = memberIds.map((userId) => {
    const mine = projectTasks.filter((t) => t.assigneeId === userId);
    const assignedWeight = mine.reduce((sum, t) => sum + t.weight, 0);
    const completedWeight = mine
      .filter((t) => t.status === 'done')
      .reduce((sum, t) => sum + t.weight, 0);
    const sharePercent = totalWeight > 0 ? (assignedWeight / totalWeight) * 100 : 0;

    return {
      userId,
      assignedWeight,
      completedWeight,
      sharePercent: round1(sharePercent),
      deviationPoints: round1(sharePercent - idealShare),
    };
  });

  const maxDeviation = shares.reduce(
    (max, s) => Math.max(max, Math.abs(s.deviationPoints)),
    0,
  );

  return {
    projectId,
    shares,
    unassignedWeight,
    // 100 quando todos têm exatamente a mesma carga; cai conforme o pior desvio.
    balanceScore: round1(Math.max(0, 100 - (maxDeviation / idealShare) * 100)),
    // Com nada distribuído ainda não há desequilíbrio a apontar.
    isUnbalanced: totalWeight > 0 && maxDeviation > UNBALANCE_THRESHOLD_POINTS,
  };
}

/** Progresso do projeto por peso concluído (0–100), não por contagem de cartões. */
export function projectProgress(projectId: UUID, tasks: Task[]): number {
  const projectTasks = tasks.filter((t) => t.projectId === projectId);
  const total = projectTasks.reduce((sum, t) => sum + t.weight, 0);
  if (total === 0) return 0;
  const done = projectTasks
    .filter((t) => t.status === 'done')
    .reduce((sum, t) => sum + t.weight, 0);
  return round1((done / total) * 100);
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
