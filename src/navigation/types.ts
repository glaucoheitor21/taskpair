/** Contrato de rotas do app. Mantido separado para tipar navigation/route. */

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type ProjectsStackParamList = {
  ProjectList: undefined;
  ProjectDetail: { projectId: string };
  Kanban: { projectId: string };
  NewProject: undefined;
  TaskDetail: { taskId: string };
  NewTask: { projectId: string };
};

export type AppTabsParamList = {
  Home: undefined;
  Projects: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};
