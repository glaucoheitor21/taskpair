/** Card — superfície com raio da marca e sombra violeta suave. */
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { radius, shadow, spacing, useTheme } from '../../theme';

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export function Card({ children, onPress, style, accessibilityLabel, testID }: CardProps) {
  const { colors, isDark } = useTheme();
  const base = [styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, !isDark && shadow.card, style];
  if (!onPress) {
    return (
      <View testID={testID} style={base}>
        {children}
      </View>
    );
  }
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [base, pressed && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, padding: spacing.lg, borderWidth: StyleSheet.hairlineWidth },
  pressed: { opacity: 0.85 },
});

export default Card;
