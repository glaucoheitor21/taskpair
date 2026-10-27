/** TaskForm — campos de tarefa compartilhados por "Nova tarefa" e "Detalhe da tarefa". */
import { StyleSheet, Text, View } from 'react-native';
import type { TaskStatus, TaskWeight, User, UUID } from '../../types';
import { spacing, statusColor, typography, useTheme } from '../../theme';
import { Input } from '../common/Input';
import { ChipGroup } from '../common/ChipGroup';
import { DateField } from '../common/DateField';
import { Avatar } from '../common/Avatar';
import { STATUS_LABEL, STATUS_ORDER, WEIGHTS, WEIGHT_HINT } from '../../utils/labels';

export interface TaskFormValues {
  title: string;
  description: string;
  weight: TaskWeight | null;
  assigneeId: UUID | null;
  dueDate: string | null;
  status: TaskStatus;
}

export type TaskFormErrors = Partial<Record<keyof TaskFormValues, string>>;

export function validateTask(v: TaskFormValues): TaskFormErrors {
  const e: TaskFormErrors = {};
  if (v.title.trim().length < 3) e.title = 'Dê um título com pelo menos 3 caracteres.';
  if (!v.weight) e.weight = 'O peso é obrigatório — é ele que alimenta o Painel de Equilíbrio.';
  return e;
}

/** Remove o erro dos campos que o usuário acabou de alterar. */
export function clearErrors<E extends Record<string, string | undefined>>(errors: E, patch: object): E {
  const next = { ...errors };
  for (const k of Object.keys(patch)) delete next[k];
  delete next.form;
  return next;
}

export interface TaskFormProps {
  values: TaskFormValues;
  onChange: (patch: Partial<TaskFormValues>) => void;
  errors: TaskFormErrors;
  members: User[];
  currentUserId?: UUID;
  showStatus?: boolean;
}

export function TaskForm({ values, onChange, errors, members, currentUserId, showStatus }: TaskFormProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.form}>
      <Input
        testID="task-title"
        label="Título"
        value={values.title}
        onChangeText={(title) => onChange({ title })}
        placeholder="Ex.: Fundamentação teórica"
        error={errors.title}
      />
      <Input
        testID="task-description"
        label="Descrição (opcional)"
        value={values.description}
        onChangeText={(description) => onChange({ description })}
        placeholder="O que precisa ser entregue?"
        multiline
      />

      <View style={styles.gapXs}>
        <ChipGroup
          testID="task-weight"
          label="Peso (esforço)"
          options={WEIGHTS.map((w) => ({ value: w, label: String(w) }))}
          value={values.weight}
          onChange={(weight) => onChange({ weight })}
          error={errors.weight}
        />
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          {values.weight ? WEIGHT_HINT[values.weight] : 'Escala 1 · 2 · 3 · 5 · 8 — escrever a introdução não é o mesmo que formatar a bibliografia.'}
        </Text>
      </View>

      <ChipGroup
        testID="task-assignee"
        label="Responsável"
        options={[
          { value: null, label: 'Ninguém (pool)' },
          ...members.map((m) => ({
            value: m.id,
            label: m.id === currentUserId ? 'Eu' : m.name.split(' ')[0],
            left: <Avatar user={m} size={20} />,
          })),
        ]}
        value={values.assigneeId}
        onChange={(assigneeId) => onChange({ assigneeId })}
      />

      {showStatus ? (
        <ChipGroup
          testID="task-status"
          label="Coluna"
          options={STATUS_ORDER.map((s) => ({
            value: s,
            label: STATUS_LABEL[s],
            color: s === 'review' ? colors.warningText : s === 'done' ? colors.accentText : undefined,
            left: <View style={[styles.dot, { backgroundColor: statusColor[s] }]} />,
          }))}
          value={values.status}
          onChange={(status) => onChange({ status })}
        />
      ) : null}

      <DateField testID="task-due" label="Prazo" optional value={values.dueDate} onChange={(dueDate) => onChange({ dueDate })} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.xl },
  gapXs: { gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

export default TaskForm;
