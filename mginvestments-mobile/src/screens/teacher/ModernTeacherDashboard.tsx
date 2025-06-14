import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { teacherService } from '../../services/teacherService';
import { notificationService } from '../../services/notificationService';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Teacher, TeacherStackParamList } from '../../types';

type TeacherDashboardNavigationProp = StackNavigationProp<TeacherStackParamList, 'Dashboard'>;

const { width, height } = Dimensions.get('window');

const ModernTeacherDashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teacherProfile, setTeacherProfile] = useState<Teacher | null>(null);
  const [stats, setStats] = useState({
    applications: 12,
    profileViews: 156,
    jobMatches: 8,
    notifications: 3,
  });

  const navigation = useNavigation<TeacherDashboardNavigationProp>();
  const { userProfile, logout } = useAuth();
  const { colors, typography, shadows, spacing } = useTheme();

  useEffect(() => {
    loadTeacherData();
    registerForNotifications();
  }, [userProfile]);

  const loadTeacherData = async () => {
    if (!userProfile?.id) return;

    try {
      setLoading(true);
      const teacher = await teacherService.getTeacherByUserId(userProfile.id);
      setTeacherProfile(teacher);

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
      subtitle: 'Keep your info current',
      icon: 'person-outline',
      color: colors.teacher.primary,
      onPress: () => navigation.navigate('Profile'),
    },
    {
      title: 'Search Jobs',
      subtitle: 'Find opportunities',
      icon: 'search-outline',
      color: colors.secondary,
      onPress: () => navigation.navigate('JobSearch'),
    },
    {
      title: 'My Applications',
      subtitle: 'Track your progress',
      icon: 'document-text-outline',
      color: colors.warning,
      onPress: () => navigation.navigate('Applications'),
    },
    {
      title: 'Settings',
      subtitle: 'Manage preferences',
      icon: 'settings-outline',
      color: colors.textSecondary,
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  const statCards = [
    {
      title: 'Applications',
      value: stats.applications,
      icon: 'document-text',
      color: colors.teacher.primary,
      gradient: [colors.teacher.primary, colors.teacher.light],
    },
    {
      title: 'Profile Views',
      value: stats.profileViews,
      icon: 'eye',
      color: colors.secondary,
      gradient: [colors.secondary, colors.secondaryLight],
    },
    {
      title: 'Job Matches',
      value: stats.jobMatches,
      icon: 'checkmark-circle',
      color: colors.success,
      gradient: [colors.success, colors.successLight],
    },
    {
      title: 'Notifications',
      value: stats.notifications,
      icon: 'notifications',
      color: colors.warning,
      gradient: [colors.warning, colors.warningLight],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.teacher.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[colors.teacher.primary, colors.teacher.light]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: colors.white }]}>
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
              </Text>
              <Text style={[styles.name, { color: colors.white }]}>
                {teacherProfile ? `${teacherProfile.firstName} ${teacherProfile.lastName}` : userProfile?.email}
              </Text>
              {teacherProfile && (
                <Text style={[styles.subtitle, { color: colors.white }]}>
                  {teacherProfile.subjects.join(', ')} • {teacherProfile.experience} years exp.
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.profileButton, { backgroundColor: colors.white }]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person" size={24} color={colors.teacher.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {statCards.map((stat, index) => (
            <LinearGradient
              key={index}
              colors={stat.gradient}
              style={[styles.statCard, shadows.md]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statContent}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <Ionicons name={stat.icon as any} size={20} color={colors.white} />
                </View>
                <Text style={[styles.statValue, { color: colors.white }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statTitle, { color: colors.white }]}>
                  {stat.title}
                </Text>
              </View>
            </LinearGradient>
          ))}
        </View>

        {/* Quick Actions */}
        <Card style={[styles.actionsCard, shadows.lg]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <Pressable
                key={index}
                style={[styles.actionItem, { backgroundColor: colors.surface }]}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
                  {action.title}
                </Text>
                <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                  {action.subtitle}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Recent Activity */}
        <Card style={[styles.activityCard, shadows.lg]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Recent Activity
            </Text>
            <Button
              title="View All"
              variant="ghost"
              size="small"
              onPress={() => {}}
            />
          </View>
          
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: colors.teacher.soft }]}>
                <Ionicons name="eye-outline" size={16} color={colors.teacher.primary} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>
                  Profile viewed by Greenwood School
                </Text>
                <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                  2 hours ago
                </Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>
                  Application accepted for Math Teacher position
                </Text>
                <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                  1 day ago
                </Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: colors.info + '20' }]}>
                <Ionicons name="mail-outline" size={16} color={colors.info} />
              </View>
              <View style={styles.activityContent}>
                <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>
                  New message from Riverside Academy
                </Text>
                <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                  3 days ago
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Profile Completion */}
        <Card style={[styles.completionCard, shadows.lg]}>
          <View style={styles.completionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Profile Completion
            </Text>
            <Text style={[styles.completionPercentage, { color: colors.teacher.primary }]}>
              85%
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.teacher.primary,
                  width: '85%'
                }
              ]} 
            />
          </View>
          
          <Text style={[styles.completionText, { color: colors.textSecondary }]}>
            Add more details to increase your visibility to schools
          </Text>
          
          <Button
            title="Complete Profile"
            variant="outline"
            size="small"
            icon="arrow-forward-outline"
            onPress={() => navigation.navigate('Profile')}
            style={styles.completionButton}
          />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    opacity: 0.9,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 60) / 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  statContent: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    opacity: 0.9,
  },
  actionsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: (width - 80) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
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
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  activityCard: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  completionCard: {
    marginBottom: 24,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  completionPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  completionText: {
    fontSize: 14,
    marginBottom: 16,
  },
  completionButton: {
    alignSelf: 'flex-start',
  },
});

export default ModernTeacherDashboard;
