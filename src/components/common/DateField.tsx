/**
 * DateField — data em DD/MM/AAAA com máscara e atalhos ("Hoje", "+3 dias"...).
 * Trabalha com ISO ('YYYY-MM-DD') para fora; o texto é só apresentação.
 */
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, typography, useTheme } from '../../theme';
import { addDaysISO, formatDatePtBr, maskDateBr, parseDateBr } from '../../utils/date';
import { Input } from './Input';

export interface DateFieldProps {
  label: string;
  value: string | null;
  onChange: (iso: string | null) => void;
  error?: string | null;
  optional?: boolean;
  testID?: string;
}

const SHORTCUTS = [
  { label: 'Hoje', days: 0 },
  { label: '+3 dias', days: 3 },
  { label: '+1 semana', days: 7 },
  { label: '+2 semanas', days: 14 },
];

export function DateField({ label, value, onChange, error, optional, testID }: DateFieldProps) {
  const { colors } = useTheme();
  const [text, setText] = useState(value ? formatDatePtBr(value) : '');

  useEffect(() => {
    if (value && parseDateBr(text) !== value) setText(formatDatePtBr(value));
    if (!value && parseDateBr(text)) setText('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleText = (raw: string) => {
    const masked = maskDateBr(raw);
    setText(masked);
    onChange(parseDateBr(masked));
  };

  const localError = text.length === 10 && !parseDateBr(text) ? 'Data inválida.' : null;

  return (
    <View style={styles.wrap}>
      <Input
        testID={testID}
        label={optional ? `${label} (opcional)` : label}
        value={text}
        onChangeText={handleText}
        placeholder="DD/MM/AAAA"
        keyboardType="number-pad"
        maxLength={10}
        error={localError ?? error}
      />
      <View style={styles.row}>
        {SHORTCUTS.map((s) => (
          <Pressable
            key={s.label}
            accessibilityRole="button"
            accessibilityLabel={`Prazo ${s.label}`}
            onPress={() => {
              const iso = addDaysISO(s.days);
              setText(formatDatePtBr(iso));
              onChange(iso);
            }}
            style={[styles.chip, { backgroundColor: colors.surfaceAlt }]}
          >
            <Text style={[typography.caption, { color: colors.primary }]}>{s.label}</Text>
          </Pressable>
        ))}
        {optional && value ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setText('');
              onChange(null);
            }}
            style={[styles.chip, { backgroundColor: colors.border }]}
          >
            <Text style={[typography.caption, { color: colors.textMuted }]}>Sem prazo</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: radius.pill },
});

export default DateField;
