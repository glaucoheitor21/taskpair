/** SignInScreen — entrada por e-mail e senha. */
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { spacing, typography, useTheme, radius } from '../../theme';
import { isEmail, isRequired } from '../../utils/validators';
import { USE_MOCKS, errorMessage } from '../../services/api';
import { DEMO_PASSWORD } from '../../services/localDb';
import type { AuthScreenProps } from '../../navigation/types';

const logo = require('../../assets/images/logo.png');

export function SignInScreen({ navigation }: AuthScreenProps<'SignIn'>) {
  const { colors } = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e = email, p = password) => {
    const next: typeof errors = {};
    if (!isEmail(e)) next.email = 'Informe um e-mail válido.';
    if (!isRequired(p)) next.password = 'Informe sua senha.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await signIn(e, p);
    } catch (err) {
      setErrors({ form: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.brand}>
        <Image source={logo} style={styles.logo} accessibilityLabel="Logo TaskPair" />
        <Text style={[typography.display, { color: colors.text }]}>TaskPair</Text>
        <Text style={[typography.body, { color: colors.textMuted, textAlign: 'center' }]}>
          Trabalhos em grupo sem trabalho desigual.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          testID="signin-email"
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="voce@fiap.com.br"
          error={errors.email}
        />
        <Input
          testID="signin-password"
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          placeholder="Sua senha"
          error={errors.password}
          onSubmitEditing={() => submit()}
        />
        {errors.form ? (
          <Text testID="signin-error" style={[typography.label, { color: colors.dangerText }]}>
            {errors.form}
          </Text>
        ) : null}
        <Button testID="signin-submit" title="Entrar" onPress={() => submit()} loading={loading} />
        <Button title="Criar conta" variant="ghost" onPress={() => navigation.navigate('SignUp')} />
      </View>

      {USE_MOCKS ? (
        <Pressable
          testID="signin-demo"
          accessibilityRole="button"
          onPress={() => {
            setEmail('glauco@fiap.com.br');
            setPassword(DEMO_PASSWORD);
            submit('glauco@fiap.com.br', DEMO_PASSWORD);
          }}
          style={[styles.demo, { backgroundColor: colors.surfaceAlt }]}
        >
          <Text style={[typography.label, { color: colors.primary }]}>Modo demonstração (dados locais)</Text>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Toque para entrar como glauco@fiap.com.br · senha {DEMO_PASSWORD}
          </Text>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: { alignItems: 'center', gap: spacing.sm, marginTop: spacing.xxl, marginBottom: spacing.lg },
  logo: { width: 88, height: 88, marginBottom: spacing.sm },
  form: { gap: spacing.lg },
  demo: { padding: spacing.lg, borderRadius: radius.card, gap: spacing.xs },
});

export default SignInScreen;
