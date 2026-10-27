/** ProjectCard — resumo do projeto: progresso por peso, prazo, integrantes e Balance Score. */
import { StyleSheet, Text, View } from 'react-native';
import type { Project, ProjectBalance, User, UUID } from '../../types';
import { spacing, typography, useTheme } from '../../theme';
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { DeadlineChip } from '../task/DeadlineChip';
import { scoreTone } from './BalancePanel';

export interface ProjectCardProps {
  project: Project;
  balance: ProjectBalance;
  progress: number;
  users: Record<UUID, User>;
  openTasks: number;
  onPress?: () => void;
  testID?: string;
}

export function ProjectCard({ project, balance, progress, users, openTasks, onPress, testID }: ProjectCardProps) {
  const { colors } = useTheme();
  const hasData = balance.shares.some((s) => s.assignedWeight > 0);
  return (
    <Card testID={testID} onPress={onPress} accessibilityLabel={`Projeto ${project.name}`} style={styles.card}>
      <View style={styles.top}>
        <View style={styles.flex}>
          <Text style={[typography.overline, { color: colors.textMuted }]} numberOfLines={1}>
            {project.subject}
          </Text>
          <Text style={[typography.h3, { color: colors.text }]} numberOfLines={2}>
            {project.name}
          </Text>
        </View>
        {balance.isUnbalanced ? <Badge label="Carga concentrada" tone="warning" /> : null}
      </View>

      <View style={styles.progressRow}>
        <View style={styles.flex}>
          <ProgressBar value={progress} />
        </View>
        <Text style={[typography.label, { color: colors.text }]}>{Math.round(progress)}%</Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.avatars}>
          {project.members.slice(0, 4).map((m, i) => (
            <View key={m.userId} style={{ marginLeft: i === 0 ? 0 : -8 }}>
              <Avatar user={users[m.userId]} size={28} ring={colors.surface} />
            </View>
          ))}
        </View>
        <Text style={[typography.caption, { color: colors.textMuted }]}>{openTasks} abertas</Text>
        <View style={styles.flex} />
        <DeadlineChip date={project.dueDate} />
        <View style={styles.score}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>Score</Text>
          <Text style={[typography.h3, { color: hasData ? scoreTone(balance.balanceScore, colors) : colors.textMuted }]}>
            {hasData ? Math.round(balance.balanceScore) : '—'}
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  flex: { flex: 1 },
  top: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatars: { flexDirection: 'row' },
  score: { alignItems: 'center', marginLeft: spacing.xs },
});

export default ProjectCard;
