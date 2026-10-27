/** ProfileScreen — dados do usuário, histórico de contribuição, aparência e sessão. */
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import Feather from '@expo/vector-icons/Feather';
import { Screen } from '../../components/layout/Screen';
import { Header, SectionTitle } from '../../components/layout/Header';
import { Avatar } from '../../components/common/Avatar';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { ChipGroup } from '../../components/common/ChipGroup';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useAuth } from '../../hooks/useAuth';
import { useProjects } from '../../hooks/useProjects';
import { fontFamily, spacing, typography, useTheme, type ThemePreference } from '../../theme';
import { calculateBalance } from '../../utils/workload';
import { DATA_SOURCE } from '../../services/api';
import { confirmAsync, notify } from '../../utils/dialog';

export function ProfileScreen() {
  const { colors, preference, setPreference } = useTheme();
  const { user, signOut } = useAuth();
  const { projects, tasks, resetDemoData } = useProjects();
  const [busy, setBusy] = useState(false);

  const stats = useMemo(() => {
    const mine = tasks.filter((t) => t.assigneeId === user?.id);
    const done = mine.filter((t) => t.status === 'done');
    return {
      done: done.length,
      open: mine.length - done.length,
      deliveredWeight: done.reduce((s, t) => s + t.weight, 0),
      perProject: projects.map((p) => {
        const b = calculateBalance(p.id, p.members.map((m) => m.userId), tasks);
        const share = b.shares.find((s) => s.userId === user?.id);
        return { project: p, share: share?.sharePercent ?? 0, ideal: 100 / Math.max(1, p.members.length), completed: share?.completedWeight ?? 0 };
      }),
    };
  }, [projects, tasks, user]);

  return (
    <Screen testID="profile-screen">
      <Header title="Perfil" />
      <Card style={styles.userCard}>
        <Avatar user={user} size={64} />
        <View style={styles.flex}>
          <Text style={[typography.h2, { color: colors.text }]}>{user?.name}</Text>
          <Text style={[typography.body, { color: colors.textMuted }]}>{user?.email}</Text>
        </View>
      </Card>

      <View style={styles.stats}>
        {[
          { label: 'Concluídas', value: stats.done },
          { label: 'Em aberto', value: stats.open },
          { label: 'Peso entregue', value: stats.deliveredWeight },
        ].map((s) => (
          <Card key={s.label} style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>{s.label}</Text>
          </Card>
        ))}
      </View>

      <SectionTitle>Minha contribuição</SectionTitle>
      {stats.perProject.length === 0 ? (
        <Text style={[typography.body, { color: colors.textMuted }]}>Você ainda não participa de nenhum projeto.</Text>
      ) : (
        <Card style={styles.contrib}>
          {stats.perProject.map(({ project, share, ideal, completed }) => (
            <View key={project.id} style={styles.contribRow}>
              <View style={styles.rowBetween}>
                <Text style={[typography.label, styles.flex, { color: colors.text }]} numberOfLines={1}>
                  {project.subject}
                </Text>
                <Text style={[typography.label, { color: colors.textMuted }]}>
                  {Math.round(share)}% · ideal {Math.round(ideal)}%
                </Text>
              </View>
              <ProgressBar value={share} color={colors.primary} />
              <Text style={[typography.caption, { color: colors.textMuted }]}>{completed} pontos de peso entregues</Text>
            </View>
          ))}
        </Card>
      )}

      <SectionTitle>Aparência</SectionTitle>
      <ChipGroup<ThemePreference>
        testID="theme-picker"
        options={[
          { value: 'system', label: 'Sistema' },
          { value: 'light', label: 'Claro' },
          { value: 'dark', label: 'Escuro' },
        ]}
        value={preference}
        onChange={setPreference}
      />

      <SectionTitle>Sobre</SectionTitle>
      <Card style={styles.about}>
        <View style={styles.row}>
          <Feather name={DATA_SOURCE === 'supabase' ? 'cloud' : 'smartphone'} size={16} color={colors.primary} />
          <Text style={[typography.body, { color: colors.text }]}>
            Dados: <Text style={{ fontFamily: fontFamily.bodySemiBold }}>{DATA_SOURCE === 'supabase' ? 'Supabase (nuvem)' : 'Local (demonstração)'}</Text>
          </Text>
        </View>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          TaskPair v{Constants.expoConfig?.version ?? '1.0.0'} · FIAP Mobile Development
        </Text>
        <Text style={[typography.caption, { color: colors.textMuted }]}>
          Transparência, não vigilância: o app mostra só dados que o próprio grupo inseriu.
        </Text>
      </Card>

      {DATA_SOURCE === 'local' ? (
        <Button
          title="Restaurar dados de demonstração"
          icon="refresh-ccw"
          variant="ghost"
          loading={busy}
          onPress={async () => {
            if (!(await confirmAsync('Restaurar dados', 'Projetos e tarefas voltam ao estado inicial de demonstração.', 'Restaurar'))) return;
            setBusy(true);
            await resetDemoData();
            setBusy(false);
            notify('Pronto', 'Dados de demonstração restaurados.');
          }}
        />
      ) : null}
      <Button testID="signout" title="Sair" icon="log-out" variant="danger" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  stats: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statValue: { fontFamily: fontFamily.displayBold, fontSize: 28 },
  contrib: { gap: spacing.lg },
  contribRow: { gap: spacing.xs },
  rowBetween: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  about: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});

export default ProfileScreen;
