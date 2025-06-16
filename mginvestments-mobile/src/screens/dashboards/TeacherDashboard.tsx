import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Card } from '../../components';

const TeacherDashboard: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { user, userProfile } = useAuth();

  const dashboardItems = [
    {
      title: 'My Profile',
      subtitle: 'Update your teaching credentials',
      icon: 'person-outline',
      color: colors.teacher.primary,
      onPress: () => navigation.navigate('Profile' as never),
    },
    {
      title: 'Job Applications',
      subtitle: 'View and manage applications',
      icon: 'document-text-outline',
      color: colors.info,
      onPress: () => {},
    },
    {
      title: 'School Matches',
      subtitle: 'Find schools looking for teachers',
      icon: 'business-outline',
      color: colors.school.primary,
      onPress: () => navigation.navigate('PublicSchools' as never),
    },
    {
      title: 'Messages',
      subtitle: 'Communicate with schools',
      icon: 'mail-outline',
      color: colors.success,
      onPress: () => {},
    },
    {
      title: 'Documents',
      subtitle: 'Manage your certificates',
      icon: 'folder-outline',
      color: colors.warning,
      onPress: () => {},
    },
    {
      title: 'Settings',
      subtitle: 'Account and preferences',
      icon: 'settings-outline',
      color: colors.textSecondary,
      onPress: () => {},
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.teacher.primary} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.teacher.primary }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.white }]}>
            Teacher Dashboard
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.white }]}>
            Welcome back, {userProfile?.full_name || user?.email || 'Teacher'}!
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile' as never)}
        >
          <Ionicons name="person-circle" size={28} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={[styles.statCard, { backgroundColor: colors.teacher.soft }]}>
            <Text style={[styles.statValue, { color: colors.teacher.primary }]}>5</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Applications</Text>
          </Card>
          <Card style={[styles.statCard, { backgroundColor: colors.info + '20' }]}>
            <Text style={[styles.statValue, { color: colors.info }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Profile Views</Text>
          </Card>
          <Card style={[styles.statCard, { backgroundColor: colors.success + '20' }]}>
            <Text style={[styles.statValue, { color: colors.success }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Interviews</Text>
          </Card>
        </View>

        {/* Dashboard Items */}
        <View style={styles.itemsContainer}>
          {dashboardItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.dashboardItem, { backgroundColor: colors.surface }]}
              onPress={item.onPress}
            >
              <View style={[styles.itemIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={24} color={item.color} />
              </View>
              <View style={styles.itemContent}>
                <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                  {item.title}
                </Text>
                <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>
                  {item.subtitle}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Browse Schools"
            onPress={() => navigation.navigate('PublicSchools' as never)}
            variant="primary"
            size="large"
            icon="business-outline"
            style={[styles.actionButton, { backgroundColor: colors.teacher.primary }]}
          />
          <Button
            title="Update Profile"
            onPress={() => navigation.navigate('Profile' as never)}
            variant="outline"
            size="large"
            icon="person-outline"
            style={styles.actionButton}
          />
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 44,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 2,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemsContainer: {
    marginBottom: 24,
  },
  dashboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  actionsContainer: {
    gap: 12,
    paddingBottom: 24,
  },
  actionButton: {
    width: '100%',
  },
});

export default TeacherDashboard;
