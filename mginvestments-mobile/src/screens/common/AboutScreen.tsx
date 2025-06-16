import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, Button } from '../../components';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
  image?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const AboutScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, typography, shadows, spacing } = useTheme();

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Management Team',
      position: 'Leadership & Strategy',
      description: 'Experienced professionals dedicated to transforming education in Uganda through innovative solutions and quality services.',
    },
    {
      id: '2',
      name: 'Education Specialists',
      position: 'Teacher Placement & Support',
      description: 'Expert team focused on connecting qualified teachers with the right schools and providing ongoing professional support.',
    },
    {
      id: '3',
      name: 'Creative Department',
      position: 'Design & Production',
      description: 'Talented designers and production specialists delivering high-quality printing, design, and embroidery services.',
    },
  ];

  const achievements: Achievement[] = [
    {
      id: '1',
      title: '10+ Years Experience',
      description: 'Over a decade of serving the education sector in Uganda',
      icon: 'calendar-outline',
      color: colors.primary,
    },
    {
      id: '2',
      title: '500+ Teachers Placed',
      description: 'Successfully connected hundreds of qualified teachers with schools',
      icon: 'people-outline',
      color: colors.teacher.primary,
    },
    {
      id: '3',
      title: '100+ Partner Schools',
      description: 'Building strong relationships with educational institutions',
      icon: 'business-outline',
      color: colors.school.primary,
    },
    {
      id: '4',
      title: '1000+ Projects Completed',
      description: 'Delivered quality printing, design, and embroidery services',
      icon: 'checkmark-circle-outline',
      color: colors.success,
    },
  ];

  const values = [
    {
      title: 'Quality Excellence',
      description: 'We maintain the highest standards in all our services and solutions.',
      icon: 'star-outline',
    },
    {
      title: 'Educational Impact',
      description: 'Every service we provide aims to enhance educational outcomes.',
      icon: 'school-outline',
    },
    {
      title: 'Innovation',
      description: 'We embrace technology and creative solutions to solve challenges.',
      icon: 'bulb-outline',
    },
    {
      title: 'Integrity',
      description: 'We operate with transparency, honesty, and ethical practices.',
      icon: 'shield-checkmark-outline',
    },
  ];

  const renderTeamMember = (member: TeamMember) => (
    <Card key={member.id} style={[styles.teamCard, shadows.md]}>
      <View style={styles.teamHeader}>
        <View style={[styles.teamAvatar, { backgroundColor: colors.primary + '20' }]}>
          {member.image ? (
            <Image source={{ uri: member.image }} style={styles.teamImage} />
          ) : (
            <Ionicons name="people" size={32} color={colors.primary} />
          )}
        </View>
        <View style={styles.teamInfo}>
          <Text style={[styles.teamName, { color: colors.textPrimary }]}>
            {member.name}
          </Text>
          <Text style={[styles.teamPosition, { color: colors.primary }]}>
            {member.position}
          </Text>
        </View>
      </View>
      <Text style={[styles.teamDescription, { color: colors.textSecondary }]}>
        {member.description}
      </Text>
    </Card>
  );

  const renderAchievement = (achievement: Achievement) => (
    <View key={achievement.id} style={[styles.achievementCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '20' }]}>
        <Ionicons name={achievement.icon} size={24} color={achievement.color} />
      </View>
      <Text style={[styles.achievementTitle, { color: colors.textPrimary }]}>
        {achievement.title}
      </Text>
      <Text style={[styles.achievementDescription, { color: colors.textSecondary }]}>
        {achievement.description}
      </Text>
    </View>
  );

  const renderValue = (value: typeof values[0], index: number) => (
    <View key={index} style={styles.valueItem}>
      <View style={[styles.valueIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={value.icon as any} size={20} color={colors.primary} />
      </View>
      <View style={styles.valueContent}>
        <Text style={[styles.valueTitle, { color: colors.textPrimary }]}>
          {value.title}
        </Text>
        <Text style={[styles.valueDescription, { color: colors.textSecondary }]}>
          {value.description}
        </Text>
      </View>
    </View>
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
              About Us
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.white }]}>
              Empowering education through innovation
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mission Statement */}
        <Card style={[styles.missionCard, shadows.lg]}>
          <View style={styles.missionHeader}>
            <View style={[styles.missionIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="rocket-outline" size={32} color={colors.primary} />
            </View>
            <Text style={[styles.missionTitle, { color: colors.textPrimary }]}>
              Our Mission
            </Text>
          </View>
          <Text style={[styles.missionText, { color: colors.textSecondary }]}>
            MG Investments is dedicated to transforming education in Uganda by providing comprehensive 
            educational services including professional printing, creative design, quality embroidery, 
            and connecting qualified teachers with leading schools. We believe in empowering education 
            through innovation, quality, and excellence.
          </Text>
        </Card>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Our Achievements
          </Text>
          <View style={styles.achievementsGrid}>
            {achievements.map(renderAchievement)}
          </View>
        </View>

        {/* Our Story */}
        <Card style={[styles.storyCard, shadows.md]}>
          <Text style={[styles.storyTitle, { color: colors.textPrimary }]}>
            Our Story
          </Text>
          <Text style={[styles.storyText, { color: colors.textSecondary }]}>
            Founded with a vision to revolutionize education in Uganda, MG Investments began as a 
            small printing business serving local schools. Over the years, we have expanded our 
            services to include creative design, embroidery, and most importantly, teacher placement 
            services.
          </Text>
          <Text style={[styles.storyText, { color: colors.textSecondary }]}>
            Today, we are proud to be a trusted partner for hundreds of schools and teachers across 
            Uganda, providing quality services that enhance educational outcomes and create meaningful 
            connections in the education sector.
          </Text>
        </Card>

        {/* Our Values */}
        <Card style={[styles.valuesCard, shadows.md]}>
          <Text style={[styles.valuesTitle, { color: colors.textPrimary }]}>
            Our Values
          </Text>
          <View style={styles.valuesList}>
            {values.map(renderValue)}
          </View>
        </Card>

        {/* Team Section */}
        <View style={styles.teamSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Our Team
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Meet the dedicated professionals behind our success
          </Text>
          {teamMembers.map(renderTeamMember)}
        </View>

        {/* Contact CTA */}
        <Card style={[styles.ctaCard, shadows.lg]}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.ctaContent}>
              <Ionicons name="handshake-outline" size={48} color={colors.white} />
              <Text style={[styles.ctaTitle, { color: colors.white }]}>
                Ready to Work Together?
              </Text>
              <Text style={[styles.ctaDescription, { color: colors.white }]}>
                Let's discuss how we can help transform your educational needs
              </Text>
              <Button
                title="Contact Us Today"
                onPress={() => navigation.navigate('Contact' as never)}
                variant="secondary"
                size="large"
                icon="mail-outline"
                style={styles.ctaButton}
              />
            </View>
          </LinearGradient>
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
  missionCard: {
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  missionHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  missionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  missionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  achievementsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  storyCard: {
    padding: 20,
    marginBottom: 24,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  storyText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  valuesCard: {
    padding: 20,
    marginBottom: 24,
  },
  valuesTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  valuesList: {
    gap: 16,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  valueIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  teamSection: {
    marginBottom: 24,
  },
  teamCard: {
    padding: 16,
    marginBottom: 16,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  teamImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  teamPosition: {
    fontSize: 14,
    fontWeight: '500',
  },
  teamDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  ctaCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  ctaGradient: {
    padding: 24,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  ctaButton: {
    minWidth: 200,
  },
});

export default AboutScreen;
