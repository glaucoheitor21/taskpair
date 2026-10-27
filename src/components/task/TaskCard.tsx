/** TaskCard — cartão de tarefa: título, peso, prazo, responsável e ação rápida. */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import type { Task, User } from '../../types';
import { radius, spacing, statusColor, typography, useTheme } from '../../theme';
import { Avatar } from '../common/Avatar';
import { DeadlineChip } from './DeadlineChip';
import { STATUS_LABEL, nextStatus } from '../../utils/labels';

export interface TaskCardProps {
  task: Task;
  assignee?: User | null;
  /** Nome do projeto, quando o cartão aparece fora do quadro (Home). */
  projectName?: string;
  onPress?: () => void;
  /** Tarefa sem responsável: "Pegar esta tarefa". */
  onClaim?: () => void;
  /** Avança para a próxima coluna. */
  onAdvance?: () => void;
  testID?: string;
}

export function TaskCard({ task, assignee, projectName, onPress, onClaim, onAdvance, testID }: TaskCardProps) {
  const { colors } = useTheme();
  const done = task.status === 'done';
  const next = nextStatus(task.status);
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${task.title}, peso ${task.weight}, ${STATUS_LABEL[task.status]}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border, borderLeftColor: statusColor[task.status] },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.top}>
        <View style={styles.titleWrap}>
          {projectName ? (
            <Text numberOfLines={1} style={[typography.overline, { color: colors.textMuted }]}>
              {projectName}
            </Text>
          ) : null}
          <Text
            numberOfLines={2}
            style={[typography.bodyStrong, { color: done ? colors.textMuted : colors.text }, done && styles.strike]}
          >
            {task.title}
          </Text>
        </View>
        <View style={[styles.weight, { backgroundColor: colors.surfaceAlt }]} accessibilityLabel={`Peso ${task.weight}`}>
          <Text style={[typography.label, { color: colors.primary }]}>{task.weight}</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <DeadlineChip date={task.dueDate} done={done} />
        <View style={styles.spacer} />
        {assignee !== undefined && <Avatar user={assignee} size={26} />}
      </View>

      {(onClaim && !task.assigneeId) || (onAdvance && next) ? (
        <View style={styles.actions}>
          {onClaim && !task.assigneeId ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Pegar esta tarefa"
              onPress={onClaim}
              hitSlop={8}
              style={[styles.action, { backgroundColor: colors.primary }]}
            >
              <Feather name="user-plus" size={14} color={colors.onPrimary} />
              <Text style={[typography.label, { color: colors.onPrimary }]}>Pegar esta tarefa</Text>
            </Pressable>
          ) : null}
          {onAdvance && next ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Mover para ${STATUS_LABEL[next]}`}
              onPress={onAdvance}
              hitSlop={8}
              style={[styles.action, { backgroundColor: colors.surfaceAlt }]}
            >
              <Text style={[typography.label, { color: colors.primary }]}>{STATUS_LABEL[next]}</Text>
              <Feather name="arrow-right" size={14} color={colors.primary} />
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 4,
    padding: spacing.md,
    gap: spacing.sm,
  },
  pressed: { opacity: 0.8 },
  top: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  titleWrap: { flex: 1, gap: 2 },
  strike: { textDecorationLine: 'line-through' },
  weight: { minWidth: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  bottom: { flexDirection: 'row', alignItems: 'center' },
  spacer: { flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
});

export default TaskCard;
