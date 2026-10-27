/**
 * Testes de integração da camada de serviços no modo `local`
 * (AsyncStorage mockado pelo jest.setup.js).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as auth from '../src/services/authService';
import * as projects from '../src/services/projectService';
import * as tasks from '../src/services/taskService';
import { __clearCache, DEMO_PASSWORD } from '../src/services/localDb';
import { DATA_SOURCE } from '../src/services/api';

beforeEach(async () => {
  await AsyncStorage.clear();
  __clearCache();
});

it('roda no modo local durante os testes', () => {
  expect(DATA_SOURCE).toBe('local');
});

describe('authService', () => {
  it('entra com a conta de demonstração', async () => {
    const u = await auth.signIn('Glauco@fiap.com.br', DEMO_PASSWORD);
    expect(u.name).toBe('Glauco Heitor');
    expect(await auth.getSession()).toMatchObject({ id: u.id });
  });

  it('recusa senha errada', async () => {
    await expect(auth.signIn('glauco@fiap.com.br', 'errada')).rejects.toThrow('E-mail ou senha incorretos.');
  });

  it('cadastra, impede e-mail duplicado e encerra a sessão', async () => {
    const u = await auth.signUp('Ana Souza', 'ana@fiap.com.br', 'segredo1');
    expect(u.initials).toBe('AS');
    await expect(auth.signUp('Outra Ana', 'ana@fiap.com.br', 'x12345')).rejects.toThrow('já tem conta');
    await auth.signOut();
    expect(await auth.getSession()).toBeNull();
  });
});

describe('projectService + taskService', () => {
  it('lista só os projetos de que o usuário participa', async () => {
    const list = await projects.listProjects('u4');
    expect(list.map((p) => p.id).sort()).toEqual(['p2', 'p3']);
  });

  it('cria projeto com o criador como owner e persiste', async () => {
    const p = await projects.createProject({ name: 'TCC', subject: 'TCC', dueDate: '2026-12-10' }, 'u1');
    expect(p.members).toEqual([expect.objectContaining({ userId: 'u1', role: 'owner' })]);
    __clearCache(); // força reler do AsyncStorage
    expect((await projects.listProjects('u1')).some((x) => x.id === p.id)).toBe(true);
  });

  it('convida por e-mail e recusa convite duplicado ou inexistente', async () => {
    const u = await projects.inviteMember('p1', 'marina@fiap.com.br');
    expect(u.id).toBe('u3');
    await expect(projects.inviteMember('p1', 'marina@fiap.com.br')).rejects.toThrow('já está no projeto');
    await expect(projects.inviteMember('p1', 'ninguem@fiap.com.br')).rejects.toThrow('Nenhuma conta');
  });

  it('remove integrante e devolve as tarefas dele ao pool', async () => {
    await projects.removeMember('p2', 'u4');
    const t = (await tasks.listTasks(['p2'])).find((x) => x.id === 't15');
    expect(t?.assigneeId).toBeNull();
  });

  it('cria, conclui, reabre e exclui tarefa', async () => {
    const t = await tasks.createTask({ projectId: 'p1', title: 'Vídeo', weight: 3, assigneeId: 'u2', dueDate: null });
    expect(t.status).toBe('todo');
    const done = await tasks.updateTask(t, { status: 'done' });
    expect(done.completedAt).not.toBeNull();
    const reopened = await tasks.updateTask(done, { status: 'doing' });
    expect(reopened.completedAt).toBeNull();
    await tasks.deleteTask(t.id);
    expect((await tasks.listTasks(['p1'])).some((x) => x.id === t.id)).toBe(false);
  });
});
