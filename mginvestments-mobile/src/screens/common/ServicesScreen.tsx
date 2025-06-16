import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, Button } from '../../components';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  features: string[];
  contactInfo?: string;
}

const ServicesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, typography, shadows, spacing } = useTheme();

  const services: Service[] = [
    {
      id: 'printing',
      title: 'Professional Printing',
      description: 'High-quality printing services for all your educational materials, documents, and promotional content.',
      icon: 'print-outline',
      color: colors.info,
      features: [
        'Digital and offset printing',
        'Educational materials and textbooks',
        'Certificates and diplomas',
        'Promotional materials',
        'Business cards and letterheads',
        'Large format printing',
      ],
      contactInfo: 'Call us for printing quotes and bulk orders',
    },
    {
      id: 'design',
      title: 'Creative Design',
      description: 'Professional graphic design services to bring your educational vision to life with stunning visuals.',
      icon: 'color-palette-outline',
      color: colors.warning,
      features: [
        'Logo and brand identity design',
        'Educational material layouts',
        'Marketing and promotional designs',
        'Website and digital graphics',
        'Presentation templates',
        'Custom illustrations',
      ],
      contactInfo: 'Portfolio available upon request',
    },
    {
      id: 'embroidery',
      title: 'Quality Embroidery',
      description: 'Custom embroidery services for school uniforms, corporate wear, and promotional items.',
      icon: 'shirt-outline',
      color: colors.success,
      features: [
        'School uniform embroidery',
        'Corporate logo embroidery',
        'Sports team uniforms',
        'Custom patches and badges',
        'Bulk order discounts',
        'Fast turnaround times',
      ],
      contactInfo: 'Minimum order quantities apply',
    },
    {
      id: 'teacher-placement',
      title: 'Teacher Placement',
      description: 'Connecting qualified teachers with leading schools across Uganda through our comprehensive platform.',
      icon: 'people-outline',
      color: colors.teacher.primary,
      features: [
        'Verified teacher profiles',
        'School-teacher matching',
        'Application management',
        'Interview coordination',
        'Background verification',
        'Ongoing support',
      ],
      contactInfo: 'Free registration for teachers and schools',
    },
  ];

  const handleContactPress = async () => {
    const phoneNumber = '+256700000000'; // Replace with actual number
    const url = `tel:${phoneNumber}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log('Phone calls not supported');
      }
    } catch (error) {
      console.error('Error opening phone app:', error);
    }
  };

  const handleEmailPress = async () => {
    const email = 'info@mginvestments.com'; // Replace with actual email
    const url = `mailto:${email}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log('Email not supported');
      }
    } catch (error) {
      console.error('Error opening email app:', error);
    }
  };

  const renderServiceCard = (service: Service) => (
    <Card key={service.id} style={[styles.serviceCard, shadows.md]}>
      <View style={styles.serviceHeader}>
        <LinearGradient
          colors={[service.color, service.color + '80']}
          style={styles.serviceIconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={service.icon} size={32} color={colors.white} />
        </LinearGradient>
        <View style={styles.serviceHeaderText}>
          <Text style={[styles.serviceTitle, { color: colors.textPrimary }]}>
            {service.title}
          </Text>
          <Text style={[styles.serviceDescription, { color: colors.textSecondary }]}>
            {service.description}
          </Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={[styles.featuresTitle, { color: colors.textPrimary }]}>
          What we offer:
        </Text>
        {service.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={16} color={service.color} />
            <Text style={[styles.featureText, { color: colors.textSecondary }]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>

      {service.contactInfo && (
        <View style={[styles.contactInfo, { backgroundColor: service.color + '10' }]}>
          <Ionicons name="information-circle" size={16} color={service.color} />
          <Text style={[styles.contactInfoText, { color: service.color }]}>
            {service.contactInfo}
          </Text>
        </View>
      )}

      <Button
        title="Get Quote"
        onPress={() => navigation.navigate('Contact' as never)}
        variant="outline"
        size="medium"
        icon="mail-outline"
        style={[styles.quoteButton, { borderColor: service.color }]}
        textStyle={{ color: service.color }}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* Header */}
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: colors.white }]}>
              Our Services
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.white }]}>
              Comprehensive educational solutions
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Services List */}
        <View style={styles.servicesContainer}>
          {services.map(renderServiceCard)}
        </View>

        {/* Contact Section */}
        <Card style={[styles.contactSection, shadows.lg]}>
          <View style={styles.contactHeader}>
            <View style={[styles.contactIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="call-outline" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.contactTitle, { color: colors.textPrimary }]}>
              Need a Custom Solution?
            </Text>
            <Text style={[styles.contactDescription, { color: colors.textSecondary }]}>
              Contact us for personalized quotes and custom service packages tailored to your needs.
            </Text>
          </View>

          <View style={styles.contactButtons}>
            <Button
              title="Call Us"
              onPress={handleContactPress}
              variant="primary"
              size="large"
              icon="call-outline"
              style={styles.contactButton}
            />
            
            <Button
              title="Email Us"
              onPress={handleEmailPress}
              variant="outline"
              size="large"
              icon="mail-outline"
              style={styles.contactButton}
            />
          </View>

          <View style={styles.businessHours}>
            <Text style={[styles.businessHoursTitle, { color: colors.textPrimary }]}>
              Business Hours
            </Text>
            <View style={styles.hoursItem}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.hoursText, { color: colors.textSecondary }]}>
                Monday - Friday: 8:00 AM - 6:00 PM
              </Text>
            </View>
            <View style={styles.hoursItem}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.hoursText, { color: colors.textSecondary }]}>
                Saturday: 9:00 AM - 4:00 PM
              </Text>
            </View>
            <View style={styles.hoursItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.hoursText, { color: colors.textSecondary }]}>
                Sunday: Closed
              </Text>
            </View>
          </View>
        </Card>

        {/* Why Choose Us Section */}
        <Card style={[styles.whyChooseSection, shadows.md]}>
          <Text style={[styles.whyChooseTitle, { color: colors.textPrimary }]}>
            Why Choose MG Investments?
          </Text>
          
          {[
            { icon: 'star-outline', text: 'Over 10 years of experience in educational services' },
            { icon: 'people-outline', text: 'Trusted by hundreds of schools and teachers' },
            { icon: 'checkmark-circle-outline', text: 'Quality guaranteed on all our services' },
            { icon: 'flash-outline', text: 'Fast turnaround times and reliable delivery' },
            { icon: 'shield-checkmark-outline', text: 'Secure and professional service' },
          ].map((item, index) => (
            <View key={index} style={styles.whyChooseItem}>
              <Ionicons name={item.icon as any} size={20} color={colors.primary} />
              <Text style={[styles.whyChooseText, { color: colors.textSecondary }]}>
                {item.text}
              </Text>
            </View>
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  servicesContainer: {
    marginBottom: 24,
  },
  serviceCard: {
    marginBottom: 20,
    padding: 20,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceHeaderText: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  contactInfoText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  quoteButton: {
    alignSelf: 'flex-start',
  },
  contactSection: {
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  contactHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  contactIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  contactButton: {
    flex: 1,
  },
  businessHours: {
    width: '100%',
  },
  businessHoursTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  hoursItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'center',
  },
  hoursText: {
    fontSize: 14,
    marginLeft: 8,
  },
  whyChooseSection: {
    padding: 20,
  },
  whyChooseTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  whyChooseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  whyChooseText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default ServicesScreen;
