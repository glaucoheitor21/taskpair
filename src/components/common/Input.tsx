/** Input — campo de texto com rótulo e mensagem de erro. */
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { HIT_SLOP_MIN, fontFamily, radius, spacing, typography, useTheme } from '../../theme';

export interface InputProps extends TextInputProps {
  label: string;
  error?: string | null;
  hint?: string;
}

export function Input({ label, error, hint, style, ...rest }: InputProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap}>
      <Text style={[typography.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.surface, borderColor: error ? colors.danger : colors.border },
          rest.multiline && styles.multiline,
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text style={[typography.caption, { color: colors.dangerText }]}>{error}</Text>
      ) : hint ? (
        <Text style={[typography.caption, { color: colors.textMuted }]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  input: {
    minHeight: HIT_SLOP_MIN + 4,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontFamily: fontFamily.body,
    fontSize: 15,
  },
  multiline: { minHeight: 96, paddingTop: spacing.md, textAlignVertical: 'top' },
});

export default Input;
