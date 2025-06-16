import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import Button from './Button';

const { width, height } = Dimensions.get('window');

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  backgroundImage?: string;
  showStats?: boolean;
  stats?: {
    teachers: number;
    schools: number;
    applications: number;
    placements: number;
  };
  variant?: 'default' | 'compact' | 'minimal';
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'Empowering Education Through Innovation',
  subtitle = '🎓 Welcome to MG Education Services',
  description = 'MG Investments provides comprehensive educational services including professional printing, creative design, quality embroidery, and connects qualified teachers with leading schools across Uganda.',
  primaryButtonText = 'Find Teachers',
  secondaryButtonText = 'Browse Schools',
  onPrimaryPress,
  onSecondaryPress,
  backgroundImage,
  showStats = true,
  stats = {
    teachers: 150,
    schools: 45,
    applications: 320,
    placements: 89,
  },
  variant = 'default',
}) => {
  const { colors, typography, shadows, spacing } = useTheme();

  const renderStats = () => {
    if (!showStats || variant === 'minimal') return null;

    const statItems = [
      { label: 'Teachers', value: stats.teachers, icon: 'people-outline' },
      { label: 'Schools', value: stats.schools, icon: 'business-outline' },
      { label: 'Applications', value: stats.applications, icon: 'document-text-outline' },
      { label: 'Placements', value: stats.placements, icon: 'checkmark-circle-outline' },
    ];

    return (
      <View style={styles.statsContainer}>
        {statItems.map((stat, index) => (
          <View key={index} style={[styles.statItem, { backgroundColor: colors.white + '20' }]}>
            <Ionicons name={stat.icon as any} size={20} color={colors.white} />
            <Text style={[styles.statValue, { color: colors.white }]}>
              {stat.value}+
            </Text>
            <Text style={[styles.statLabel, { color: colors.white }]}>
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderContent = () => (
    <View style={styles.content}>
      {/* Badge */}
      <View style={[styles.badge, { backgroundColor: colors.white + '20' }]}>
        <Text style={[styles.badgeText, { color: colors.white }]}>
          {subtitle}
        </Text>
      </View>

      {/* Title */}
      <Text style={[styles.title, { color: colors.white }]}>
        {title}
      </Text>

      {/* Description */}
      {variant !== 'minimal' && (
        <Text style={[styles.description, { color: colors.white }]}>
          {description}
        </Text>
      )}

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {onPrimaryPress && (
          <Button
            title={primaryButtonText}
            onPress={onPrimaryPress}
            variant="primary"
            size="large"
            icon="search-outline"
            style={[styles.primaryButton, { backgroundColor: colors.white }]}
            textStyle={{ color: colors.primary }}
          />
        )}
        {onSecondaryPress && variant !== 'compact' && (
          <Button
            title={secondaryButtonText}
            onPress={onSecondaryPress}
            variant="outline"
            size="large"
            icon="business-outline"
            style={[styles.secondaryButton, { borderColor: colors.white }]}
            textStyle={{ color: colors.white }}
          />
        )}
      </View>

      {/* Stats */}
      {renderStats()}
    </View>
  );

  const getHeroHeight = () => {
    switch (variant) {
      case 'compact':
        return height * 0.4;
      case 'minimal':
        return height * 0.3;
      default:
        return height * 0.6;
    }
  };

  if (backgroundImage) {
    return (
      <ImageBackground
        source={{ uri: backgroundImage }}
        style={[styles.container, { height: getHeroHeight() }]}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)']}
          style={styles.overlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {renderContent()}
        </LinearGradient>
      </ImageBackground>
    );
  }

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={[styles.container, { height: getHeroHeight() }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {renderContent()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    opacity: 0.9,
    maxWidth: width * 0.9,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
    width: '100%',
  },
  primaryButton: {
    minWidth: width * 0.7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    minWidth: width * 0.7,
    backgroundColor: 'transparent',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400,
    gap: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.9,
    textAlign: 'center',
  },
});

export default HeroSection;
