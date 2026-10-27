/** Button — botão primário/secundário/ghost/perigo da marca. */
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { HIT_SLOP_MIN, radius, spacing, typography, useTheme } from '../../theme';

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: keyof typeof Feather.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
  testID?: string;
}

export function Button({ title, onPress, variant = 'primary', icon, loading, disabled, small, testID }: ButtonProps) {
  const { colors } = useTheme();
  const tone = {
    primary: { bg: colors.primary, pressed: colors.primaryPressed, fg: colors.onPrimary, border: colors.primary },
    secondary: { bg: colors.surfaceAlt, pressed: colors.border, fg: colors.primary, border: colors.surfaceAlt },
    ghost: { bg: 'transparent', pressed: colors.surfaceAlt, fg: colors.primary, border: colors.border },
    danger: { bg: 'transparent', pressed: colors.surfaceAlt, fg: colors.dangerText, border: colors.border },
  }[variant];
  const isDisabled = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        small && styles.small,
        { backgroundColor: pressed ? tone.pressed : tone.bg, borderColor: tone.border },
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tone.fg} />
      ) : (
        <View style={styles.row}>
          {icon && <Feather name={icon} size={small ? 15 : 18} color={tone.fg} />}
          <Text style={[small ? typography.label : typography.h3, { color: tone.fg, fontSize: small ? 13 : 15 }]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: HIT_SLOP_MIN + 6,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  small: { minHeight: 36, paddingHorizontal: spacing.md, borderRadius: radius.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  disabled: { opacity: 0.5 },
});

export default Button;
