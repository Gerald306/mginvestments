import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import LandingScreen from '../screens/LandingScreen';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);

  let user, loading;
  try {
    const authContext = useAuth();
    user = authContext.user;
    loading = authContext.loading;
  } catch (error) {
    console.error('Auth context error:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Authentication Error</Text>
        <Text style={styles.errorSubtext}>Please restart the app</Text>
      </View>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  try {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="Main" component={MainNavigator} />
          ) : showLanding ? (
            <Stack.Screen name="Landing">
              {() => <LandingScreen onGetStarted={() => setShowLanding(false)} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  } catch (error) {
    console.error('Navigation error:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Navigation Error</Text>
        <Text style={styles.errorSubtext}>Please restart the app</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AppNavigator;
