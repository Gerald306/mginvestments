import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { user, userProfile } = useAuth();

  useEffect(() => {
    // Redirect to appropriate dashboard based on user role
    const redirectToDashboard = () => {
      if (!user) {
        // If no user, redirect to homepage
        navigation.navigate('EnhancedHomepage' as never);
        return;
      }

      // Determine dashboard route based on role
      let dashboardRoute = 'EnhancedHomepage';
      
      if (userProfile?.role === 'teacher') {
        dashboardRoute = 'TeacherDashboard';
      } else if (userProfile?.role === 'school') {
        dashboardRoute = 'SchoolDashboard';
      } else if (userProfile?.role === 'admin') {
        dashboardRoute = 'AdminDashboard';
      }

      // Navigate to the appropriate dashboard
      navigation.navigate(dashboardRoute as never);
    };

    // Small delay to ensure smooth transition
    const timer = setTimeout(redirectToDashboard, 100);
    
    return () => clearTimeout(timer);
  }, [user, userProfile, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
        Loading Dashboard...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DashboardScreen;
