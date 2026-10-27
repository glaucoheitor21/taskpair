/** RootNavigator — troca Auth ↔ App pela sessão e hospeda as telas de detalhe. */
import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import type { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { AppTabs } from './AppTabs';
import { useAuth } from '../hooks/useAuth';
import { ProjectProvider } from '../contexts/ProjectContext';
import { fontFamily, useTheme } from '../theme';
import { ProjectDetailScreen } from '../screens/projects/ProjectDetailScreen';
import { KanbanScreen } from '../screens/projects/KanbanScreen';
import { NewProjectScreen } from '../screens/projects/NewProjectScreen';
import { TaskDetailScreen } from '../screens/tasks/TaskDetailScreen';
import { NewTaskScreen } from '../screens/tasks/NewTaskScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();

  const navTheme = useMemo<Theme>(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [colors, isDark]);

  return (
    <NavigationContainer theme={navTheme}>
      {user ? (
        <ProjectProvider>
          <Stack.Navigator
            screenOptions={{
              headerTintColor: colors.primary,
              headerTitleStyle: { fontFamily: fontFamily.display, color: colors.text },
              headerStyle: { backgroundColor: colors.background },
              headerShadowVisible: false,
              headerBackButtonDisplayMode: 'minimal',
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="App" component={AppTabs} options={{ headerShown: false }} />
            <Stack.Screen name="ProjectDetail" component={ProjectDetailScreen} options={{ title: 'Projeto' }} />
            <Stack.Screen name="Kanban" component={KanbanScreen} options={{ title: 'Quadro' }} />
            <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Tarefa' }} />
            <Stack.Screen
              name="NewProject"
              component={NewProjectScreen}
              options={{ title: 'Novo projeto', presentation: 'modal' }}
            />
            <Stack.Screen name="NewTask" component={NewTaskScreen} options={{ title: 'Nova tarefa', presentation: 'modal' }} />
          </Stack.Navigator>
        </ProjectProvider>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default RootNavigator;
