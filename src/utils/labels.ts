/** Rótulos de interface do domínio (pt-BR). */
import type { TaskStatus, TaskWeight } from '../types';

export const STATUS_ORDER: TaskStatus[] = ['todo', 'doing', 'review', 'done'];

export const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'A fazer',
  doing: 'Fazendo',
  review: 'Revisão',
  done: 'Concluído',
};

export const WEIGHTS: TaskWeight[] = [1, 2, 3, 5, 8];

/** Como explicar cada peso para quem está criando a tarefa. */
export const WEIGHT_HINT: Record<TaskWeight, string> = {
  1: 'Rapidinha — menos de 1h',
  2: 'Pequena — uma tarde',
  3: 'Média — um ou dois dias',
  5: 'Grande — boa parte da semana',
  8: 'Enorme — considere dividir',
};

export function nextStatus(s: TaskStatus): TaskStatus | null {
  const i = STATUS_ORDER.indexOf(s);
  return i < STATUS_ORDER.length - 1 ? STATUS_ORDER[i + 1] : null;
}
