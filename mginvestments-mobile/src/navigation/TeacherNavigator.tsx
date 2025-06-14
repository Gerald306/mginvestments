import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TeacherDashboardScreen from '../screens/teacher/TeacherDashboardScreen';
import ModernTeacherDashboard from '../screens/teacher/ModernTeacherDashboard';
import JobSearchScreen from '../screens/teacher/JobSearchScreen';
import ApplicationsScreen from '../screens/teacher/ApplicationsScreen';
import TeacherProfileScreen from '../screens/teacher/TeacherProfileScreen';
import { TeacherStackParamList } from '../types';

const Stack = createStackNavigator<TeacherStackParamList>();

const TeacherNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#3B82F6',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Dashboard"
        component={ModernTeacherDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Profile" 
        component={TeacherProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen 
        name="JobSearch" 
        component={JobSearchScreen}
        options={{ title: 'Job Search' }}
      />
      <Stack.Screen 
        name="Applications" 
        component={ApplicationsScreen}
        options={{ title: 'My Applications' }}
      />
    </Stack.Navigator>
  );
};

export default TeacherNavigator;
