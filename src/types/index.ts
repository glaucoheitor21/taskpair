/**
 * Modelo de domínio do TaskPair.
 * Estes tipos são a fonte da verdade tanto para os dados mockados do CP5
 * quanto para o contrato da API REST do CP6.
 */

export type UUID = string;
export type ISODate = string; // 'YYYY-MM-DD'

export interface User {
  id: UUID;
  name: string;
  email: string;
  avatarUrl?: string;
  /** Iniciais usadas quando não há avatar. */
  initials: string;
  /** Cor determinística do avatar, derivada do id. */
  color: string;
}

export type MemberRole = 'owner' | 'member';

export interface Member {
  userId: UUID;
  role: MemberRole;
  joinedAt: ISODate;
}

export interface Project {
  id: UUID;
  name: string;
  /** Disciplina / matéria a que o trabalho pertence. */
  subject: string;
  description?: string;
  dueDate: ISODate;
  members: Member[];
  createdBy: UUID;
  createdAt: ISODate;
  archived: boolean;
}

export type TaskStatus = 'todo' | 'doing' | 'review' | 'done';

/**
 * Peso da tarefa. É o que permite ao TaskPair medir carga real em vez de
 * contar cartões: escrever a introdução não é o mesmo esforço que
 * formatar a bibliografia.
 */
export type TaskWeight = 1 | 2 | 3 | 5 | 8;

export interface Task {
  id: UUID;
  projectId: UUID;
  title: string;
  description?: string;
  status: TaskStatus;
  weight: TaskWeight;
  /** Responsável. `null` = tarefa ainda não distribuída. */
  assigneeId: UUID | null;
  dueDate: ISODate | null;
  createdAt: ISODate;
  completedAt: ISODate | null;
}

/** Resultado do cálculo de equilíbrio exibido no Painel de Equilíbrio. */
export interface WorkloadShare {
  userId: UUID;
  /** Soma dos pesos das tarefas atribuídas. */
  assignedWeight: number;
  /** Soma dos pesos das tarefas concluídas. */
  completedWeight: number;
  /** Percentual da carga total do projeto (0–100). */
  sharePercent: number;
  /** Diferença em pontos percentuais para a divisão perfeitamente igual. */
  deviationPoints: number;
}

export interface ProjectBalance {
  projectId: UUID;
  shares: WorkloadShare[];
  /** Peso das tarefas ainda sem responsável — o "pool" (RF12). */
  unassignedWeight: number;
  /** 0–100. 100 = divisão perfeitamente equilibrada. */
  balanceScore: number;
  /** Verdadeiro quando algum integrante ultrapassa o limiar de desequilíbrio. */
  isUnbalanced: boolean;
}
