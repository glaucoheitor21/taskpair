/** Contrato de rotas do app. Mantido separado para tipar navigation/route. */
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type AppTabsParamList = {
  Home: undefined;
  Projects: undefined;
  Profile: undefined;
};

/**
 * Telas de detalhe ficam na pilha raiz, acima das abas: assim a barra de
 * abas some no detalhe e o "voltar" sempre retorna para onde o usuário
 * estava (Home ou Projetos).
 */
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabsParamList>;
  ProjectDetail: { projectId: string };
  Kanban: { projectId: string };
  NewProject: undefined;
  TaskDetail: { taskId: string };
  NewTask: { projectId: string; assigneeId?: string | null };
};

export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<AuthStackParamList, T>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
