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
import { schoolService } from '../../services/schoolService';
import { notificationService } from '../../services/notificationService';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { School, SchoolStackParamList } from '../../types';

type SchoolDashboardNavigationProp = StackNavigationProp<SchoolStackParamList, 'Dashboard'>;

const { width, height } = Dimensions.get('window');

const ModernSchoolDashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [schoolProfile, setSchoolProfile] = useState<School | null>(null);
  const [stats, setStats] = useState({
    activeJobs: 5,
    applications: 28,
    hiredTeachers: 12,
    notifications: 7,
  });

  const navigation = useNavigation<SchoolDashboardNavigationProp>();
  const { userProfile, logout } = useAuth();
  const { colors, typography, shadows, spacing } = useTheme();

  useEffect(() => {
    loadSchoolData();
  }, [userProfile]);

  const loadSchoolData = async () => {
    if (!userProfile?.id) return;

    try {
      setLoading(true);
      const school = await schoolService.getSchoolByUserId(userProfile.id);
      setSchoolProfile(school);

      const notificationCount = await notificationService.getUnreadCount(userProfile.id);
      setStats(prev => ({
        ...prev,
        notifications: notificationCount,
      }));
    } catch (error) {
      console.error('Error loading school data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadSchoolData();
    setRefreshing(false);
  }, [userProfile]);

  const quickActions = [
    {
      title: 'Post New Job',
      subtitle: 'Find qualified teachers',
      icon: 'add-circle-outline',
      color: colors.school.primary,
      onPress: () => navigation.navigate('JobPosts'),
    },
    {
      title: 'Browse Teachers',
      subtitle: 'Discover talent',
      icon: 'people-outline',
      color: colors.secondary,
      onPress: () => navigation.navigate('TeacherSearch'),
    },
    {
      title: 'Applications',
      subtitle: 'Review candidates',
      icon: 'document-text-outline',
      color: colors.warning,
      onPress: () => navigation.navigate('Applications'),
    },
    {
      title: 'School Profile',
      subtitle: 'Update information',
      icon: 'business-outline',
      color: colors.textSecondary,
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  const statCards = [
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: 'briefcase',
      color: colors.school.primary,
      gradient: [colors.school.primary, colors.school.light],
      subtitle: 'Currently hiring',
    },
    {
      title: 'Applications',
      value: stats.applications,
      icon: 'document-text',
      color: colors.info,
      gradient: [colors.info, colors.infoLight],
      subtitle: 'Pending review',
    },
    {
      title: 'Hired Teachers',
      value: stats.hiredTeachers,
      icon: 'checkmark-circle',
      color: colors.success,
      gradient: [colors.success, colors.successLight],
      subtitle: 'This year',
    },
    {
      title: 'Messages',
      value: stats.notifications,
      icon: 'mail',
      color: colors.warning,
      gradient: [colors.warning, colors.warningLight],
      subtitle: 'Unread',
    },
  ];

  const recentApplications = [
    {
      id: '1',
      teacherName: 'Sarah Johnson',
      position: 'Mathematics Teacher',
      experience: '5 years',
      status: 'pending',
      appliedAt: '2 hours ago',
    },
    {
      id: '2',
      teacherName: 'Michael Chen',
      position: 'Science Teacher',
      experience: '3 years',
      status: 'reviewed',
      appliedAt: '1 day ago',
    },
    {
      id: '3',
      teacherName: 'Emily Davis',
      position: 'English Teacher',
      experience: '7 years',
      status: 'interviewed',
      appliedAt: '3 days ago',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'reviewed': return colors.info;
      case 'interviewed': return colors.success;
      default: return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.school.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[colors.school.primary, colors.school.light]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: colors.white }]}>
                Welcome back!
              </Text>
              <Text style={[styles.name, { color: colors.white }]}>
                {schoolProfile?.name || 'School Dashboard'}
              </Text>
              {schoolProfile && (
                <Text style={[styles.subtitle, { color: colors.white }]}>
                  {schoolProfile.location} • {schoolProfile.teacherCount} teachers
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.profileButton, { backgroundColor: colors.white }]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="business" size={24} color={colors.school.primary} />
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
                <Text style={[styles.statSubtitle, { color: colors.white }]}>
                  {stat.subtitle}
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

        {/* Recent Applications */}
        <Card style={[styles.applicationsCard, shadows.lg]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Recent Applications
            </Text>
            <Button
              title="View All"
              variant="ghost"
              size="small"
              onPress={() => navigation.navigate('Applications')}
            />
          </View>
          
          <View style={styles.applicationsList}>
            {recentApplications.map((application) => (
              <View key={application.id} style={styles.applicationItem}>
                <View style={[styles.applicationAvatar, { backgroundColor: colors.school.soft }]}>
                  <Ionicons name="person" size={20} color={colors.school.primary} />
                </View>
                <View style={styles.applicationContent}>
                  <Text style={[styles.applicationName, { color: colors.textPrimary }]}>
                    {application.teacherName}
                  </Text>
                  <Text style={[styles.applicationPosition, { color: colors.textSecondary }]}>
                    {application.position} • {application.experience}
                  </Text>
                  <Text style={[styles.applicationTime, { color: colors.textTertiary }]}>
                    Applied {application.appliedAt}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(application.status) }]}>
                    {application.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Hiring Progress */}
        <Card style={[styles.progressCard, shadows.lg]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Hiring Progress
            </Text>
            <Text style={[styles.progressPercentage, { color: colors.school.primary }]}>
              75%
            </Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.school.primary,
                  width: '75%'
                }
              ]} 
            />
          </View>
          
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            3 of 4 positions filled this semester
          </Text>
          
          <Button
            title="Post New Job"
            variant="outline"
            size="small"
            icon="add-outline"
            onPress={() => navigation.navigate('JobPosts')}
            style={styles.progressButton}
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
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 10,
    opacity: 0.7,
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
  applicationsCard: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  applicationsList: {
    gap: 16,
  },
  applicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  applicationContent: {
    flex: 1,
  },
  applicationName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  applicationPosition: {
    fontSize: 14,
    marginBottom: 2,
  },
  applicationTime: {
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  progressCard: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressPercentage: {
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
  progressText: {
    fontSize: 14,
    marginBottom: 16,
  },
  progressButton: {
    alignSelf: 'flex-start',
  },
});

export default ModernSchoolDashboard;
