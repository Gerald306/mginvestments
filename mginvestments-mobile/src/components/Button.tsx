import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'danger';
  size?: 'small' | 'medium' | 'large' | 'icon' | 'fab';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  haptic?: boolean;
  children?: React.ReactNode;
  gradient?: string[];
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  iconOnly = false,
  style,
  textStyle,
  fullWidth = false,
  haptic = true,
  children,
  gradient,
}) => {
  const { colors, components, shadows } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      ...(fullWidth && { width: '100%' }),
    };

    const sizeStyle = {
      small: components.button.small,
      medium: components.button.primary,
      large: components.button.large,
      icon: components.button.icon,
      fab: components.button.fab,
    }[size] || components.button.primary;

    const variantStyle = {
      primary: {
        backgroundColor: colors.primary,
      },
      secondary: {
        backgroundColor: colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      gradient: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: colors.error,
      },
    }[variant] || {
      backgroundColor: colors.primary,
    };

    const disabledStyle = disabled || loading ? {
      backgroundColor: colors.gray300,
      borderColor: colors.gray300,
    } : {};

    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
      ...disabledStyle,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle = {
      fontWeight: '600' as const,
      textAlign: 'center' as const,
    };

    const sizeStyle = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    }[size];

    const variantStyle = {
      primary: { color: colors.white },
      secondary: { color: colors.white },
      outline: { color: colors.primary },
      ghost: { color: colors.primary },
      gradient: { color: colors.white },
      danger: { color: colors.white },
    }[variant] || { color: colors.white };

    const disabledStyle = disabled || loading ? {
      color: colors.gray500,
    } : {};

    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
      ...disabledStyle,
    };
  };

  const getIconSize = () => {
    return {
      small: 16,
      medium: 20,
      large: 24,
    }[size];
  };

  const getIconColor = () => {
    if (disabled || loading) return colors.gray500;
    
    return {
      primary: colors.white,
      secondary: colors.white,
      outline: colors.primary,
      ghost: colors.primary,
      gradient: colors.white,
      danger: colors.white,
    }[variant] || colors.white;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={getIconColor()} 
        />
      );
    }

    const iconElement = icon ? (
      <Ionicons
        name={icon}
        size={getIconSize()}
        color={getIconColor()}
        style={iconPosition === 'left' ? { marginRight: 8 } : { marginLeft: 8 }}
      />
    ) : null;

    return (
      <>
        {iconPosition === 'left' && iconElement}
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
        {iconPosition === 'right' && iconElement}
      </>
    );
  };

  if (variant === 'gradient' && gradient) {
    return (
      <LinearGradient
        colors={gradient}
        style={[getButtonStyle(), style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity
          style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }]}
          onPress={onPress}
          disabled={disabled || loading}
          activeOpacity={0.7}
        >
          {renderContent()}
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
