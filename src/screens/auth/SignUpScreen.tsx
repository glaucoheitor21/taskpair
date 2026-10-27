/** SignUpScreen — cadastro com nome, e-mail e senha. */
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { Header } from '../../components/layout/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { spacing, typography, useTheme } from '../../theme';
import { isEmail, minLength } from '../../utils/validators';
import { errorMessage } from '../../services/api';
import type { AuthScreenProps } from '../../navigation/types';

export function SignUpScreen({ navigation }: AuthScreenProps<'SignUp'>) {
  const { colors } = useTheme();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const next: Record<string, string> = {};
    if (!minLength(name, 3)) next.name = 'Informe seu nome (mínimo 3 letras).';
    if (!isEmail(email)) next.email = 'Informe um e-mail válido.';
    if (!minLength(password, 6)) next.password = 'A senha precisa ter pelo menos 6 caracteres.';
    if (confirm !== password) next.confirm = 'As senhas não conferem.';
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      await signUp(name, email, password);
    } catch (err) {
      setErrors({ form: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <Header overline="Bem-vindo ao TaskPair" title="Criar conta" subtitle="Leva menos de um minuto." />
      <View style={styles.form}>
        <Input testID="signup-name" label="Nome" value={name} onChangeText={setName} placeholder="Como o grupo te chama" error={errors.name} />
        <Input
          testID="signup-email"
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="voce@fiap.com.br"
          error={errors.email}
        />
        <Input testID="signup-password" label="Senha" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} hint="Mínimo de 6 caracteres." />
        <Input testID="signup-confirm" label="Confirmar senha" value={confirm} onChangeText={setConfirm} secureTextEntry error={errors.confirm} />
        {errors.form ? <Text style={[typography.label, { color: colors.dangerText }]}>{errors.form}</Text> : null}
        <Button testID="signup-submit" title="Criar conta" onPress={submit} loading={loading} />
        <Button title="Já tenho conta" variant="ghost" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg, marginTop: spacing.md },
});

export default SignUpScreen;
