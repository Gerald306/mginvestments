import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface LandingScreenProps {
  onGetStarted: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onGetStarted }) => {
  const stats = {
    totalTeachers: 2847,
    totalSchools: 156,
    totalJobs: 89,
    successfulPlacements: 1923,
    yearsExperience: 8,
    satisfactionRate: 98,
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          style={styles.heroSection}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroContent}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🎓 Welcome to MG Education Services</Text>
            </View>

            <Text style={styles.heroTitle}>
              <Text style={styles.heroTitleMain}>MG Investments</Text>
              {'\n'}
              <Text style={styles.heroTitleSub}>Connecting </Text>
              <Text style={styles.heroTitleAccent}>Excellence</Text>
              {'\n'}
              <Text style={styles.heroTitleSub}>in Education</Text>
            </Text>

            <Text style={styles.heroDescription}>
              Uganda's premier educational services platform. We provide{' '}
              <Text style={styles.highlightBlue}>professional printing</Text>, {' '}
              <Text style={styles.highlightPurple}>creative design</Text>, {' '}
              <Text style={styles.highlightTeal}>quality embroidery</Text>, and connect qualified teachers with leading schools nationwide. Building the future of education through innovation and excellence.
            </Text>

            <TouchableOpacity style={styles.primaryButton} onPress={onGetStarted}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Our Impact Across Uganda</Text>
          <Text style={styles.sectionSubtitle}>
            Transforming education through proven results and trusted partnerships
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalTeachers.toLocaleString()}+</Text>
              <Text style={styles.statLabel}>Qualified Teachers</Text>
              <Text style={styles.statSubLabel}>Registered & Verified</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalSchools}+</Text>
              <Text style={styles.statLabel}>Partner Schools</Text>
              <Text style={styles.statSubLabel}>Across Uganda</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalJobs}+</Text>
              <Text style={styles.statLabel}>Active Job Posts</Text>
              <Text style={styles.statSubLabel}>Available Now</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.successfulPlacements.toLocaleString()}+</Text>
              <Text style={styles.statLabel}>Successful Placements</Text>
              <Text style={styles.statSubLabel}>This Year</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.yearsExperience}+</Text>
              <Text style={styles.statLabel}>Years Experience</Text>
              <Text style={styles.statSubLabel}>In Education</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.satisfactionRate}%</Text>
              <Text style={styles.statLabel}>Satisfaction Rate</Text>
              <Text style={styles.statSubLabel}>Client Approved</Text>
            </View>
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Our Premium Services</Text>
          <Text style={styles.sectionSubtitle}>
            Comprehensive educational solutions trusted by Uganda's leading institutions
          </Text>

          <View style={styles.serviceGrid}>
            <View style={styles.serviceCard}>
              <View style={styles.serviceIconContainer}>
                <Text style={styles.serviceIcon}>🖨️</Text>
              </View>
              <Text style={styles.serviceTitle}>Professional Printing Services</Text>
              <Text style={styles.serviceDescription}>
                State-of-the-art printing solutions for textbooks, educational materials, certificates, and institutional documents. High-quality offset and digital printing with fast turnaround times.
              </Text>
              <View style={styles.serviceFeatures}>
                <Text style={styles.featureItem}>• Textbooks & Educational Materials</Text>
                <Text style={styles.featureItem}>• Certificates & Diplomas</Text>
                <Text style={styles.featureItem}>• Marketing Materials</Text>
              </View>
            </View>

            <View style={styles.serviceCard}>
              <View style={styles.serviceIconContainer}>
                <Text style={styles.serviceIcon}>🎨</Text>
              </View>
              <Text style={styles.serviceTitle}>Creative Design Studio</Text>
              <Text style={styles.serviceDescription}>
                Professional graphic design services for educational content, institutional branding, and marketing campaigns. Creating visual excellence for Uganda's education sector.
              </Text>
              <View style={styles.serviceFeatures}>
                <Text style={styles.featureItem}>• Logo & Brand Design</Text>
                <Text style={styles.featureItem}>• Educational Content Design</Text>
                <Text style={styles.featureItem}>• Marketing Campaigns</Text>
              </View>
            </View>

            <View style={styles.serviceCard}>
              <View style={styles.serviceIconContainer}>
                <Text style={styles.serviceIcon}>✂️</Text>
              </View>
              <Text style={styles.serviceTitle}>Premium Embroidery</Text>
              <Text style={styles.serviceDescription}>
                Custom embroidery services for school uniforms, institutional badges, and branded apparel. Precision craftsmanship with durable, professional results.
              </Text>
              <View style={styles.serviceFeatures}>
                <Text style={styles.featureItem}>• School Uniform Embroidery</Text>
                <Text style={styles.featureItem}>• Institutional Badges</Text>
                <Text style={styles.featureItem}>• Custom Branded Apparel</Text>
              </View>
            </View>

            <View style={styles.serviceCard}>
              <View style={styles.serviceIconContainer}>
                <Text style={styles.serviceIcon}>👥</Text>
              </View>
              <Text style={styles.serviceTitle}>Teacher Placement Network</Text>
              <Text style={styles.serviceDescription}>
                Uganda's premier teacher placement platform connecting qualified educators with leading schools. Comprehensive vetting, matching, and placement services.
              </Text>
              <View style={styles.serviceFeatures}>
                <Text style={styles.featureItem}>• Qualified Teacher Database</Text>
                <Text style={styles.featureItem}>• School Partnership Network</Text>
                <Text style={styles.featureItem}>• Professional Matching</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <LinearGradient
          colors={['#1f2937', '#374151']}
          style={styles.featuresSection}
        >
          <Text style={styles.sectionTitleWhite}>Why Choose MG Investments?</Text>
          <Text style={styles.sectionSubtitleWhite}>
            We provide comprehensive solutions that make educational excellence accessible to everyone
          </Text>

          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureTitle}>Verified Teachers</Text>
              <Text style={styles.featureDescription}>
                All teachers are thoroughly vetted and verified for qualifications
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureTitle}>Real-time Matching</Text>
              <Text style={styles.featureDescription}>
                Advanced matching system connects schools with ideal candidates
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔒</Text>
              <Text style={styles.featureTitle}>Secure Platform</Text>
              <Text style={styles.featureDescription}>
                Safe and secure platform for all your hiring needs
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaDescription}>
            Join thousands of teachers and schools already using our platform
          </Text>

          <TouchableOpacity style={styles.ctaPrimaryButton} onPress={onGetStarted}>
            <Text style={styles.ctaPrimaryButtonText}>Join Now</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            © 2024 MG Investments. Empowering Education Through Innovation.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    minHeight: screenHeight * 0.85,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  heroTitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  heroTitleMain: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 38,
  },
  heroTitleSub: {
    fontSize: 32,
    fontWeight: '300',
    color: '#ffffff',
    lineHeight: 38,
  },
  heroTitleAccent: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fbbf24',
    lineHeight: 38,
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  highlightBlue: {
    color: '#60a5fa',
    fontWeight: '600',
  },
  highlightPurple: {
    color: '#c084fc',
    fontWeight: '600',
  },
  highlightTeal: {
    color: '#34d399',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  primaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsSection: {
    padding: 24,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 4,
  },
  statSubLabel: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '400',
  },
  servicesSection: {
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  serviceGrid: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'flex-start',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  serviceIconContainer: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: 'center',
  },
  serviceIcon: {
    fontSize: 32,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
    alignSelf: 'center',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'left',
    lineHeight: 22,
    marginBottom: 16,
  },
  serviceFeatures: {
    width: '100%',
  },
  featureItem: {
    fontSize: 13,
    color: '#059669',
    marginBottom: 4,
    fontWeight: '500',
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitleWhite: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionSubtitleWhite: {
    fontSize: 16,
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featureGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaSection: {
    padding: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaPrimaryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 32,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ctaPrimaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default LandingScreen;
