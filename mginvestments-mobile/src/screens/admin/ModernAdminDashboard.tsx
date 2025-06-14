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
import Card from '../../components/Card';
import Button from '../../components/Button';
import { AdminStackParamList } from '../../types';

type AdminDashboardNavigationProp = StackNavigationProp<AdminStackParamList, 'Dashboard'>;

const { width, height } = Dimensions.get('window');

const ModernAdminDashboard: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTeachers: 1247,
    activeSchools: 89,
    totalApplications: 456,
    successfulPlacements: 234,
    pendingApprovals: 12,
    systemHealth: 98,
  });

  const navigation = useNavigation<AdminDashboardNavigationProp>();
  const { userProfile, logout } = useAuth();
  const { colors, typography, shadows, spacing } = useTheme();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      // Load admin statistics
      // This would typically fetch from your admin service
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Error loading admin data:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadAdminData();
    setRefreshing(false);
  }, []);

  const quickActions = [
    {
      title: 'Manage Teachers',
      subtitle: 'Review & approve',
      icon: 'people-outline',
      color: colors.admin.primary,
      onPress: () => navigation.navigate('Teachers'),
    },
    {
      title: 'Manage Schools',
      subtitle: 'School oversight',
      icon: 'business-outline',
      color: colors.secondary,
      onPress: () => navigation.navigate('Schools'),
    },
    {
      title: 'Analytics',
      subtitle: 'Platform insights',
      icon: 'analytics-outline',
      color: colors.info,
      onPress: () => navigation.navigate('Analytics'),
    },
    {
      title: 'System Settings',
      subtitle: 'Configuration',
      icon: 'settings-outline',
      color: colors.textSecondary,
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  const statCards = [
    {
      title: 'Total Teachers',
      value: stats.totalTeachers.toLocaleString(),
      icon: 'people',
      color: colors.admin.primary,
      gradient: [colors.admin.primary, colors.admin.light],
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Active Schools',
      value: stats.activeSchools,
      icon: 'business',
      color: colors.secondary,
      gradient: [colors.secondary, colors.secondaryLight],
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'Applications',
      value: stats.totalApplications,
      icon: 'document-text',
      color: colors.info,
      gradient: [colors.info, colors.infoLight],
      change: '+23%',
      changeType: 'positive',
    },
    {
      title: 'Placements',
      value: stats.successfulPlacements,
      icon: 'checkmark-circle',
      color: colors.success,
      gradient: [colors.success, colors.successLight],
      change: '+15%',
      changeType: 'positive',
    },
  ];

  const recentActivity = [
    {
      id: '1',
      type: 'teacher_approval',
      title: 'New teacher approved',
      description: 'Sarah Johnson - Mathematics Teacher',
      time: '2 minutes ago',
      icon: 'checkmark-circle-outline',
      color: colors.success,
    },
    {
      id: '2',
      type: 'school_registration',
      title: 'School registered',
      description: 'Greenwood International Academy',
      time: '1 hour ago',
      icon: 'business-outline',
      color: colors.secondary,
    },
    {
      id: '3',
      type: 'system_alert',
      title: 'System maintenance',
      description: 'Scheduled for tonight at 2 AM',
      time: '3 hours ago',
      icon: 'warning-outline',
      color: colors.warning,
    },
    {
      id: '4',
      type: 'placement_success',
      title: 'Successful placement',
      description: 'Michael Chen hired by Riverside School',
      time: '1 day ago',
      icon: 'trophy-outline',
      color: colors.admin.primary,
    },
  ];

  const pendingTasks = [
    {
      id: '1',
      title: 'Teacher Applications',
      count: 8,
      priority: 'high',
      action: () => navigation.navigate('Teachers'),
    },
    {
      id: '2',
      title: 'School Verifications',
      count: 3,
      priority: 'medium',
      action: () => navigation.navigate('Schools'),
    },
    {
      id: '3',
      title: 'System Reports',
      count: 2,
      priority: 'low',
      action: () => navigation.navigate('Analytics'),
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.info;
      default: return colors.textSecondary;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.admin.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[colors.admin.primary, colors.admin.light]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: colors.white }]}>
                Admin Dashboard
              </Text>
              <Text style={[styles.name, { color: colors.white }]}>
                MG Investments Platform
              </Text>
              <Text style={[styles.subtitle, { color: colors.white }]}>
                System Health: {stats.systemHealth}% • {stats.pendingApprovals} pending
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.profileButton, { backgroundColor: colors.white }]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Ionicons name="settings" size={24} color={colors.admin.primary} />
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
                <View style={styles.statHeader}>
                  <View style={[styles.statIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                    <Ionicons name={stat.icon as any} size={20} color={colors.white} />
                  </View>
                  <Text style={[styles.statChange, { color: colors.white }]}>
                    {stat.change}
                  </Text>
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

        {/* Pending Tasks */}
        <Card style={[styles.tasksCard, shadows.lg]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Pending Tasks
          </Text>
          <View style={styles.tasksList}>
            {pendingTasks.map((task) => (
              <Pressable
                key={task.id}
                style={styles.taskItem}
                onPress={task.action}
              >
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, { color: colors.textPrimary }]}>
                    {task.title}
                  </Text>
                  <View style={styles.taskMeta}>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) + '20' }]}>
                      <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
                        {task.priority}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.taskCount, { backgroundColor: colors.admin.primary }]}>
                  <Text style={[styles.taskCountText, { color: colors.white }]}>
                    {task.count}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Card>

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
            {recentActivity.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
                  <Ionicons name={activity.icon as any} size={16} color={activity.color} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={[styles.activityTitle, { color: colors.textPrimary }]}>
                    {activity.title}
                  </Text>
                  <Text style={[styles.activityDescription, { color: colors.textSecondary }]}>
                    {activity.description}
                  </Text>
                  <Text style={[styles.activityTime, { color: colors.textTertiary }]}>
                    {activity.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* System Status */}
        <Card style={[styles.statusCard, shadows.lg]}>
          <View style={styles.statusHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              System Status
            </Text>
            <View style={[styles.statusIndicator, { backgroundColor: colors.success }]}>
              <Text style={[styles.statusText, { color: colors.white }]}>
                Healthy
              </Text>
            </View>
          </View>
          
          <View style={styles.statusMetrics}>
            <View style={styles.statusMetric}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Uptime
              </Text>
              <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
                99.9%
              </Text>
            </View>
            <View style={styles.statusMetric}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Response Time
              </Text>
              <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
                120ms
              </Text>
            </View>
            <View style={styles.statusMetric}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                Active Users
              </Text>
              <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
                1,247
              </Text>
            </View>
          </View>
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
    alignItems: 'flex-start',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statChange: {
    fontSize: 12,
    fontWeight: '600',
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
  tasksCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  tasksList: {
    gap: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  taskCount: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCountText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsCard: {
    marginBottom: 24,
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
    alignItems: 'flex-start',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  statusCard: {
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusMetric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ModernAdminDashboard;
