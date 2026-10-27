/** ProgressBar — barra de progresso simples (0–100). */
import { StyleSheet, View } from 'react-native';
import { radius, useTheme } from '../../theme';

export interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  testID?: string;
}

export function ProgressBar({ value, color, height = 6, testID }: ProgressBarProps) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}
      style={[styles.track, { height, backgroundColor: colors.border }]}
    >
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color ?? colors.accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});

export default ProgressBar;
