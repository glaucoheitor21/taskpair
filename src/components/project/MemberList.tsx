/** MemberList — integrantes com a fatia de carga de cada um e o desvio da divisão ideal. */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import type { Member, ProjectBalance, User, UUID } from '../../types';
import { fontFamily, spacing, typography, useTheme } from '../../theme';
import { Avatar } from '../common/Avatar';
import { Card } from '../common/Card';
import { UNBALANCE_THRESHOLD_POINTS } from '../../utils/workload';

export interface MemberListProps {
  members: Member[];
  users: Record<UUID, User>;
  balance: ProjectBalance;
  currentUserId?: UUID;
  onRemove?: (userId: UUID) => void;
  testID?: string;
}

export function MemberList({ members, users, balance, currentUserId, onRemove, testID }: MemberListProps) {
  const { colors } = useTheme();
  return (
    <View testID={testID} style={styles.list}>
      {members.map((m) => {
        const user = users[m.userId];
        const share = balance.shares.find((s) => s.userId === m.userId);
        const dev = share?.deviationPoints ?? 0;
        const devColor =
          Math.abs(dev) > UNBALANCE_THRESHOLD_POINTS ? (dev > 0 ? colors.dangerText : colors.warningText) : colors.accentText;
        const isMe = m.userId === currentUserId;
        return (
          <Card key={m.userId} style={styles.row}>
            <Avatar user={user} size={44} />
            <View style={styles.info}>
              <Text style={[typography.h3, { color: colors.text }]} numberOfLines={1}>
                {user?.name ?? 'Integrante'}
                {isMe ? <Text style={{ color: colors.textMuted, fontFamily: fontFamily.body }}> (você)</Text> : null}
              </Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                {m.role === 'owner' ? 'Criador · ' : ''}peso {share?.assignedWeight ?? 0} · {share?.completedWeight ?? 0} entregue
              </Text>
            </View>
            <View style={styles.right}>
              <Text style={[typography.h2, { color: colors.text }]}>{Math.round(share?.sharePercent ?? 0)}%</Text>
              <Text style={[typography.caption, { color: devColor, fontFamily: fontFamily.bodySemiBold }]}>
                {dev > 0 ? '+' : dev < 0 ? '−' : '±'}
                {Math.abs(Math.round(dev))} p.p.
              </Text>
            </View>
            {onRemove && !isMe && m.role !== 'owner' ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remover ${user?.name ?? 'integrante'}`}
                hitSlop={10}
                onPress={() => onRemove(m.userId)}
              >
                <Feather name="x" size={18} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  info: { flex: 1, gap: 2 },
  right: { alignItems: 'flex-end' },
});

export default MemberList;
