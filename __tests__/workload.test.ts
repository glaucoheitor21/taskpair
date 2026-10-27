import { calculateBalance, projectProgress, UNBALANCE_THRESHOLD_POINTS } from '../src/utils/workload';
import type { Task, TaskStatus, TaskWeight } from '../src/types';

let seq = 0;
function task(assigneeId: string | null, weight: TaskWeight, status: TaskStatus = 'todo', projectId = 'p'): Task {
  seq += 1;
  return {
    id: `t${seq}`,
    projectId,
    title: `Tarefa ${seq}`,
    status,
    weight,
    assigneeId,
    dueDate: null,
    createdAt: '2026-10-01',
    completedAt: status === 'done' ? '2026-10-02' : null,
  };
}

describe('calculateBalance', () => {
  it('dá score 100 quando a carga está dividida igualmente', () => {
    const b = calculateBalance('p', ['a', 'b'], [task('a', 5), task('b', 3), task('b', 2)]);
    expect(b.balanceScore).toBe(100);
    expect(b.isUnbalanced).toBe(false);
    expect(b.shares.map((s) => s.sharePercent)).toEqual([50, 50]);
  });

  it('sinaliza desequilíbrio acima do limiar e calcula o desvio em p.p.', () => {
    // a = 8 de 10 (80%), ideal 50% → desvio de 30 p.p.
    const b = calculateBalance('p', ['a', 'b'], [task('a', 8), task('b', 2)]);
    const a = b.shares.find((s) => s.userId === 'a')!;
    expect(a.sharePercent).toBe(80);
    expect(a.deviationPoints).toBe(30);
    expect(a.deviationPoints).toBeGreaterThan(UNBALANCE_THRESHOLD_POINTS);
    expect(b.isUnbalanced).toBe(true);
    expect(b.balanceScore).toBe(40);
  });

  it('mede esforço por peso, não por contagem de cartões', () => {
    // a tem 1 cartão de peso 8; b tem 4 cartões de peso 2 → empate.
    const b = calculateBalance('p', ['a', 'b'], [task('a', 8), task('b', 2), task('b', 2), task('b', 2), task('b', 2)]);
    expect(b.balanceScore).toBe(100);
  });

  it('deixa as tarefas sem responsável (pool) fora do denominador', () => {
    const b = calculateBalance('p', ['a', 'b'], [task('a', 3), task('b', 3), task(null, 8), task(null, 5)]);
    expect(b.unassignedWeight).toBe(13);
    expect(b.balanceScore).toBe(100);
  });

  it('conta peso concluído separadamente do atribuído', () => {
    const b = calculateBalance('p', ['a'], [task('a', 5, 'done'), task('a', 3, 'doing')]);
    expect(b.shares[0].assignedWeight).toBe(8);
    expect(b.shares[0].completedWeight).toBe(5);
  });

  it('ignora tarefas de outros projetos', () => {
    const b = calculateBalance('p', ['a', 'b'], [task('a', 3), task('b', 3), task('a', 8, 'todo', 'outro')]);
    expect(b.balanceScore).toBe(100);
  });

  it('não acusa desequilíbrio quando nada foi distribuído', () => {
    const b = calculateBalance('p', ['a', 'b'], [task(null, 5)]);
    expect(b.isUnbalanced).toBe(false);
  });

  it('devolve estado neutro sem integrantes', () => {
    const b = calculateBalance('p', [], [task(null, 5)]);
    expect(b.shares).toEqual([]);
    expect(b.balanceScore).toBe(100);
  });
});

describe('projectProgress', () => {
  it('calcula o progresso pelo peso concluído', () => {
    expect(projectProgress('p', [task('a', 8, 'done'), task('b', 2)])).toBe(80);
  });

  it('é 0 em projeto sem tarefas', () => {
    expect(projectProgress('vazio', [])).toBe(0);
  });
});
