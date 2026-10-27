/** ProjectDetailScreen — Painel de Equilíbrio, integrantes, convite e ações do projeto. */
import { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { Screen } from '../../components/layout/Screen';
import { SectionTitle } from '../../components/layout/Header';
import { BalanceAlert, BalancePanel } from '../../components/project/BalancePanel';
import { MemberList } from '../../components/project/MemberList';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { ProgressBar } from '../../components/common/ProgressBar';
import { EmptyState } from '../../components/common/EmptyState';
import { DeadlineChip } from '../../components/task/DeadlineChip';
import { useProject, useProjects } from '../../hooks/useProjects';
import { useBalance } from '../../hooks/useBalance';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../hooks/useAuth';
import { fontFamily, radius, spacing, typography, useTheme } from '../../theme';
import { formatDatePtBr } from '../../utils/date';
import { isEmail } from '../../utils/validators';
import { confirmAsync, notify } from '../../utils/dialog';
import { errorMessage } from '../../services/api';
import type { RootScreenProps } from '../../navigation/types';

export function ProjectDetailScreen({ navigation, route }: RootScreenProps<'ProjectDetail'>) {
  const { projectId } = route.params;
  const { colors } = useTheme();
  const { user } = useAuth();
  const project = useProject(projectId);
  const tasks = useTasks(projectId);
  const { balance, progress } = useBalance(projectId);
  const { users, inviteMember, removeMember, updateProject, deleteProject } = useProjects();
  const [email, setEmail] = useState('');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: project?.subject ?? 'Projeto' });
  }, [navigation, project?.subject]);

  if (!project) {
    return (
      <Screen edges={['bottom']}>
        <EmptyState icon="folder" title="Projeto não encontrado" message="Ele pode ter sido arquivado ou excluído." />
      </Screen>
    );
  }

  const isOwner = project.createdBy === user?.id;
  const open = tasks.filter((t) => t.status !== 'done').length;
  const done = tasks.length - open;

  const invite = async () => {
    if (!isEmail(email)) {
      setInviteError('Informe um e-mail válido.');
      return;
    }
    setInviting(true);
    setInviteError(null);
    try {
      const invited = await inviteMember(projectId, email);
      setEmail('');
      notify('Integrante adicionado', `${invited.name} agora faz parte do projeto.`);
    } catch (e) {
      setInviteError(errorMessage(e));
    } finally {
      setInviting(false);
    }
  };

  const remove = async (userId: string) => {
    const name = users[userId]?.name ?? 'Integrante';
    if (!(await confirmAsync('Remover integrante', `${name} sai do projeto e as tarefas dela(e) voltam para o pool.`, 'Remover', true))) return;
    try {
      await removeMember(projectId, userId);
    } catch (e) {
      notify('Não foi possível remover', errorMessage(e));
    }
  };

  const archive = async () => {
    if (!(await confirmAsync('Arquivar projeto', 'O projeto sai das suas listas. Os dados continuam salvos.', 'Arquivar'))) return;
    await updateProject(projectId, { archived: true });
    navigation.goBack();
  };

  const destroy = async () => {
    if (!(await confirmAsync('Excluir projeto', 'Todas as tarefas serão apagadas. Isso não pode ser desfeito.', 'Excluir', true))) return;
    try {
      await deleteProject(projectId);
      navigation.goBack();
    } catch (e) {
      notify('Não foi possível excluir', errorMessage(e));
    }
  };

  return (
    <Screen edges={['bottom']} testID="project-detail">
      <View style={styles.head}>
        <Text style={[typography.h1, { color: colors.text }]}>{project.name}</Text>
        {project.description ? <Text style={[typography.body, { color: colors.textMuted }]}>{project.description}</Text> : null}
        <View style={styles.row}>
          <Feather name="flag" size={14} color={colors.textMuted} />
          <Text style={[typography.caption, { color: colors.textMuted }]}>Entrega {formatDatePtBr(project.dueDate)}</Text>
          <DeadlineChip date={project.dueDate} />
        </View>
      </View>

      <Card>
        <View style={styles.row}>
          <Text style={[typography.overline, styles.flex, { color: colors.textMuted }]}>Progresso por peso</Text>
          <Text style={[typography.h2, { color: colors.text }]}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progress}>
          <ProgressBar value={progress} height={10} />
        </View>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          {done} concluídas · {open} abertas · {project.members.length} integrantes
        </Text>
      </Card>

      <View style={styles.actions}>
        <View style={styles.flex}>
          <Button testID="open-kanban" title="Ver quadro" icon="columns" onPress={() => navigation.navigate('Kanban', { projectId })} />
        </View>
        <View style={styles.flex}>
          <Button testID="new-task" title="Nova tarefa" icon="plus" variant="secondary" onPress={() => navigation.navigate('NewTask', { projectId })} />
        </View>
      </View>

      <SectionTitle>Painel de Equilíbrio</SectionTitle>
      <BalancePanel testID="balance-panel" balance={balance} users={users} />

      {balance.isUnbalanced ? (
        <BalanceAlert testID="balance-alert">
          <Text style={[typography.body, { color: colors.text }]}>A carga está concentrada. Querem redistribuir?</Text>
          <Button title="Abrir redistribuição" variant="ghost" small onPress={() => navigation.navigate('Kanban', { projectId })} />
        </BalanceAlert>
      ) : null}

      <Text style={[typography.overline, { color: colors.textMuted }]}>Por integrante</Text>
      <MemberList
        testID="member-list"
        members={project.members}
        users={users}
        balance={balance}
        currentUserId={user?.id}
        onRemove={isOwner ? remove : undefined}
      />

      {balance.unassignedWeight > 0 ? (
        <View style={[styles.pool, { backgroundColor: colors.surfaceAlt }]}>
          <Feather name="check" size={20} color={colors.primary} />
          <Text style={[typography.body, styles.flex, { color: colors.text }]}>
            <Text style={{ fontFamily: fontFamily.bodySemiBold }}>{balance.unassignedWeight} pontos de peso</Text> ainda sem
            responsável — fora deste cálculo.
          </Text>
        </View>
      ) : null}

      <View style={styles.row}>
        <Feather name="info" size={14} color={colors.textMuted} />
        <Text style={[typography.caption, styles.flex, { color: colors.textMuted }]}>
          O cálculo usa a soma dos pesos das tarefas atribuídas. Nada aqui é automático — quem redistribui é o grupo.
        </Text>
      </View>

      <SectionTitle>Convidar integrante</SectionTitle>
      <Card style={styles.inviteCard}>
        <Input
          testID="invite-email"
          label="E-mail da conta TaskPair"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="colega@fiap.com.br"
          error={inviteError}
        />
        <Button testID="invite-submit" title="Adicionar ao projeto" icon="user-plus" variant="secondary" loading={inviting} onPress={invite} />
      </Card>

      {isOwner ? (
        <View style={styles.actions}>
          <View style={styles.flex}>
            <Button title="Arquivar" icon="archive" variant="ghost" onPress={archive} />
          </View>
          <View style={styles.flex}>
            <Button title="Excluir" icon="trash-2" variant="danger" onPress={destroy} />
          </View>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  head: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  progress: { marginVertical: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.md },
  pool: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderRadius: radius.card },
  inviteCard: { gap: spacing.md },
});

export default ProjectDetailScreen;
