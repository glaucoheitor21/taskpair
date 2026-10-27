/** Avatar — círculo com as iniciais e a cor determinística do usuário. */
import { StyleSheet, Text, View } from 'react-native';
import type { User } from '../../types';
import { fontFamily } from '../../theme';

export interface AvatarProps {
  user?: User | null;
  size?: number;
  /** Anel de destaque (ex.: "você"). */
  ring?: string;
  testID?: string;
}

export function Avatar({ user, size = 32, ring, testID }: AvatarProps) {
  return (
    <View
      testID={testID}
      accessibilityLabel={user ? user.name : 'Sem responsável'}
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: user ? user.color : 'transparent' },
        !user && styles.empty,
        ring ? { borderWidth: 2, borderColor: ring } : null,
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.38, color: user ? '#FFFFFF' : '#A0A4B8' }]}>
        {user ? user.initials : '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  empty: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#A0A4B8' },
  text: { fontFamily: fontFamily.bodySemiBold },
});

export default Avatar;
