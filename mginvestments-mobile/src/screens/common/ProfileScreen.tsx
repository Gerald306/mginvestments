import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';

const ProfileScreen: React.FC = () => {
  const { userProfile, user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout from MG Investments?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Alert.alert('Success', 'You have been logged out successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'teacher': return 'Teacher';
      case 'school': return 'School Administrator';
      case 'admin': return 'System Administrator';
      default: return 'User';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'teacher': return '#3B82F6';
      case 'school': return '#10B981';
      case 'admin': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#ffffff', '#f8fafc']}
              style={styles.avatar}
            >
              <Ionicons name="person" size={48} color="#667eea" />
            </LinearGradient>
          </View>
          <Text style={styles.email}>{userProfile?.email || user?.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(userProfile?.role || 'user') }]}>
            <Text style={styles.roleText}>{getRoleDisplayName(userProfile?.role || 'user')}</Text>
          </View>
          <Text style={styles.memberSince}>
            Member since {userProfile?.createdAt ? new Date(userProfile.createdAt).getFullYear() : new Date().getFullYear()}
          </Text>
        </View>
      </LinearGradient>

      {/* Menu Section */}
      <View style={styles.menuContainer}>
        <Text style={styles.sectionTitle}>Account Settings</Text>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="person-outline" size={24} color="#3B82F6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Edit Profile</Text>
              <Text style={styles.menuSubtext}>Update your personal information</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="notifications-outline" size={24} color="#10B981" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Notifications</Text>
              <Text style={styles.menuSubtext}>Manage your notification preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="shield-outline" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Privacy & Security</Text>
              <Text style={styles.menuSubtext}>Password and security settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="help-circle-outline" size={24} color="#F59E0B" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Help & Support</Text>
              <Text style={styles.menuSubtext}>Get help and contact support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>About MG Investments</Text>
              <Text style={styles.menuSubtext}>App version and company info</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <Text style={styles.sectionTitle}>Account Actions</Text>
        <View style={styles.menu}>
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, styles.logoutIconContainer]}>
              <Ionicons name="log-out-outline" size={24} color="#DC2626" />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
              <Text style={styles.menuSubtext}>Sign out of your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#DC2626" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>MG Investments Mobile App</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2024 MG Investments. All rights reserved.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  email: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 20,
  },
  menu: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '400',
  },
  logoutItem: {
    borderBottomWidth: 0,
    backgroundColor: '#fef2f2',
  },
  logoutIconContainer: {
    backgroundColor: '#fee2e2',
  },
  logoutText: {
    color: '#DC2626',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  appInfoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default ProfileScreen;
