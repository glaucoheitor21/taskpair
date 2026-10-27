import {
  addDaysISO,
  daysUntil,
  formatDatePtBr,
  formatShort,
  maskDateBr,
  parseDateBr,
  relativeDueLabel,
  urgencyOf,
} from '../src/utils/date';
import { isEmail, isRequired, minLength } from '../src/utils/validators';
import { colorFor, firstName, initialsOf } from '../src/utils/user';
import { nextStatus } from '../src/utils/labels';
import { validateTask } from '../src/components/task/TaskForm';

const TODAY = new Date(2026, 9, 27); // 27/10/2026

describe('datas', () => {
  it('conta dias até o prazo', () => {
    expect(daysUntil('2026-10-30', TODAY)).toBe(3);
    expect(daysUntil('2026-10-25', TODAY)).toBe(-2);
  });

  it('classifica a urgência do prazo', () => {
    expect(urgencyOf('2026-10-26', TODAY)).toBe('overdue');
    expect(urgencyOf('2026-10-27', TODAY)).toBe('today');
    expect(urgencyOf('2026-10-29', TODAY)).toBe('soon');
    expect(urgencyOf('2026-11-15', TODAY)).toBe('later');
  });

  it('gera rótulos relativos em pt-BR', () => {
    expect(relativeDueLabel('2026-10-27', TODAY)).toBe('Hoje');
    expect(relativeDueLabel('2026-10-28', TODAY)).toBe('Amanhã');
    expect(relativeDueLabel('2026-11-01', TODAY)).toBe('em 5 dias');
    expect(relativeDueLabel('2026-10-24', TODAY)).toBe('3 dias atrás');
  });

  it('converte DD/MM/AAAA e rejeita datas impossíveis', () => {
    expect(parseDateBr('28/11/2026')).toBe('2026-11-28');
    expect(parseDateBr('31/02/2026')).toBeNull();
    expect(parseDateBr('2026-11-28')).toBeNull();
  });

  it('aplica a máscara de digitação', () => {
    expect(maskDateBr('2811')).toBe('28/11');
    expect(maskDateBr('28112026')).toBe('28/11/2026');
    expect(maskDateBr('28/11/2026999')).toBe('28/11/2026');
  });

  it('formata e soma dias', () => {
    expect(formatDatePtBr('2026-11-28')).toBe('28/11/2026');
    expect(formatShort('2026-11-28')).toBe('28 nov');
    expect(addDaysISO(7, TODAY)).toBe('2026-11-03');
  });
});

describe('validações', () => {
  it('valida e-mail e campos obrigatórios', () => {
    expect(isEmail('glauco@fiap.com.br')).toBe(true);
    expect(isEmail('glauco@')).toBe(false);
    expect(isRequired('  ')).toBe(false);
    expect(minLength('abc', 3)).toBe(true);
  });

  it('exige título e peso na tarefa', () => {
    const base = { title: 'Introdução', description: '', weight: 3 as const, assigneeId: null, dueDate: null, status: 'todo' as const };
    expect(validateTask(base)).toEqual({});
    expect(validateTask({ ...base, weight: null })).toHaveProperty('weight');
    expect(validateTask({ ...base, title: 'ab' })).toHaveProperty('title');
  });
});

describe('usuário e status', () => {
  it('gera iniciais e primeiro nome', () => {
    expect(initialsOf('Glauco Heitor Gonçalves')).toBe('GG');
    expect(initialsOf('Pedro')).toBe('PE');
    expect(firstName('Pedro Henrique')).toBe('Pedro');
  });

  it('gera cor de avatar determinística', () => {
    expect(colorFor('u1')).toBe(colorFor('u1'));
    expect(colorFor('u1')).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('avança o status pela ordem do quadro', () => {
    expect(nextStatus('todo')).toBe('doing');
    expect(nextStatus('review')).toBe('done');
    expect(nextStatus('done')).toBeNull();
  });
});
