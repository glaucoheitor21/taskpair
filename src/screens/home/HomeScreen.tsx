/** HomeScreen — minha carga, alertas de concentração, próximos prazos e o pool de tarefas. */
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { Screen } from '../../components/layout/Screen';
import { Header, SectionTitle } from '../../components/layout/Header';
import { Avatar } from '../../components/common/Avatar';
import { Card } from '../../components/common/Card';
import { ProgressBar } from '../../components/common/ProgressBar';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { TaskCard } from '../../components/task/TaskCard';
import { BalanceAlert } from '../../components/project/BalancePanel';
import { useAuth } from '../../hooks/useAuth';
import { useProjects } from '../../hooks/useProjects';
import { fontFamily, radius, spacing, typography, useTheme } from '../../theme';
import { calculateBalance } from '../../utils/workload';
import { firstName } from '../../utils/user';
import { errorMessage } from '../../services/api';
import { notify } from '../../utils/dialog';

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function longDate(d = new Date()) {
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

export function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { projects, tasks, users, loading, error, refresh, createDemoProject } = useProjects();
  const [showAll, setShowAll] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingDemo, setCreatingDemo] = useState(false);

  const summary = useMemo(() => {
    const me = user?.id ?? '';
    const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));
    const balances = projects.map((p) => ({
      project: p,
      balance: calculateBalance(p.id, p.members.map((m) => m.userId), tasks),
    }));
    const assigned = tasks.filter((t) => t.assigneeId && projectById[t.projectId]);
    const total = assigned.reduce((s, t) => s + t.weight, 0);
    const mine = assigned.filter((t) => t.assigneeId === me).reduce((s, t) => s + t.weight, 0);
    const myShare = total > 0 ? (mine / total) * 100 : 0;
    // Divisão ideal média: em quanto cada um "deveria" estar, na média dos grupos.
    const idealAvg = projects.length > 0 ? projects.reduce((s, p) => s + 100 / Math.max(1, p.members.length), 0) / projects.length : 0;
    // Minha fatia média por projeto (comparável à ideal média).
    const myAvgShare =
      balances.length > 0
        ? balances.reduce((s, b) => s + (b.balance.shares.find((x) => x.userId === me)?.sharePercent ?? 0), 0) / balances.length
        : 0;
    const upcoming = tasks
      .filter((t) => t.assigneeId === me && t.status !== 'done' && projectById[t.projectId])
      .sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'));
    const pool = tasks.filter((t) => !t.assigneeId && t.status !== 'done' && projectById[t.projectId]);
    return { projectById, balances, myShare, myAvgShare, idealAvg, upcoming, pool, mine };
  }, [projects, tasks, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const comparison =
    summary.myAvgShare > summary.idealAvg + 5 ? 'acima' : summary.myAvgShare < summary.idealAvg - 5 ? 'abaixo' : 'na';

  return (
    <Screen refreshing={refreshing} onRefresh={onRefresh} testID="home-screen">
      <Header
        overline={longDate()}
        title={`Olá, ${firstName(user?.name ?? '')}`}
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Abrir perfil" onPress={() => navigation.navigate('App', { screen: 'Profile' })}>
            <Avatar user={user} size={48} />
          </Pressable>
        }
      />

      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : error ? (
        <EmptyState icon="wifi-off" title="Não foi possível carregar" message={error} action={<Button title="Tentar de novo" onPress={refresh} />} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon="users"
          title="Nenhum projeto ainda"
          message="Crie o primeiro trabalho em grupo ou gere um projeto de exemplo para conhecer o app."
          action={
            <View style={styles.gap}>
              <Button title="Criar projeto" icon="plus" onPress={() => navigation.navigate('NewProject')} />
              <Button
                title="Gerar projeto de exemplo"
                variant="ghost"
                loading={creatingDemo}
                onPress={async () => {
                  setCreatingDemo(true);
                  try {
                    await createDemoProject();
                  } catch (e) {
                    notify('Não foi possível criar', errorMessage(e));
                  } finally {
                    setCreatingDemo(false);
                  }
                }}
              />
            </View>
          }
        />
      ) : (
        <>
          <Card testID="home-load">
            <View style={styles.loadTop}>
              <View style={styles.flex}>
                <Text style={[typography.overline, { color: colors.textMuted }]}>Sua carga total</Text>
                <Text style={[typography.caption, { color: colors.textMuted }]}>
                  em {projects.length} {projects.length === 1 ? 'projeto ativo' : 'projetos ativos'} · peso {summary.mine}
                </Text>
              </View>
              <Text style={[styles.bigNumber, { color: colors.text }]}>{Math.round(summary.myShare)}%</Text>
            </View>
            <View style={styles.loadBar}>
              <ProgressBar value={summary.myShare} color={colors.primary} height={10} />
            </View>
            <Text style={[typography.body, { color: colors.text }]}>
              Você está{' '}
              <Text style={{ color: comparison === 'na' ? colors.accentText : colors.warningText, fontFamily: fontFamily.bodySemiBold }}>
                {comparison === 'na' ? 'na média' : comparison}
              </Text>
              {comparison === 'na' ? ' da divisão dos seus grupos.' : ' da divisão média dos seus grupos.'}
            </Text>
          </Card>

          {summary.balances
            .filter((b) => b.balance.isUnbalanced)
            .map(({ project }) => (
              <BalanceAlert key={project.id} testID={`home-alert-${project.id}`}>
                <Text style={[typography.body, { color: colors.text }]}>
                  Em <Text style={{ fontFamily: fontFamily.bodySemiBold }}>{project.subject}</Text> a carga está concentrada. Querem redistribuir?
                </Text>
                <Pressable accessibilityRole="link" onPress={() => navigation.navigate('ProjectDetail', { projectId: project.id })}>
                  <Text style={[typography.bodyStrong, { color: colors.warningText }]}>Ver Painel de Equilíbrio →</Text>
                </Pressable>
              </BalanceAlert>
            ))}

          <SectionTitle
            right={
              summary.upcoming.length > 4 ? (
                <Pressable accessibilityRole="button" onPress={() => setShowAll((v) => !v)} hitSlop={10}>
                  <Text style={[typography.label, { color: colors.primary }]}>{showAll ? 'Ver menos' : 'Ver todos'}</Text>
                </Pressable>
              ) : undefined
            }
          >
            Próximos prazos
          </SectionTitle>
          {summary.upcoming.length === 0 ? (
            <Card>
              <Text style={[typography.body, { color: colors.textMuted }]}>Nada pendente com você. Que tal pegar uma tarefa do pool?</Text>
            </Card>
          ) : (
            <View style={styles.gapSm}>
              {(showAll ? summary.upcoming : summary.upcoming.slice(0, 4)).map((t) => (
                <TaskCard
                  key={t.id}
                  testID={`home-task-${t.id}`}
                  task={t}
                  projectName={summary.projectById[t.projectId]?.subject}
                  onPress={() => navigation.navigate('TaskDetail', { taskId: t.id })}
                />
              ))}
            </View>
          )}

          {summary.pool.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => navigation.navigate('App', { screen: 'Projects' })}
              style={[styles.pool, { backgroundColor: colors.surfaceAlt }]}
            >
              <Feather name="plus" size={22} color={colors.primary} />
              <Text style={[typography.body, styles.flex, { color: colors.text }]}>
                <Text style={{ fontFamily: fontFamily.bodySemiBold }}>
                  {summary.pool.length} {summary.pool.length === 1 ? 'tarefa' : 'tarefas'}
                </Text>{' '}
                sem responsável esperando alguém pegar.
              </Text>
            </Pressable>
          ) : null}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gap: { gap: spacing.sm },
  gapSm: { gap: spacing.sm },
  loading: { marginTop: spacing.xxxl },
  loadTop: { flexDirection: 'row', alignItems: 'center' },
  bigNumber: { fontFamily: fontFamily.displayBold, fontSize: 40, letterSpacing: -1 },
  loadBar: { marginVertical: spacing.md },
  pool: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.card },
});

export default HomeScreen;
