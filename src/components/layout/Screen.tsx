/** Screen — contêiner padrão de tela: fundo do tema, safe area, rolagem e rodapé fixo opcional. */
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { spacing, useTheme } from '../../theme';

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  /** Bordas protegidas. Telas com header nativo usam só ['bottom']. */
  edges?: Edge[];
  padded?: boolean;
  footer?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  testID?: string;
}

export function Screen({
  children,
  scroll = true,
  edges = ['top'],
  padded = true,
  footer,
  refreshing,
  onRefresh,
  testID,
}: ScreenProps) {
  const { colors } = useTheme();
  const pad = padded ? styles.padded : null;
  return (
    <SafeAreaView testID={testID} edges={edges} style={[styles.flex, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[pad, styles.content]}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              onRefresh ? (
                <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
              ) : undefined
            }
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.flex, pad]}>{children}</View>
        )}
        {footer ? (
          <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.background }]}>{footer}</View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  content: { paddingBottom: spacing.xxl, gap: spacing.lg },
  footer: { padding: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, gap: spacing.sm },
});

export default Screen;
