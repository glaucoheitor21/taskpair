/** KanbanColumn — uma coluna do quadro com cabeçalho (status, contagem, peso) e cartões. */
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Task, TaskStatus, User, UUID } from '../../types';
import { radius, spacing, statusColor, typography, useTheme } from '../../theme';
import { STATUS_LABEL } from '../../utils/labels';
import { TaskCard } from './TaskCard';

export interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  users: Record<UUID, User>;
  width: number;
  onOpen: (task: Task) => void;
  onClaim: (task: Task) => void;
  onAdvance: (task: Task) => void;
  testID?: string;
}

export function KanbanColumn({ status, tasks, users, width, onOpen, onClaim, onAdvance, testID }: KanbanColumnProps) {
  const { colors } = useTheme();
  const weight = tasks.reduce((s, t) => s + t.weight, 0);
  return (
    <View testID={testID} style={[styles.col, { width, backgroundColor: colors.surfaceAlt }]}>
      <View style={styles.head}>
        <View style={[styles.dot, { backgroundColor: statusColor[status] }]} />
        <Text style={[typography.h3, { color: colors.text, flex: 1 }]}>{STATUS_LABEL[status]}</Text>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          {tasks.length} · peso {weight}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
          <Text style={[typography.caption, styles.empty, { color: colors.textMuted }]}>Nenhuma tarefa aqui.</Text>
        ) : (
          tasks.map((t) => (
            <TaskCard
              key={t.id}
              testID={`task-${t.id}`}
              task={t}
              assignee={t.assigneeId ? (users[t.assigneeId] ?? null) : null}
              onPress={() => onOpen(t)}
              onClaim={() => onClaim(t)}
              onAdvance={() => onAdvance(t)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  col: { borderRadius: radius.card, padding: spacing.md, gap: spacing.md, flex: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  list: { gap: spacing.sm, paddingBottom: spacing.lg },
  empty: { textAlign: 'center', paddingVertical: spacing.xl },
});

export default KanbanColumn;
