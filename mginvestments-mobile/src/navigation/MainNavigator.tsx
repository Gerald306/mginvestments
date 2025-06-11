import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import TeacherNavigator from './TeacherNavigator';
import SchoolNavigator from './SchoolNavigator';
import AdminNavigator from './AdminNavigator';
import ProfileScreen from '../screens/common/ProfileScreen';
import NotificationsScreen from '../screens/common/NotificationsScreen';

const Tab = createBottomTabNavigator();

const MainNavigator: React.FC = () => {
  const { userProfile } = useAuth();

  const getTabBarIcon = (routeName: string, focused: boolean, color: string, size: number) => {
    let iconName: keyof typeof Ionicons.glyphMap;

    switch (routeName) {
      case 'Dashboard':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Profile':
        iconName = focused ? 'person' : 'person-outline';
        break;
      case 'Notifications':
        iconName = focused ? 'notifications' : 'notifications-outline';
        break;
      default:
        iconName = 'home-outline';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  };

  const getDashboardComponent = () => {
    switch (userProfile?.role) {
      case 'teacher':
        return TeacherNavigator;
      case 'school':
        return SchoolNavigator;
      case 'admin':
        return AdminNavigator;
      default:
        return TeacherNavigator;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={getDashboardComponent()}
        options={{
          tabBarLabel: userProfile?.role === 'admin' ? 'Admin' : 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          tabBarBadge: undefined, // TODO: Add notification count
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
