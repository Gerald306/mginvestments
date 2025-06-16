import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { teacherService } from '../../services/teacherService';
import { schoolService } from '../../services/schoolService';
import {
  HeroSection,
  TeacherCarousel,
  SchoolCarousel,
  NavigationDrawer,
  Button,
} from '../../components';
import { Teacher } from '../../components/TeacherCard';
import { School } from '../../components/SchoolCard';

interface NavigationItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  badge?: number;
  color?: string;
  divider?: boolean;
}

const EnhancedHomepage: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qualifiedTeachers, setQualifiedTeachers] = useState<Teacher[]>([]);
  const [partnerSchools, setPartnerSchools] = useState<School[]>([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [stats, setStats] = useState({
    teachers: 0,
    schools: 0,
    applications: 0,
    placements: 0,
  });

  const navigation = useNavigation();
  const { colors, typography, shadows, spacing } = useTheme();
  const { user, userProfile, signOut } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadQualifiedTeachers(),
        loadPartnerSchools(),
        loadStats(),
      ]);
    } catch (error) {
      console.error('Error loading homepage data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadQualifiedTeachers = async () => {
    try {
      const teachers = await teacherService.getFeaturedTeachers(10);
      setQualifiedTeachers(teachers);
    } catch (error) {
      console.error('Error loading teachers:', error);
      setQualifiedTeachers([]);
    }
  };

  const loadPartnerSchools = async () => {
    try {
      const schools = await schoolService.getPartnerSchools(10);
      setPartnerSchools(schools);
    } catch (error) {
      console.error('Error loading schools:', error);
      setPartnerSchools([]);
    }
  };

  const loadStats = async () => {
    try {
      // Get real-time stats
      const [allTeachers, allSchools] = await Promise.all([
        teacherService.getAllTeachers(),
        schoolService.getAllSchools(),
      ]);

      setStats({
        teachers: allTeachers.length,
        schools: allSchools.length,
        applications: Math.floor(allTeachers.length * 2.5), // Estimated
        placements: Math.floor(allTeachers.length * 0.6), // Estimated
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsDrawerVisible(false);
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      {
        id: 'home',
        title: 'Home',
        icon: 'home-outline',
        onPress: () => {},
        color: colors.primary,
      },
      {
        id: 'services',
        title: 'Services',
        icon: 'briefcase-outline',
        onPress: () => navigation.navigate('Services' as never),
        color: colors.secondary,
      },
      {
        id: 'teachers',
        title: 'Browse Teachers',
        icon: 'people-outline',
        onPress: () => navigation.navigate('PublicTeachers' as never),
        color: colors.teacher.primary,
      },
      {
        id: 'schools',
        title: 'Browse Schools',
        icon: 'business-outline',
        onPress: () => navigation.navigate('PublicSchools' as never),
        color: colors.school.primary,
      },
      {
        id: 'about',
        title: 'About Us',
        icon: 'information-circle-outline',
        onPress: () => navigation.navigate('About' as never),
        color: colors.info,
        divider: true,
      },
    ];

    if (user) {
      // Add role-specific items
      if (userProfile?.role === 'teacher') {
        baseItems.push({
          id: 'teacher-dashboard',
          title: 'Teacher Dashboard',
          icon: 'school-outline',
          onPress: () => navigation.navigate('Dashboard' as never),
          color: colors.teacher.primary,
        });
      } else if (userProfile?.role === 'school') {
        baseItems.push({
          id: 'school-dashboard',
          title: 'School Dashboard',
          icon: 'business-outline',
          onPress: () => navigation.navigate('Dashboard' as never),
          color: colors.school.primary,
        });
      } else if (userProfile?.role === 'admin') {
        baseItems.push({
          id: 'admin-dashboard',
          title: 'Admin Dashboard',
          icon: 'settings-outline',
          onPress: () => navigation.navigate('Dashboard' as never),
          color: colors.warning,
        });
      }

      baseItems.push({
        id: 'profile',
        title: 'My Profile',
        icon: 'person-outline',
        onPress: () => navigation.navigate('Profile' as never),
        color: colors.textSecondary,
      });
    } else {
      baseItems.push({
        id: 'login',
        title: 'Login / Sign Up',
        icon: 'log-in-outline',
        onPress: () => navigation.navigate('Auth' as never),
        color: colors.primary,
      });
    }

    baseItems.push({
      id: 'contact',
      title: 'Contact Us',
      icon: 'mail-outline',
      onPress: () => navigation.navigate('Contact' as never),
      color: colors.success,
    });

    return baseItems;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setIsDrawerVisible(true)}
        >
          <Ionicons name="menu" size={24} color={colors.white} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.white }]}>
            MG Education Services
          </Text>
        </View>
        
        {user && (
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <Ionicons name="person-circle" size={28} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <HeroSection
          title="Empowering Education Through Innovation"
          subtitle="🎓 Welcome to MG Education Services"
          description="MG Investments provides comprehensive educational services including professional printing, creative design, quality embroidery, and connects qualified teachers with leading schools across Uganda."
          primaryButtonText="Find Teachers"
          secondaryButtonText="Browse Schools"
          onPrimaryPress={() => navigation.navigate('PublicTeachers' as never)}
          onSecondaryPress={() => navigation.navigate('PublicSchools' as never)}
          showStats={true}
          stats={stats}
          variant="default"
        />

        {/* Qualified Teachers Section */}
        <TeacherCarousel
          teachers={qualifiedTeachers}
          title="Qualified Teachers"
          subtitle="Discover amazing educators ready to make a difference in your school"
          onTeacherPress={(teacher) => {
            // Navigate to teacher details
            console.log('Teacher pressed:', teacher.full_name);
          }}
          onViewAllPress={() => navigation.navigate('PublicTeachers' as never)}
          variant="featured"
          showViewAll={true}
          refreshing={refreshing}
          onRefresh={loadQualifiedTeachers}
          emptyMessage="No qualified teachers available at the moment. Check back soon!"
        />

        {/* Partner Schools Section */}
        <SchoolCarousel
          schools={partnerSchools}
          title="Our Partner Schools"
          subtitle="Discover leading educational institutions actively seeking qualified teachers"
          onSchoolPress={(school) => {
            // Navigate to school details
            console.log('School pressed:', school.name);
          }}
          onViewAllPress={() => navigation.navigate('PublicSchools' as never)}
          variant="featured"
          showViewAll={true}
          refreshing={refreshing}
          onRefresh={loadPartnerSchools}
          emptyMessage="No partner schools available at the moment. Check back soon!"
        />

        {/* Services Preview */}
        <View style={[styles.servicesSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Our Services
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Comprehensive educational solutions for your needs
          </Text>
          
          <View style={styles.servicesGrid}>
            {[
              { title: 'Professional Printing', icon: 'print-outline', color: colors.info },
              { title: 'Creative Design', icon: 'color-palette-outline', color: colors.warning },
              { title: 'Quality Embroidery', icon: 'shirt-outline', color: colors.success },
              { title: 'Teacher Placement', icon: 'people-outline', color: colors.teacher.primary },
            ].map((service, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.serviceCard, { backgroundColor: colors.background }]}
                onPress={() => navigation.navigate('Services' as never)}
              >
                <View style={[styles.serviceIcon, { backgroundColor: service.color + '20' }]}>
                  <Ionicons name={service.icon as any} size={24} color={service.color} />
                </View>
                <Text style={[styles.serviceTitle, { color: colors.textPrimary }]}>
                  {service.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Button
            title="View All Services"
            onPress={() => navigation.navigate('Services' as never)}
            variant="outline"
            size="medium"
            icon="arrow-forward-outline"
            iconPosition="right"
            style={styles.servicesButton}
          />
        </View>

        {/* Call to Action */}
        <View style={[styles.ctaSection, { backgroundColor: colors.primary }]}>
          <Text style={[styles.ctaTitle, { color: colors.white }]}>
            Ready to Get Started?
          </Text>
          <Text style={[styles.ctaSubtitle, { color: colors.white }]}>
            Join thousands of teachers and schools already using our platform
          </Text>
          
          <View style={styles.ctaButtons}>
            {!user ? (
              <Button
                title="Join Now"
                onPress={() => navigation.navigate('Auth' as never)}
                variant="secondary"
                size="large"
                icon="person-add-outline"
                style={styles.ctaButton}
              />
            ) : (
              <Button
                title="Go to Dashboard"
                onPress={() => navigation.navigate('Dashboard' as never)}
                variant="secondary"
                size="large"
                icon="speedometer-outline"
                style={styles.ctaButton}
              />
            )}
            
            <Button
              title="Contact Us"
              onPress={() => navigation.navigate('Contact' as never)}
              variant="outline"
              size="large"
              icon="mail-outline"
              style={[styles.ctaButton, { borderColor: colors.white }]}
              textStyle={{ color: colors.white }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Navigation Drawer */}
      <NavigationDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        navigationItems={getNavigationItems()}
        onSignOut={user ? handleSignOut : undefined}
      />
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
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 44,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  servicesSection: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  serviceCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  servicesButton: {
    alignSelf: 'center',
  },
  ctaSection: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  ctaButtons: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  ctaButton: {
    width: '100%',
  },
});

export default EnhancedHomepage;
