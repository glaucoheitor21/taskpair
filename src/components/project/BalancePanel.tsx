/**
 * BalancePanel — Painel de Equilíbrio: Balance Score, barra empilhada por
 * integrante e o convite (nunca acusação) a redistribuir.
 */
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import type { ProjectBalance, User, UUID } from '../../types';
import { fontFamily, radius, spacing, typography, useTheme } from '../../theme';
import { Card } from '../common/Card';

export interface BalancePanelProps {
  balance: ProjectBalance;
  users: Record<UUID, User>;
  /** Versão resumida (sem legenda) para cartões. */
  compact?: boolean;
  testID?: string;
}

export function scoreTone(score: number, colors: { accentText: string; warningText: string; dangerText: string }) {
  if (score >= 75) return colors.accentText;
  if (score >= 50) return colors.warningText;
  return colors.dangerText;
}

export function BalancePanel({ balance, users, compact, testID }: BalancePanelProps) {
  const { colors } = useTheme();
  const n = balance.shares.length;
  const ideal = n > 0 ? 100 / n : 0;
  const hasData = balance.shares.some((s) => s.assignedWeight > 0);

  return (
    <Card testID={testID} style={styles.card}>
      <View style={styles.scoreRow}>
        <View style={styles.flex}>
          <Text style={[typography.overline, { color: colors.textMuted }]}>Balance Score</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>100 = divisão igual</Text>
        </View>
        <Text
          testID={testID ? `${testID}-score` : undefined}
          accessibilityLabel={`Balance Score ${Math.round(balance.balanceScore)} de 100`}
          style={[styles.score, { color: hasData ? scoreTone(balance.balanceScore, colors) : colors.textMuted }]}
        >
          {hasData ? Math.round(balance.balanceScore) : '—'}
          <Text style={[styles.scoreMax, { color: colors.textMuted }]}>/100</Text>
        </Text>
      </View>

      {hasData ? (
        <View>
          <View style={[styles.bar, { backgroundColor: colors.border }]} accessibilityRole="image" accessibilityLabel="Distribuição da carga por integrante">
            {balance.shares
              .filter((s) => s.sharePercent > 0)
              .map((s) => (
                <View
                  key={s.userId}
                  style={[styles.segment, { flex: s.sharePercent, backgroundColor: users[s.userId]?.color ?? colors.textMuted }]}
                >
                  {s.sharePercent >= 12 ? <Text style={styles.segmentText}>{Math.round(s.sharePercent)}%</Text> : null}
                </View>
              ))}
          </View>
          {!compact && n > 1 ? (
            <Text style={[typography.caption, styles.idealText, { color: colors.textMuted }]}>
              divisão ideal · {Math.round(ideal)}% por pessoa
            </Text>
          ) : null}
        </View>
      ) : (
        <Text style={[typography.body, { color: colors.textMuted }]}>
          Nenhuma tarefa distribuída ainda. Atribua responsáveis para ver o equilíbrio.
        </Text>
      )}
    </Card>
  );
}

/** Alerta de concentração — a frase é sobre a carga, nunca sobre uma pessoa. */
export function BalanceAlert({ children, testID }: { children?: ReactNode; testID?: string }) {
  const { colors, isDark } = useTheme();
  return (
    <View
      testID={testID}
      accessibilityRole="alert"
      style={[styles.alert, { backgroundColor: isDark ? '#3A2E14' : '#FFF6E5', borderColor: isDark ? '#5A4620' : '#F5D9A0' }]}
    >
      <Feather name="alert-triangle" size={20} color={colors.warningText} />
      <View style={styles.flex}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.lg },
  flex: { flex: 1, gap: spacing.xs },
  scoreRow: { flexDirection: 'row', alignItems: 'flex-end' },
  score: { fontFamily: fontFamily.displayBold, fontSize: 48, lineHeight: 52, letterSpacing: -1.5 },
  scoreMax: { fontFamily: fontFamily.display, fontSize: 18, letterSpacing: 0 },
  bar: { flexDirection: 'row', height: 32, borderRadius: radius.sm, overflow: 'hidden' },
  segment: { alignItems: 'center', justifyContent: 'center' },
  segmentText: { color: '#FFFFFF', fontFamily: fontFamily.bodySemiBold, fontSize: 12 },
  idealText: { textAlign: 'center', marginTop: spacing.xs },
  alert: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.card,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
});

export default BalancePanel;
