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

export interface School {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  schoolType?: string;
  establishedYear?: number;
  studentCount?: number;
  teacherCount?: number;
  description?: string;
  website?: string;
  logo?: string;
  is_active: boolean;
  is_featured?: boolean;
  isActivelyHiring?: boolean;
  openJobsCount?: number;
  status: string;
}

interface SchoolCardProps {
  school: School;
  onPress?: (school: School) => void;
  variant?: 'default' | 'compact' | 'featured';
  showContactInfo?: boolean;
}

const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  onPress,
  variant = 'default',
  showContactInfo = false,
}) => {
  const { colors, typography, shadows, spacing } = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(school);
    }
  };

  const getSchoolTypeColor = (type?: string): string => {
    switch (type?.toLowerCase()) {
      case 'primary':
        return colors.info;
      case 'secondary':
        return colors.warning;
      case 'university':
        return colors.success;
      case 'college':
        return colors.school.primary;
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
        <View style={[styles.avatar, { backgroundColor: colors.school.soft }]}>
          {school.logo ? (
            <Image source={{ uri: school.logo }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="business" size={20} color={colors.school.primary} />
          )}
        </View>
        <View style={styles.compactInfo}>
          <Text style={[styles.compactName, { color: colors.textPrimary }]} numberOfLines={1}>
            {school.name}
          </Text>
          <Text style={[styles.compactType, { color: colors.school.primary }]} numberOfLines={1}>
            {school.schoolType || 'School'}
          </Text>
          <Text style={[styles.compactLocation, { color: colors.textSecondary }]} numberOfLines={1}>
            {school.location}
            {school.teacherCount && ` • ${school.teacherCount} teachers`}
          </Text>
        </View>
        {school.isActivelyHiring && (
          <View style={[styles.hiringBadge, { backgroundColor: colors.success }]}>
            <Ionicons name="briefcase" size={12} color={colors.white} />
          </View>
        )}
        {school.is_featured && (
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
        colors={[colors.school.primary, colors.school.light]}
        style={styles.featuredGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.featuredContent}>
          <View style={styles.featuredHeader}>
            <View style={[styles.featuredAvatar, { backgroundColor: colors.white }]}>
              {school.logo ? (
                <Image source={{ uri: school.logo }} style={styles.featuredAvatarImage} />
              ) : (
                <Ionicons name="business" size={24} color={colors.school.primary} />
              )}
            </View>
            <View style={styles.featuredBadgeContainer}>
              <View style={[styles.featuredLabel, { backgroundColor: colors.warning }]}>
                <Ionicons name="star" size={12} color={colors.white} />
                <Text style={[styles.featuredLabelText, { color: colors.white }]}>Featured</Text>
              </View>
            </View>
          </View>
          <Text style={[styles.featuredName, { color: colors.white }]} numberOfLines={2}>
            {school.name}
          </Text>
          <Text style={[styles.featuredType, { color: colors.white }]} numberOfLines={1}>
            {school.schoolType || 'Educational Institution'}
          </Text>
          <View style={styles.featuredStats}>
            <View style={styles.featuredStat}>
              <Ionicons name="location-outline" size={14} color={colors.white} />
              <Text style={[styles.featuredStatText, { color: colors.white }]}>
                {school.location}
              </Text>
            </View>
            {school.teacherCount && (
              <View style={styles.featuredStat}>
                <Ionicons name="people-outline" size={14} color={colors.white} />
                <Text style={[styles.featuredStatText, { color: colors.white }]}>
                  {school.teacherCount} teachers
                </Text>
              </View>
            )}
          </View>
          {school.isActivelyHiring && (
            <View style={[styles.hiringIndicator, { backgroundColor: colors.success }]}>
              <Ionicons name="briefcase" size={12} color={colors.white} />
              <Text style={[styles.hiringText, { color: colors.white }]}>
                Actively Hiring
              </Text>
            </View>
          )}
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
            <View style={[styles.defaultAvatar, { backgroundColor: colors.school.soft }]}>
              {school.logo ? (
                <Image source={{ uri: school.logo }} style={styles.defaultAvatarImage} />
              ) : (
                <Ionicons name="business" size={28} color={colors.school.primary} />
              )}
            </View>
            <View style={styles.defaultHeaderInfo}>
              <Text style={[styles.defaultName, { color: colors.textPrimary }]} numberOfLines={2}>
                {school.name}
              </Text>
              <Text style={[styles.defaultType, { color: colors.school.primary }]} numberOfLines={1}>
                {school.schoolType || 'Educational Institution'}
              </Text>
              <Text style={[styles.defaultLocation, { color: colors.textSecondary }]} numberOfLines={1}>
                {school.location}
              </Text>
            </View>
            <View style={styles.badgeContainer}>
              {school.is_featured && (
                <View style={[styles.defaultFeaturedBadge, { backgroundColor: colors.warning }]}>
                  <Ionicons name="star" size={14} color={colors.white} />
                </View>
              )}
            </View>
          </View>

          {/* Stats */}
          <View style={styles.defaultStats}>
            {school.establishedYear && (
              <View style={styles.defaultStat}>
                <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.defaultStatText, { color: colors.textSecondary }]}>
                  Est. {school.establishedYear}
                </Text>
              </View>
            )}
            {school.studentCount && (
              <View style={styles.defaultStat}>
                <Ionicons name="school-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.defaultStatText, { color: colors.textSecondary }]}>
                  {school.studentCount} students
                </Text>
              </View>
            )}
            {school.teacherCount && (
              <View style={styles.defaultStat}>
                <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.defaultStatText, { color: colors.textSecondary }]}>
                  {school.teacherCount} teachers
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          {school.description && (
            <Text style={[styles.defaultDescription, { color: colors.textSecondary }]} numberOfLines={3}>
              {school.description}
            </Text>
          )}

          {/* Hiring Status */}
          {school.isActivelyHiring && (
            <View style={styles.hiringSection}>
              <View style={[styles.hiringBanner, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="briefcase" size={16} color={colors.success} />
                <Text style={[styles.hiringBannerText, { color: colors.success }]}>
                  Actively Hiring
                </Text>
                {school.openJobsCount && (
                  <Text style={[styles.jobsCount, { color: colors.success }]}>
                    {school.openJobsCount} open positions
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Contact Info */}
          {showContactInfo && (
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                  {school.email}
                </Text>
              </View>
              {school.phone && (
                <View style={styles.contactItem}>
                  <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                    {school.phone}
                  </Text>
                </View>
              )}
              {school.website && (
                <View style={styles.contactItem}>
                  <Ionicons name="globe-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.contactText, { color: colors.textSecondary }]}>
                    {school.website}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Footer */}
          <View style={styles.defaultFooter}>
            <View style={styles.defaultFooterLeft}>
              {school.schoolType && (
                <View style={[styles.typeTag, { backgroundColor: getSchoolTypeColor(school.schoolType) + '20' }]}>
                  <Text style={[styles.typeTagText, { color: getSchoolTypeColor(school.schoolType) }]}>
                    {school.schoolType}
                  </Text>
                </View>
              )}
            </View>
            <View style={[styles.statusIndicator, { 
              backgroundColor: school.is_active ? colors.success : colors.error 
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
  compactType: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  compactLocation: {
    fontSize: 12,
  },
  hiringBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
  featuredType: {
    fontSize: 14,
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 12,
  },
  featuredStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
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
  hiringIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  hiringText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
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
  defaultType: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  defaultLocation: {
    fontSize: 12,
  },
  badgeContainer: {
    alignItems: 'flex-end',
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
  defaultDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  hiringSection: {
    marginBottom: 12,
  },
  hiringBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  hiringBannerText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  jobsCount: {
    fontSize: 12,
    fontWeight: '500',
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
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  typeTagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default SchoolCard;
