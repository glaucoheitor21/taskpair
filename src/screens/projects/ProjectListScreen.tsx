/** ProjectListScreen — projetos do usuário com progresso por peso e Balance Score. */
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { Screen } from '../../components/layout/Screen';
import { Header } from '../../components/layout/Header';
import { ProjectCard } from '../../components/project/ProjectCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { useProjects } from '../../hooks/useProjects';
import { shadow, spacing, useTheme } from '../../theme';
import { calculateBalance, projectProgress } from '../../utils/workload';

export function ProjectListScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { projects, tasks, users, loading, error, refresh } = useProjects();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={styles.flex}>
      <Screen
        testID="projects-screen"
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await refresh();
          setRefreshing(false);
        }}
      >
        <Header
          title="Projetos"
          subtitle={projects.length ? `${projects.length} trabalhos em andamento` : undefined}
        />
        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loading} />
        ) : error ? (
          <EmptyState icon="wifi-off" title="Não foi possível carregar" message={error} action={<Button title="Tentar de novo" onPress={refresh} />} />
        ) : projects.length === 0 ? (
          <EmptyState
            icon="folder-plus"
            title="Nenhum projeto"
            message="Crie um projeto e convide o seu grupo pelo e-mail."
            action={<Button title="Criar projeto" icon="plus" onPress={() => navigation.navigate('NewProject')} />}
          />
        ) : (
          <View style={styles.list}>
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                testID={`project-${p.id}`}
                project={p}
                users={users}
                balance={calculateBalance(p.id, p.members.map((m) => m.userId), tasks)}
                progress={projectProgress(p.id, tasks)}
                openTasks={tasks.filter((t) => t.projectId === p.id && t.status !== 'done').length}
                onPress={() => navigation.navigate('ProjectDetail', { projectId: p.id })}
              />
            ))}
          </View>
        )}
      </Screen>
      <Pressable
        testID="new-project-fab"
        accessibilityRole="button"
        accessibilityLabel="Novo projeto"
        onPress={() => navigation.navigate('NewProject')}
        style={({ pressed }) => [styles.fab, shadow.floating, { backgroundColor: pressed ? colors.primaryPressed : colors.primary }]}
      >
        <Feather name="plus" size={26} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { gap: spacing.md, paddingBottom: 72 },
  loading: { marginTop: spacing.xxxl },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProjectListScreen;
