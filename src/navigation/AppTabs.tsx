/** AppTabs — abas principais: Início, Projetos e Perfil. */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from '@expo/vector-icons/Feather';
import type { AppTabsParamList } from './types';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ProjectListScreen } from '../screens/projects/ProjectListScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { fontFamily, useTheme } from '../theme';

const Tab = createBottomTabNavigator<AppTabsParamList>();

const ICONS: Record<keyof AppTabsParamList, keyof typeof Feather.glyphMap> = {
  Home: 'home',
  Projects: 'columns',
  Profile: 'user',
};

export function AppTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fontFamily.bodyMedium, fontSize: 12 },
        tabBarIcon: ({ color, size }) => <Feather name={ICONS[route.name]} color={color} size={size - 2} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Projects" component={ProjectListScreen} options={{ title: 'Projetos' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}

export default AppTabs;
