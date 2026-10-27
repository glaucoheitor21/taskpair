/** Header — título grande das telas de aba, com subtítulo e ação à direita. */
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing, typography, useTheme } from '../../theme';

export interface HeaderProps {
  title: string;
  overline?: string;
  subtitle?: string;
  right?: ReactNode;
  testID?: string;
}

export function Header({ title, overline, subtitle, right, testID }: HeaderProps) {
  const { colors } = useTheme();
  return (
    <View testID={testID} style={styles.row}>
      <View style={styles.texts}>
        {overline ? <Text style={[typography.overline, { color: colors.textMuted }]}>{overline}</Text> : null}
        <Text accessibilityRole="header" style={[typography.h1, { color: colors.text }]}>
          {title}
        </Text>
        {subtitle ? <Text style={[typography.body, { color: colors.textMuted }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

/** Título de seção dentro de uma tela. */
export function SectionTitle({ children, right }: { children: string; right?: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={[typography.h3, { color: colors.text }]}>
        {children}
      </Text>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  texts: { flex: 1, gap: spacing.xxs },
  section: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: -spacing.xs },
});

export default Header;
