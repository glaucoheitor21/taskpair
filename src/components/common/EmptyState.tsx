/** EmptyState — mensagem amigável para listas vazias. */
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { spacing, typography, useTheme } from '../../theme';

export interface EmptyStateProps {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  message?: string;
  action?: ReactNode;
  testID?: string;
}

export function EmptyState({ icon = 'inbox', title, message, action, testID }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View testID={testID} style={styles.wrap}>
      <View style={[styles.icon, { backgroundColor: colors.surfaceAlt }]}>
        <Feather name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={[typography.h3, { color: colors.text, textAlign: 'center' }]}>{title}</Text>
      {message ? <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>{message}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', padding: spacing.xl, gap: spacing.sm },
  icon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs },
  action: { marginTop: spacing.md, alignSelf: 'stretch' },
});

export default EmptyState;
