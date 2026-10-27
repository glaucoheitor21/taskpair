/** Badge — rótulo curto com tom semântico. */
import { StyleSheet, Text, View } from 'react-native';
import { radius, spacing, typography, useTheme } from '../../theme';

export type BadgeTone = 'neutral' | 'primary' | 'accent' | 'warning' | 'danger';

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  testID?: string;
}

export function Badge({ label, tone = 'neutral', testID }: BadgeProps) {
  const { colors, isDark } = useTheme();
  const map = {
    neutral: { bg: colors.border, fg: colors.textMuted },
    primary: { bg: colors.surfaceAlt, fg: colors.primary },
    accent: { bg: isDark ? '#12302B' : '#E4FBF6', fg: colors.accentText },
    warning: { bg: isDark ? '#3A2E14' : '#FFF4E0', fg: colors.warningText },
    danger: { bg: isDark ? '#3A1A1E' : '#FDECEE', fg: colors.dangerText },
  }[tone];
  return (
    <View testID={testID} style={[styles.badge, { backgroundColor: map.bg }]}>
      <Text style={[styles.text, { color: map.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.pill, alignSelf: 'flex-start' },
  text: { ...typography.caption, fontFamily: typography.label.fontFamily },
});

export default Badge;
