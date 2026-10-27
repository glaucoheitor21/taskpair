/** NewTaskScreen — criação de tarefa com peso obrigatório. */
import { useState } from 'react';
import { Text } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/common/Button';
import { TaskForm, clearErrors, validateTask, type TaskFormErrors, type TaskFormValues } from '../../components/task/TaskForm';
import { useProject, useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../hooks/useAuth';
import { typography, useTheme } from '../../theme';
import { errorMessage } from '../../services/api';
import type { RootScreenProps } from '../../navigation/types';
import type { User } from '../../types';

export function NewTaskScreen({ navigation, route }: RootScreenProps<'NewTask'>) {
  const { projectId, assigneeId = null } = route.params;
  const { colors } = useTheme();
  const { user } = useAuth();
  const project = useProject(projectId);
  const { users, createTask } = useProjects();
  const [values, setValues] = useState<TaskFormValues>({
    title: '',
    description: '',
    weight: null,
    assigneeId,
    dueDate: null,
    status: 'todo',
  });
  const [errors, setErrors] = useState<TaskFormErrors & { form?: string }>({});
  const [saving, setSaving] = useState(false);

  const members = (project?.members ?? []).map((m) => users[m.userId]).filter(Boolean) as User[];

  const save = async () => {
    const e = validateTask(values);
    setErrors(e);
    if (Object.keys(e).length || !values.weight) return;
    setSaving(true);
    try {
      await createTask({
        projectId,
        title: values.title,
        description: values.description,
        weight: values.weight,
        assigneeId: values.assigneeId,
        dueDate: values.dueDate,
      });
      navigation.goBack();
    } catch (err) {
      setErrors({ form: errorMessage(err) });
      setSaving(false);
    }
  };

  return (
    <Screen
      edges={['bottom']}
      testID="new-task-screen"
      footer={<Button testID="task-save" title="Criar tarefa" icon="check" onPress={save} loading={saving} />}
    >
      {project ? <Text style={[typography.overline, { color: colors.textMuted }]}>{project.name}</Text> : null}
      <TaskForm
        values={values}
        onChange={(patch) => {
          setValues((v) => ({ ...v, ...patch }));
          setErrors((e) => clearErrors(e, patch));
        }}
        errors={errors}
        members={members}
        currentUserId={user?.id}
      />
      {errors.form ? <Text style={[typography.label, { color: colors.dangerText }]}>{errors.form}</Text> : null}
    </Screen>
  );
}

export default NewTaskScreen;
