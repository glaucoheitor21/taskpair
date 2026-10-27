import { fireEvent, render, screen } from '@testing-library/react-native';
import { BalancePanel } from '../src/components/project/BalancePanel';
import { TaskCard } from '../src/components/task/TaskCard';
import { Button } from '../src/components/common/Button';
import { calculateBalance } from '../src/utils/workload';
import type { Task, User } from '../src/types';

const users: Record<string, User> = {
  a: { id: 'a', name: 'Glauco Heitor', email: 'g@x.com', initials: 'GH', color: '#5B3CF0' },
  b: { id: 'b', name: 'Pedro Henrique', email: 'p@x.com', initials: 'PH', color: '#14C4A9' },
};

const baseTask: Task = {
  id: 't1',
  projectId: 'p',
  title: 'Fundamentação teórica',
  status: 'todo',
  weight: 8,
  assigneeId: null,
  dueDate: null,
  createdAt: '2026-10-01',
  completedAt: null,
};

describe('BalancePanel', () => {
  it('mostra o Balance Score e a fatia de cada integrante', async () => {
    const balance = calculateBalance('p', ['a', 'b'], [
      { ...baseTask, id: '1', assigneeId: 'a', weight: 8 },
      { ...baseTask, id: '2', assigneeId: 'b', weight: 2 },
    ]);
    await render(<BalancePanel testID="bp" balance={balance} users={users} />);
    expect(screen.getByLabelText('Balance Score 40 de 100')).toBeTruthy();
    expect(screen.getByText('80%')).toBeTruthy();
    expect(screen.getByText('20%')).toBeTruthy();
  });

  it('explica o estado vazio quando nada foi distribuído', async () => {
    const balance = calculateBalance('p', ['a', 'b'], [baseTask]);
    await render(<BalancePanel balance={balance} users={users} />);
    expect(screen.getByText(/Nenhuma tarefa distribuída/)).toBeTruthy();
  });
});

describe('TaskCard', () => {
  it('oferece "Pegar esta tarefa" para tarefa sem responsável', async () => {
    const onClaim = jest.fn();
    await render(<TaskCard task={baseTask} assignee={null} onClaim={onClaim} />);
    await fireEvent.press(screen.getByLabelText('Pegar esta tarefa'));
    expect(onClaim).toHaveBeenCalledTimes(1);
  });

  it('avança a tarefa para a próxima coluna', async () => {
    const onAdvance = jest.fn();
    await render(<TaskCard task={{ ...baseTask, assigneeId: 'a' }} assignee={users.a} onAdvance={onAdvance} />);
    await fireEvent.press(screen.getByLabelText('Mover para Fazendo'));
    expect(onAdvance).toHaveBeenCalled();
  });
});

describe('Button', () => {
  it('não dispara quando desabilitado', async () => {
    const onPress = jest.fn();
    await render(<Button title="Salvar" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByLabelText('Salvar'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
