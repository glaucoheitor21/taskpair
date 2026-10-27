/** TaskDetailScreen — ver e editar tarefa: coluna, responsável, peso, prazo; excluir. */
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { TaskForm, clearErrors, validateTask, type TaskFormErrors, type TaskFormValues } from '../../components/task/TaskForm';
import { useProjects } from '../../hooks/useProjects';
import { useTask } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';
import { spacing, typography, useTheme } from '../../theme';
import { formatDatePtBr } from '../../utils/date';
import { STATUS_LABEL } from '../../utils/labels';
import { confirmAsync, notify } from '../../utils/dialog';
import { errorMessage } from '../../services/api';
import type { RootScreenProps } from '../../navigation/types';
import type { Task, User } from '../../types';

function toValues(t: Task): TaskFormValues {
  return {
    title: t.title,
    description: t.description ?? '',
    weight: t.weight,
    assigneeId: t.assigneeId,
    dueDate: t.dueDate,
    status: t.status,
  };
}

export function TaskDetailScreen({ navigation, route }: RootScreenProps<'TaskDetail'>) {
  const { taskId } = route.params;
  const { colors } = useTheme();
  const { user } = useAuth();
  const task = useTask(taskId);
  const { projects, users, updateTask, deleteTask } = useProjects();
  const project = projects.find((p) => p.id === task?.projectId);
  const [values, setValues] = useState<TaskFormValues | null>(task ? toValues(task) : null);
  const [errors, setErrors] = useState<TaskFormErrors & { form?: string }>({});
  const [saving, setSaving] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: project?.subject ?? 'Tarefa' });
  }, [navigation, project?.subject]);

  // Se a tarefa mudar por fora (ex.: "Pegar" no quadro), reflete no formulário.
  useEffect(() => {
    if (task && !values) setValues(toValues(task));
  }, [task, values]);

  const dirty = useMemo(() => {
    if (!task || !values) return false;
    const base = toValues(task);
    return (Object.keys(base) as (keyof TaskFormValues)[]).some((k) => base[k] !== values[k]);
  }, [task, values]);

  if (!task || !values) {
    return (
      <Screen edges={['bottom']}>
        <EmptyState icon="file" title="Tarefa não encontrada" message="Ela pode ter sido excluída." />
      </Screen>
    );
  }

  const members = (project?.members ?? []).map((m) => users[m.userId]).filter(Boolean) as User[];

  const save = async () => {
    const e = validateTask(values);
    setErrors(e);
    if (Object.keys(e).length || !values.weight) return;
    setSaving(true);
    try {
      await updateTask(task, {
        title: values.title,
        description: values.description,
        weight: values.weight,
        assigneeId: values.assigneeId,
        dueDate: values.dueDate,
        status: values.status,
      });
      navigation.goBack();
    } catch (err) {
      setErrors({ form: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!(await confirmAsync('Excluir tarefa', `"${task.title}" será apagada.`, 'Excluir', true))) return;
    try {
      await deleteTask(task.id);
      navigation.goBack();
    } catch (err) {
      notify('Não foi possível excluir', errorMessage(err));
    }
  };

  const claim = async () => {
    if (!user) return;
    setValues((v) => (v ? { ...v, assigneeId: user.id } : v));
  };

  return (
    <Screen
      edges={['bottom']}
      testID="task-detail"
      footer={
        <>
          <Button testID="task-save" title={dirty ? 'Salvar alterações' : 'Sem alterações'} icon="check" onPress={save} loading={saving} disabled={!dirty} />
        </>
      }
    >
      <View style={styles.meta}>
        <Badge label={STATUS_LABEL[task.status]} tone={task.status === 'done' ? 'accent' : task.status === 'review' ? 'warning' : 'primary'} />
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          Criada em {formatDatePtBr(task.createdAt)}
          {task.completedAt ? ` · concluída em ${formatDatePtBr(task.completedAt)}` : ''}
        </Text>
      </View>

      {!values.assigneeId ? (
        <Button testID="task-claim" title="Pegar esta tarefa" icon="user-plus" variant="secondary" onPress={claim} />
      ) : null}

      <TaskForm
        values={values}
        onChange={(patch) => {
          setValues((v) => (v ? { ...v, ...patch } : v));
          setErrors((e) => clearErrors(e, patch));
        }}
        errors={errors}
        members={members}
        currentUserId={user?.id}
        showStatus
      />
      {errors.form ? <Text style={[typography.label, { color: colors.dangerText }]}>{errors.form}</Text> : null}
      <Button title="Excluir tarefa" icon="trash-2" variant="danger" onPress={remove} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
});

export default TaskDetailScreen;
