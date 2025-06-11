import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'default',
  size = 'medium',
  padding = 'medium',
  margin = 'medium',
  disabled = false,
}) => {
  const { colors, shadows, components } = useTheme();

  const getCardStyle = (): ViewStyle => {
    const baseStyle = {
      borderRadius: components.card.borderRadius,
      backgroundColor: colors.surface,
    };

    const variantStyle = {
      default: {
        backgroundColor: colors.surface,
        ...shadows.sm,
      },
      elevated: {
        backgroundColor: colors.surface,
        ...shadows.lg,
      },
      outlined: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      },
      filled: {
        backgroundColor: colors.gray50,
      },
    }[variant];

    const paddingStyle = {
      none: { padding: 0 },
      small: { padding: 8 },
      medium: { padding: components.card.padding },
      large: { padding: 24 },
    }[padding];

    const marginStyle = {
      none: { margin: 0 },
      small: { marginBottom: 8 },
      medium: { marginBottom: components.card.marginBottom },
      large: { marginBottom: 20 },
    }[margin];

    const disabledStyle = disabled ? {
      opacity: 0.6,
    } : {};

    return {
      ...baseStyle,
      ...variantStyle,
      ...paddingStyle,
      ...marginStyle,
      ...disabledStyle,
    };
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

export default Card;
