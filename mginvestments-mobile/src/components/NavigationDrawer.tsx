import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface NavigationItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  badge?: number;
  color?: string;
  divider?: boolean;
}

interface NavigationDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  navigationItems: NavigationItem[];
  userInfo?: {
    name?: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
  onSignOut?: () => void;
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isVisible,
  onClose,
  navigationItems,
  userInfo,
  onSignOut,
}) => {
  const { colors, typography, shadows, spacing } = useTheme();
  const { user, userProfile } = useAuth();

  if (!isVisible) return null;

  const renderUserSection = () => {
    if (!user && !userInfo) return null;

    const displayName = userInfo?.name || userProfile?.full_name || user?.email || 'User';
    const displayEmail = userInfo?.email || user?.email || '';
    const displayRole = userInfo?.role || userProfile?.role || 'User';
    const displayAvatar = userInfo?.avatar || userProfile?.profile_picture;

    return (
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.userSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.userInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.white }]}>
            {displayAvatar ? (
              <Image source={{ uri: displayAvatar }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={32} color={colors.primary} />
            )}
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.white }]} numberOfLines={1}>
              {displayName}
            </Text>
            <Text style={[styles.userEmail, { color: colors.white }]} numberOfLines={1}>
              {displayEmail}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: colors.white + '30' }]}>
              <Text style={[styles.roleText, { color: colors.white }]}>
                {displayRole.charAt(0).toUpperCase() + displayRole.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderNavigationItem = (item: NavigationItem, index: number) => (
    <View key={item.id}>
      <TouchableOpacity
        style={[
          styles.navigationItem,
          { backgroundColor: colors.surface },
        ]}
        onPress={() => {
          item.onPress();
          onClose();
        }}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: (item.color || colors.primary) + '15' }
          ]}>
            <Ionicons
              name={item.icon}
              size={20}
              color={item.color || colors.primary}
            />
          </View>
          <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
            {item.title}
          </Text>
          {item.badge && item.badge > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.error }]}>
              <Text style={[styles.badgeText, { color: colors.white }]}>
                {item.badge > 99 ? '99+' : item.badge}
              </Text>
            </View>
          )}
          <Ionicons
            name="chevron-forward"
            size={16}
            color={colors.textTertiary}
            style={styles.chevron}
          />
        </View>
      </TouchableOpacity>
      {item.divider && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
    </View>
  );

  const renderSignOutButton = () => {
    if (!onSignOut || !user) return null;

    return (
      <TouchableOpacity
        style={[
          styles.signOutButton,
          { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }
        ]}
        onPress={() => {
          onSignOut();
          onClose();
        }}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          <View style={[styles.iconContainer, { backgroundColor: colors.error + '15' }]}>
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
          </View>
          <Text style={[styles.itemTitle, { color: colors.error }]}>
            Sign Out
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.overlay}>
      {/* Background Overlay */}
      <TouchableOpacity
        style={styles.backgroundOverlay}
        onPress={onClose}
        activeOpacity={1}
      />

      {/* Drawer Content */}
      <SafeAreaView style={[styles.drawer, { backgroundColor: colors.background }]}>
        <View style={styles.drawerContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.surface }]}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* User Section */}
          {renderUserSection()}

          {/* Navigation Items */}
          <ScrollView
            style={styles.navigationContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.navigationList}>
              {navigationItems.map((item, index) => renderNavigationItem(item, index))}
            </View>

            {/* Sign Out Button */}
            {renderSignOutButton()}

            {/* App Info */}
            <View style={styles.appInfo}>
              <Text style={[styles.appName, { color: colors.textSecondary }]}>
                MG Investments Mobile
              </Text>
              <Text style={[styles.appVersion, { color: colors.textTertiary }]}>
                Version 1.0.0
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },
  backgroundOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 16,
  },
  drawerContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  navigationContainer: {
    flex: 1,
  },
  navigationList: {
    paddingHorizontal: 16,
  },
  navigationItem: {
    borderRadius: 12,
    marginBottom: 4,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  chevron: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  signOutButton: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  appName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 12,
  },
});

export default NavigationDrawer;
