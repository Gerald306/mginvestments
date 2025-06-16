import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import Card from './Card';

const { width } = Dimensions.get('window');

export interface Teacher {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  subject_specialization: string;
  experience_years: number;
  education_level: string;
  teaching_levels?: string[];
  languages?: string[];
  availability?: string;
  location: string;
  is_active: boolean;
  is_featured?: boolean;
  profile_picture?: string;
  bio?: string;
  views_count?: number;
  status: string;
}

interface TeacherCardProps {
  teacher: Teacher;
  onPress?: (teacher: Teacher) => void;
  variant?: 'default' | 'compact' | 'featured';
  showContactInfo?: boolean;
}

const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  onPress,
  variant = 'default',
  showContactInfo = false,
}) => {
  const { colors, typography, shadows, spacing } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(teacher);
    }
  };

  const getExperienceText = (years: number): string => {
    if (years === 0) return 'New Teacher';
    if (years === 1) return '1 Year';
    return `${years} Years`;
  };

  const getAvailabilityColor = (availability?: string): string => {
    switch (availability?.toLowerCase()) {
      case 'full-time':
        return colors.success;
      case 'part-time':
        return colors.warning;
      case 'contract':
        return colors.info;
      default:
        return colors.textSecondary;
    }
  };

  const renderCompactCard = () => (
    <TouchableOpacity
      style={[styles.compactCard, { backgroundColor: colors.surface }, shadows.sm]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.compactContent}>
        <View style={[styles.avatar, { backgroundColor: colors.teacher.soft }]}>
          {teacher.profile_picture ? (
            <Image source={{ uri: teacher.profile_picture }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={20} color={colors.teacher.primary} />
          )}
        </View>
        <View style={styles.compactInfo}>
          <Text style={[styles.compactName, { color: colors.textPrimary }]} numberOfLines={1}>
            {teacher.full_name}
          </Text>
          <Text style={[styles.compactSubject, { color: colors.teacher.primary }]} numberOfLines={1}>
            {teacher.subject_specialization}
          </Text>
          <Text style={[styles.compactExperience, { color: colors.textSecondary }]} numberOfLines={1}>
            {getExperienceText(teacher.experience_years)} • {teacher.location}
          </Text>
        </View>
        {teacher.is_featured && (
          <View style={[styles.featuredBadge, { backgroundColor: colors.warning }]}>
            <Ionicons name="star" size={12} color={colors.white} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedCard = () => (
    <TouchableOpacity
      style={[styles.featuredCard, shadows.lg]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[colors.teacher.primary, colors.teacher.light]}
        style={styles.featuredGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.featuredContent}>
          <View style={styles.featuredHeader}>
            <View style={[styles.featuredAvatar, { backgroundColor: colors.white }]}>
              {teacher.profile_picture ? (
                <Image source={{ uri: teacher.profile_picture }} style={styles.featuredAvatarImage} />
              ) : (
                <Ionicons name="person" size={24} color={colors.teacher.primary} />
              )}
            </View>
            <View style={styles.featuredBadgeContainer}>
              <View style={[styles.featuredLabel, { backgroundColor: colors.warning }]}>
                <Ionicons name="star" size={12} color={colors.white} />
                <Text style={[styles.featuredLabelText, { color: colors.white }]}>Featured</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.featuredName, { color: colors.white }]} numberOfLines={1}>
            {teacher.full_name}
          </Text>
          <Text style={[styles.featuredSubject, { color: colors.white }]} numberOfLines={1}>
            {teacher.subject_specialization}
          </Text>
          <View style={styles.featuredStats}>
            <View style={styles.featuredStat}>
              <Ionicons name="time-outline" size={14} color={colors.white} />
              <Text style={[styles.featuredStatText, { color: colors.white }]}>
                {getExperienceText(teacher.experience_years)}
              </Text>
            </View>
            <View style={styles.featuredStat}>
              <Ionicons name="location-outline" size={14} color={colors.white} />
              <Text style={[styles.featuredStatText, { color: colors.white }]}>
                {teacher.location}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderDefaultCard = () => (
    <Card style={[styles.defaultCard, shadows.md]}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <View style={styles.defaultContent}>
          {/* Header */}
          <View style={styles.defaultHeader}>
            <View style={[styles.defaultAvatar, { backgroundColor: colors.teacher.soft }]}>
              {teacher.profile_picture ? (
                <Image source={{ uri: teacher.profile_picture }} style={styles.defaultAvatarImage} />
              ) : (
                <Ionicons name="person" size={28} color={colors.teacher.primary} />
              )}
            </View>
            <View style={styles.defaultHeaderInfo}>
              <Text style={[styles.defaultName, { color: colors.textPrimary }]} numberOfLines={1}>
                {teacher.full_name}
              </Text>
              <Text style={[styles.defaultSubject, { color: colors.teacher.primary }]} numberOfLines={1}>
                {teacher.subject_specialization}
              </Text>
              <Text style={[styles.defaultEducation, { color: colors.textSecondary }]} numberOfLines={1}>
                {teacher.education_level}
              </Text>
            </View>
            {teacher.is_featured && (
              <View style={[styles.defaultFeaturedBadge, { backgroundColor: colors.warning }]}>
                <Ionicons name="star" size={14} color={colors.white} />
              </View>
            )}
          </View>

          {/* Stats */}
          <View style={styles.defaultStats}>
            <View style={styles.defaultStat}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.defaultStatText, { color: colors.textSecondary }]}>
                {getExperienceText(teacher.experience_years)}
              </Text>
            </View>
            <View style={styles.defaultStat}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.defaultStatText, { color: colors.textSecondary }]}>
                {teacher.location}
              </Text>
            </View>
            {teacher.availability && (
              <View style={styles.defaultStat}>
                <Ionicons name="calendar-outline" size={16} color={getAvailabilityColor(teacher.availability)} />
                <Text style={[styles.defaultStatText, { color: getAvailabilityColor(teacher.availability) }]}>
                  {teacher.availability}
                </Text>
              </View>
            )}
          </View>

          {/* Bio */}
          {teacher.bio && (
            <Text style={[styles.defaultBio, { color: colors.textSecondary }]} numberOfLines={2}>
              {teacher.bio}
            </Text>
          )}

          {/* Teaching Levels */}
          {teacher.teaching_levels && teacher.teaching_levels.length > 0 && (
            <View style={styles.defaultLevels}>
              {teacher.teaching_levels.slice(0, 3).map((level, index) => (
                <View key={index} style={[styles.levelTag, { backgroundColor: colors.teacher.soft }]}>
                  <Text style={[styles.levelTagText, { color: colors.teacher.primary }]}>
                    {level}
                  </Text>
                </View>
              ))}
              {teacher.teaching_levels.length > 3 && (
                <Text style={[styles.moreLevels, { color: colors.textTertiary }]}>
                  +{teacher.teaching_levels.length - 3} more
                </Text>
              )}
            </View>
          )}

          {/* Contact Info */}
          {showContactInfo && (
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                  {teacher.email}
                </Text>
              </View>
              {teacher.phone && (
                <View style={styles.contactItem}>
                  <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                    {teacher.phone}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Footer */}
          <View style={styles.defaultFooter}>
            <View style={styles.defaultFooterLeft}>
              {teacher.views_count !== undefined && (
                <View style={styles.viewsContainer}>
                  <Ionicons name="eye-outline" size={14} color={colors.textTertiary} />
                  <Text style={[styles.viewsText, { color: colors.textTertiary }]}>
                    {teacher.views_count} views
                  </Text>
                </View>
              )}
            </View>
            <View style={[styles.statusIndicator, { 
              backgroundColor: teacher.is_active ? colors.success : colors.error 
            }]} />
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  switch (variant) {
    case 'compact':
      return renderCompactCard();
    case 'featured':
      return renderFeaturedCard();
    default:
      return renderDefaultCard();
  }
};

const styles = StyleSheet.create({
  // Compact Card Styles
  compactCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  compactInfo: {
    flex: 1,
  },
  compactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  compactSubject: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  compactExperience: {
    fontSize: 12,
  },
  featuredBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Featured Card Styles
  featuredCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  featuredGradient: {
    padding: 16,
  },
  featuredContent: {
    alignItems: 'center',
  },
  featuredHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featuredAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredAvatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  featuredBadgeContainer: {
    alignItems: 'flex-end',
  },
  featuredLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredLabelText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  featuredSubject: {
    fontSize: 14,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 12,
  },
  featuredStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  featuredStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredStatText: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.9,
  },

  // Default Card Styles
  defaultCard: {
    marginBottom: 16,
  },
  defaultContent: {
    padding: 16,
  },
  defaultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  defaultAvatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  defaultHeaderInfo: {
    flex: 1,
  },
  defaultName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  defaultSubject: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  defaultEducation: {
    fontSize: 12,
  },
  defaultFeaturedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  defaultStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultStatText: {
    fontSize: 12,
    marginLeft: 4,
  },
  defaultBio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  defaultLevels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  levelTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelTagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  moreLevels: {
    fontSize: 10,
  },
  contactInfo: {
    gap: 6,
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 12,
    marginLeft: 6,
  },
  defaultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  defaultFooterLeft: {
    flex: 1,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    fontSize: 10,
    marginLeft: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default TeacherCard;
