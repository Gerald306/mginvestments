import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { teacherService } from '../../services/teacherService';
import { notificationService } from '../../services/notificationService';
import { TeacherStackParamList, Teacher } from '../../types';

type TeacherDashboardNavigationProp = StackNavigationProp<TeacherStackParamList, 'Dashboard'>;

const TeacherDashboardScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);
  const [stats, setStats] = useState({
    applications: 0,
    profileViews: 0,
    jobMatches: 0,
    notifications: 0,
  });
  const navigation = useNavigation<TeacherDashboardNavigationProp>();
  const { userProfile } = useAuth();

  useEffect(() => {
    loadTeacherData();
    registerForNotifications();
  }, [userProfile]);

  const loadTeacherData = async () => {
    if (!userProfile?.id) return;

    try {
      setLoading(true);

      // Load teacher profile
      const teacher = await teacherService.getTeacherByUserId(userProfile.id);
      setTeacherProfile(teacher);

      // Load notifications count
      const notificationCount = await notificationService.getUnreadCount(userProfile.id);

      setStats(prev => ({
        ...prev,
        profileViews: teacher?.profileViews || 0,
        notifications: notificationCount,
      }));
    } catch (error) {
      console.error('Error loading teacher data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const registerForNotifications = async () => {
    try {
      await notificationService.registerForPushNotifications();
    } catch (error) {
      console.error('Error registering for notifications:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadTeacherData();
    setRefreshing(false);
  }, [userProfile]);

  const quickActions = [
    {
      title: 'Update Profile',
      icon: 'person-outline',
      color: '#3B82F6',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      title: 'Search Jobs',
      icon: 'search-outline',
      color: '#059669',
      onPress: () => navigation.navigate('JobSearch'),
    },
    {
      title: 'My Applications',
      icon: 'document-text-outline',
      color: '#DC2626',
      onPress: () => navigation.navigate('Applications'),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back!</Text>
        <Text style={styles.name}>
          {teacherProfile ? `${teacherProfile.firstName} ${teacherProfile.lastName}` : userProfile?.email}
        </Text>
        {teacherProfile && (
          <Text style={styles.subtitle}>
            {teacherProfile.subjects.join(', ')} • {teacherProfile.experience} years exp.
          </Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.applications}</Text>
          <Text style={styles.statLabel}>Applications</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.profileViews}</Text>
          <Text style={styles.statLabel}>Profile Views</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.notifications}</Text>
          <Text style={styles.statLabel}>Notifications</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={24} color="#ffffff" />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityText}>No recent activity</Text>
          <Text style={styles.activitySubtext}>
            Start by updating your profile or searching for jobs
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 24,
    paddingTop: 48,
  },
  greeting: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  activitySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default TeacherDashboardScreen;
