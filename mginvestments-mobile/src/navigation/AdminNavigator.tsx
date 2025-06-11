import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminTeachersScreen from '../screens/admin/AdminTeachersScreen';
import AdminSchoolsScreen from '../screens/admin/AdminSchoolsScreen';
import AdminApplicationsScreen from '../screens/admin/AdminApplicationsScreen';
import AdminAnalyticsScreen from '../screens/admin/AdminAnalyticsScreen';
import FirebaseTestScreen from '../screens/FirebaseTestScreen';
import { AdminStackParamList } from '../types';

const Stack = createStackNavigator<AdminStackParamList>();

const AdminNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#7C3AED',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={AdminDashboardScreen}
        options={{ title: 'Admin Dashboard' }}
      />
      <Stack.Screen 
        name="Teachers" 
        component={AdminTeachersScreen}
        options={{ title: 'Manage Teachers' }}
      />
      <Stack.Screen 
        name="Schools" 
        component={AdminSchoolsScreen}
        options={{ title: 'Manage Schools' }}
      />
      <Stack.Screen 
        name="Applications" 
        component={AdminApplicationsScreen}
        options={{ title: 'All Applications' }}
      />
      <Stack.Screen
        name="Analytics"
        component={AdminAnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
      <Stack.Screen
        name="FirebaseTest"
        component={FirebaseTestScreen}
        options={{ title: 'Firebase Test' }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
