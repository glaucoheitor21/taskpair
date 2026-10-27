/**
 * KanbanScreen — quadro com as quatro colunas. Uma coluna por vez, com a
 * próxima "espiando" na borda; as abas no topo saltam direto para a coluna.
 */
import { useLayoutEffect, useMemo, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { KanbanColumn } from '../../components/task/KanbanColumn';
import { useProject, useProjects } from '../../hooks/useProjects';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';
import { radius, spacing, statusColor, typography, useTheme } from '../../theme';
import { STATUS_LABEL, STATUS_ORDER, nextStatus } from '../../utils/labels';
import { notify } from '../../utils/dialog';
import { errorMessage } from '../../services/api';
import type { Task } from '../../types';
import type { RootScreenProps } from '../../navigation/types';

type Filter = 'all' | 'mine' | 'pool';

export function KanbanScreen({ navigation, route }: RootScreenProps<'Kanban'>) {
  const { projectId } = route.params;
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { user } = useAuth();
  const project = useProject(projectId);
  const tasks = useTasks(projectId);
  const { users, updateTask } = useProjects();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [active, setActive] = useState(0);
  const [filter, setFilter] = useState<Filter>('all');

  const colWidth = Math.min(width * 0.84, 420);
  const gap = spacing.md;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: project?.subject ?? 'Quadro',
      headerRight: () => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Nova tarefa"
          hitSlop={12}
          onPress={() => navigation.navigate('NewTask', { projectId })}
        >
          <Feather name="plus" size={24} color={colors.primary} />
        </Pressable>
      ),
    });
  }, [navigation, project?.subject, projectId, colors.primary]);

  const visible = useMemo(() => {
    if (filter === 'mine') return tasks.filter((t) => t.assigneeId === user?.id);
    if (filter === 'pool') return tasks.filter((t) => !t.assigneeId);
    return tasks;
  }, [tasks, filter, user]);

  const byStatus = useMemo(
    () =>
      Object.fromEntries(
        STATUS_ORDER.map((s) => [
          s,
          visible
            .filter((t) => t.status === s)
            .sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999')),
        ]),
      ) as Record<Task['status'], Task[]>,
    [visible],
  );

  const goTo = (i: number) => {
    setActive(i);
    scrollRef.current?.scrollTo({ x: i * (colWidth + gap), animated: true });
  };

  const safeUpdate = async (task: Task, patch: Parameters<typeof updateTask>[1]) => {
    try {
      await updateTask(task, patch);
    } catch (e) {
      notify('Não foi possível salvar', errorMessage(e));
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={[styles.flex, { backgroundColor: colors.background }]} testID="kanban-screen">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabs}>
        {STATUS_ORDER.map((s, i) => (
          <Pressable
            key={s}
            accessibilityRole="tab"
            accessibilityState={{ selected: active === i }}
            onPress={() => goTo(i)}
            style={[styles.tab, { backgroundColor: active === i ? colors.surface : 'transparent', borderColor: active === i ? colors.border : 'transparent' }]}
          >
            <View style={[styles.dot, { backgroundColor: statusColor[s] }]} />
            <Text style={[typography.label, { color: active === i ? colors.text : colors.textMuted }]}>
              {STATUS_LABEL[s]} {byStatus[s].length}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.filters}>
        {(
          [
            ['all', 'Todas'],
            ['mine', 'Minhas'],
            ['pool', 'Sem responsável'],
          ] as [Filter, string][]
        ).map(([f, label]) => (
          <Pressable
            key={f}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === f }}
            onPress={() => setFilter(f)}
            style={[styles.filter, { backgroundColor: filter === f ? colors.primary : colors.surfaceAlt }]}
          >
            <Text style={[typography.caption, { color: filter === f ? colors.onPrimary : colors.primary }]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={colWidth + gap}
        decelerationRate="fast"
        contentContainerStyle={[styles.columns, { gap }]}
        onMomentumScrollEnd={(e) => setActive(Math.round(e.nativeEvent.contentOffset.x / (colWidth + gap)))}
      >
        {STATUS_ORDER.map((s) => (
          <KanbanColumn
            key={s}
            testID={`column-${s}`}
            status={s}
            width={colWidth}
            tasks={byStatus[s]}
            users={users}
            onOpen={(t) => navigation.navigate('TaskDetail', { taskId: t.id })}
            onClaim={(t) => user && safeUpdate(t, { assigneeId: user.id })}
            onAdvance={(t) => {
              const next = nextStatus(t.status);
              if (next) safeUpdate(t, { status: next });
            }}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  tabsScroll: { flexGrow: 0 },
  tabs: { gap: spacing.xs, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  filters: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  filter: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: radius.pill },
  columns: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
});

export default KanbanScreen;
