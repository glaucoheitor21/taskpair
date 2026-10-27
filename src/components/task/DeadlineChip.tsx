/** DeadlineChip — prazo com a regra de cor: vermelho (atrasada), âmbar (≤ 3 dias), neutro. */
import { StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { radius, spacing, typography, useTheme } from '../../theme';
import { relativeDueLabel, urgencyOf } from '../../utils/date';

export interface DeadlineChipProps {
  date: string | null;
  done?: boolean;
  testID?: string;
}

export function DeadlineChip({ date, done, testID }: DeadlineChipProps) {
  const { colors, isDark } = useTheme();
  if (!date) return null;
  const urgency = done ? 'later' : urgencyOf(date);
  const tone =
    urgency === 'overdue'
      ? { bg: isDark ? '#3A1A1E' : '#FDECEE', fg: colors.dangerText }
      : urgency === 'today' || urgency === 'soon'
        ? { bg: isDark ? '#3A2E14' : '#FFF4E0', fg: colors.warningText }
        : { bg: 'transparent', fg: colors.textMuted };
  const label = urgency === 'overdue' ? `Atrasada · ${relativeDueLabel(date)}` : relativeDueLabel(date);
  return (
    <View testID={testID} style={[styles.chip, { backgroundColor: tone.bg }]} accessibilityLabel={`Prazo: ${label}`}>
      <Feather name={urgency === 'overdue' ? 'alert-circle' : 'calendar'} size={12} color={tone.fg} />
      <Text style={[typography.caption, { color: tone.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
});

export default DeadlineChip;
