import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, Button, Input } from '../../components';

interface ContactMethod {
  id: string;
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  action: () => void;
}

const ContactScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, typography, shadows, spacing } = useTheme();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods: ContactMethod[] = [
    {
      id: 'phone',
      title: 'Call Us',
      value: '+256 700 000 000',
      icon: 'call-outline',
      color: colors.success,
      action: async () => {
        const url = 'tel:+256700000000';
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        }
      },
    },
    {
      id: 'email',
      title: 'Email Us',
      value: 'info@mginvestments.com',
      icon: 'mail-outline',
      color: colors.primary,
      action: async () => {
        const url = 'mailto:info@mginvestments.com';
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        }
      },
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      value: '+256 700 000 000',
      icon: 'logo-whatsapp',
      color: '#25D366',
      action: async () => {
        const url = 'whatsapp://send?phone=256700000000';
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('WhatsApp not installed', 'Please install WhatsApp to use this feature');
        }
      },
    },
    {
      id: 'location',
      title: 'Visit Us',
      value: 'Kampala, Uganda',
      icon: 'location-outline',
      color: colors.warning,
      action: async () => {
        const url = 'https://maps.google.com/?q=Kampala,Uganda';
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        }
      },
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Message Sent!',
        'Thank you for contacting us. We will get back to you within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContactMethod = (method: ContactMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[styles.contactMethodCard, { backgroundColor: colors.surface }]}
      onPress={method.action}
      activeOpacity={0.7}
    >
      <View style={[styles.contactMethodIcon, { backgroundColor: method.color + '20' }]}>
        <Ionicons name={method.icon} size={24} color={method.color} />
      </View>
      <View style={styles.contactMethodContent}>
        <Text style={[styles.contactMethodTitle, { color: colors.textPrimary }]}>
          {method.title}
        </Text>
        <Text style={[styles.contactMethodValue, { color: colors.textSecondary }]}>
          {method.value}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
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
              Contact Us
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.white }]}>
              Get in touch with our team
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Methods */}
        <View style={styles.contactMethodsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Get In Touch
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Choose your preferred way to contact us
          </Text>
          
          <View style={styles.contactMethodsList}>
            {contactMethods.map(renderContactMethod)}
          </View>
        </View>

        {/* Contact Form */}
        <Card style={[styles.formCard, shadows.lg]}>
          <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
            Send us a Message
          </Text>
          <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
            Fill out the form below and we'll get back to you soon
          </Text>

          <View style={styles.formContainer}>
            <Input
              label="Full Name *"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter your full name"
              icon="person-outline"
            />

            <Input
              label="Email Address *"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter your email address"
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Enter your phone number"
              icon="call-outline"
              keyboardType="phone-pad"
            />

            <Input
              label="Subject"
              value={formData.subject}
              onChangeText={(value) => handleInputChange('subject', value)}
              placeholder="What is this regarding?"
              icon="document-text-outline"
            />

            <Input
              label="Message *"
              value={formData.message}
              onChangeText={(value) => handleInputChange('message', value)}
              placeholder="Tell us how we can help you..."
              icon="chatbubble-outline"
              multiline
              numberOfLines={4}
              style={styles.messageInput}
            />

            <Button
              title={isSubmitting ? "Sending..." : "Send Message"}
              onPress={handleSubmit}
              variant="primary"
              size="large"
              icon="send-outline"
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
          </View>
        </Card>

        {/* Business Hours */}
        <Card style={[styles.hoursCard, shadows.md]}>
          <View style={styles.hoursHeader}>
            <View style={[styles.hoursIcon, { backgroundColor: colors.info + '20' }]}>
              <Ionicons name="time-outline" size={24} color={colors.info} />
            </View>
            <Text style={[styles.hoursTitle, { color: colors.textPrimary }]}>
              Business Hours
            </Text>
          </View>

          <View style={styles.hoursList}>
            {[
              { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM' },
              { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
              { day: 'Sunday', hours: 'Closed' },
            ].map((item, index) => (
              <View key={index} style={styles.hoursItem}>
                <Text style={[styles.hoursDay, { color: colors.textPrimary }]}>
                  {item.day}
                </Text>
                <Text style={[styles.hoursTime, { color: colors.textSecondary }]}>
                  {item.hours}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* FAQ Section */}
        <Card style={[styles.faqCard, shadows.md]}>
          <Text style={[styles.faqTitle, { color: colors.textPrimary }]}>
            Frequently Asked Questions
          </Text>
          
          {[
            {
              question: 'How quickly do you respond to inquiries?',
              answer: 'We typically respond within 24 hours during business days.',
            },
            {
              question: 'Do you offer bulk discounts?',
              answer: 'Yes, we offer competitive pricing for bulk orders. Contact us for a quote.',
            },
            {
              question: 'Can I schedule a consultation?',
              answer: 'Absolutely! Call us or send a message to schedule a consultation.',
            },
          ].map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={[styles.faqQuestion, { color: colors.textPrimary }]}>
                {item.question}
              </Text>
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                {item.answer}
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
  contactMethodsSection: {
    marginBottom: 24,
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
  contactMethodsList: {
    gap: 12,
  },
  contactMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  contactMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactMethodContent: {
    flex: 1,
  },
  contactMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactMethodValue: {
    fontSize: 14,
  },
  formCard: {
    padding: 24,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  formContainer: {
    gap: 16,
  },
  messageInput: {
    minHeight: 100,
  },
  submitButton: {
    marginTop: 8,
  },
  hoursCard: {
    padding: 20,
    marginBottom: 20,
  },
  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hoursIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  hoursList: {
    gap: 12,
  },
  hoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hoursDay: {
    fontSize: 14,
    fontWeight: '500',
  },
  hoursTime: {
    fontSize: 14,
  },
  faqCard: {
    padding: 20,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ContactScreen;
