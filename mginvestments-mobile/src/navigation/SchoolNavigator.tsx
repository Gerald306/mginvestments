import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SchoolDashboardScreen from '../screens/school/SchoolDashboardScreen';
import TeacherSearchScreen from '../screens/school/TeacherSearchScreen';
import JobPostsScreen from '../screens/school/JobPostsScreen';
import SchoolApplicationsScreen from '../screens/school/SchoolApplicationsScreen';
import SchoolProfileScreen from '../screens/school/SchoolProfileScreen';
import { SchoolStackParamList } from '../types';

const Stack = createStackNavigator<SchoolStackParamList>();

const SchoolNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#059669',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={SchoolDashboardScreen}
        options={{ title: 'School Dashboard' }}
      />
      <Stack.Screen 
        name="Profile" 
        component={SchoolProfileScreen}
        options={{ title: 'School Profile' }}
      />
      <Stack.Screen 
        name="TeacherSearch" 
        component={TeacherSearchScreen}
        options={{ title: 'Find Teachers' }}
      />
      <Stack.Screen 
        name="JobPosts" 
        component={JobPostsScreen}
        options={{ title: 'Job Posts' }}
      />
      <Stack.Screen 
        name="Applications" 
        component={SchoolApplicationsScreen}
        options={{ title: 'Applications' }}
      />
    </Stack.Navigator>
  );
};

export default SchoolNavigator;
