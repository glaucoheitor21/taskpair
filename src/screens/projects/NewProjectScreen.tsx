/** NewProjectScreen — criação de projeto (nome, disciplina, descrição, data de entrega). */
import { useState } from 'react';
import { Text } from 'react-native';
import { Screen } from '../../components/layout/Screen';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { DateField } from '../../components/common/DateField';
import { useProjects } from '../../hooks/useProjects';
import { typography, useTheme } from '../../theme';
import { minLength } from '../../utils/validators';
import { daysUntil } from '../../utils/date';
import { errorMessage } from '../../services/api';
import type { RootScreenProps } from '../../navigation/types';

export function NewProjectScreen({ navigation }: RootScreenProps<'NewProject'>) {
  const { colors } = useTheme();
  const { createProject } = useProjects();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const clearError = (field: string) =>
    setErrors((prev) => {
      const { [field]: _removed, form: _form, ...rest } = prev;
      return rest;
    });

  const save = async () => {
    const e: Record<string, string> = {};
    if (!minLength(name, 3)) e.name = 'Dê um nome com pelo menos 3 caracteres.';
    if (!minLength(subject, 2)) e.subject = 'Informe a disciplina.';
    if (!dueDate) e.dueDate = 'Informe a data de entrega.';
    else if (daysUntil(dueDate) < 0) e.dueDate = 'A entrega não pode estar no passado.';
    setErrors(e);
    if (Object.keys(e).length || !dueDate) return;
    setSaving(true);
    try {
      const p = await createProject({ name, subject, description, dueDate });
      navigation.replace('ProjectDetail', { projectId: p.id });
    } catch (err) {
      setErrors({ form: errorMessage(err) });
      setSaving(false);
    }
  };

  return (
    <Screen
      edges={['bottom']}
      testID="new-project-screen"
      footer={<Button testID="project-save" title="Criar projeto" icon="check" onPress={save} loading={saving} />}
    >
      <Input
        testID="project-name"
        label="Nome do trabalho"
        value={name}
        onChangeText={(v) => {
          setName(v);
          clearError('name');
        }}
        placeholder="Ex.: Artigo de IA aplicada"
        error={errors.name}
      />
      <Input
        testID="project-subject"
        label="Disciplina"
        value={subject}
        onChangeText={(v) => {
          setSubject(v);
          clearError('subject');
        }}
        placeholder="Ex.: Mobile Development"
        error={errors.subject}
      />
      <Input label="Descrição (opcional)" value={description} onChangeText={setDescription} placeholder="O que o professor pediu?" multiline />
      <DateField
        testID="project-due"
        label="Data de entrega"
        value={dueDate}
        onChange={(v) => {
          setDueDate(v);
          clearError('dueDate');
        }}
        error={errors.dueDate}
      />
      <Text style={[typography.caption, { color: colors.textMuted }]}>
        Você entra como criador. Depois, convide o grupo pelo e-mail na tela do projeto.
      </Text>
      {errors.form ? <Text style={[typography.label, { color: colors.dangerText }]}>{errors.form}</Text> : null}
    </Screen>
  );
}

export default NewProjectScreen;
