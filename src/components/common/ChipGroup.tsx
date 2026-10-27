/** ChipGroup — seleção única em pílulas (peso, status, responsável, aparência). */
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, typography, useTheme } from '../../theme';

export interface ChipOption<T> {
  value: T;
  label: string;
  left?: ReactNode;
  color?: string;
}

export interface ChipGroupProps<T> {
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  error?: string | null;
  testID?: string;
}

export function ChipGroup<T extends string | number | null>({ options, value, onChange, label, error, testID }: ChipGroupProps<T>) {
  const { colors } = useTheme();
  return (
    <View style={styles.wrap} testID={testID}>
      {label ? <Text style={[typography.label, { color: colors.text }]}>{label}</Text> : null}
      <View style={styles.row} accessibilityRole="radiogroup">
        {options.map((o) => {
          const selected = o.value === value;
          const tint = o.color ?? colors.primary;
          return (
            <Pressable
              key={String(o.value)}
              testID={testID ? `${testID}-${String(o.value)}` : undefined}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={o.label}
              onPress={() => onChange(o.value)}
              style={[
                styles.chip,
                { borderColor: selected ? tint : colors.border, backgroundColor: selected ? colors.surfaceAlt : colors.surface },
              ]}
            >
              {o.left}
              <Text style={[typography.label, { color: selected ? tint : colors.text }]}>{o.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={[typography.caption, { color: colors.dangerText }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});

export default ChipGroup;
