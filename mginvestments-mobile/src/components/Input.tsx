import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'filled' | 'outlined';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  size = 'medium',
  variant = 'outlined',
  secureTextEntry,
  ...textInputProps
}) => {
  const { colors, components } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = secureTextEntry;
  const showPassword = isPassword && !isPasswordVisible;

  const getContainerStyle = (): ViewStyle => {
    const baseStyle = {
      marginBottom: 16,
    };

    return {
      ...baseStyle,
    };
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle = {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      borderRadius: components.input.borderRadius,
    };

    const sizeStyle = {
      small: {
        height: components.inputSmall.height,
        paddingHorizontal: components.inputSmall.paddingHorizontal,
      },
      medium: {
        height: components.input.height,
        paddingHorizontal: components.input.paddingHorizontal,
      },
      large: {
        height: 52,
        paddingHorizontal: 20,
      },
    }[size];

    const variantStyle = {
      default: {
        backgroundColor: colors.gray100,
        borderWidth: 0,
      },
      filled: {
        backgroundColor: colors.gray50,
        borderWidth: 1,
        borderColor: colors.gray200,
      },
      outlined: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: isFocused ? colors.primary : colors.gray300,
      },
    }[variant];

    const errorStyle = error ? {
      borderColor: colors.error,
      borderWidth: 1,
    } : {};

    return {
      ...baseStyle,
      ...sizeStyle,
      ...variantStyle,
      ...errorStyle,
    };
  };

  const getInputStyle = (): ViewStyle => {
    const baseStyle = {
      flex: 1,
      fontSize: size === 'small' ? 14 : 16,
      color: colors.textPrimary,
      paddingVertical: 0,
    };

    return baseStyle;
  };

  const getIconSize = () => {
    return {
      small: 16,
      medium: 20,
      large: 24,
    }[size];
  };

  const handlePasswordToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderLeftIcon = () => {
    if (!leftIcon) return null;

    return (
      <Ionicons
        name={leftIcon}
        size={getIconSize()}
        color={isFocused ? colors.primary : colors.gray400}
        style={{ marginRight: 12 }}
      />
    );
  };

  const renderRightIcon = () => {
    if (isPassword) {
      return (
        <TouchableOpacity onPress={handlePasswordToggle}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={getIconSize()}
            color={colors.gray400}
          />
        </TouchableOpacity>
      );
    }

    if (!rightIcon) return null;

    return (
      <TouchableOpacity onPress={onRightIconPress}>
        <Ionicons
          name={rightIcon}
          size={getIconSize()}
          color={isFocused ? colors.primary : colors.gray400}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[getContainerStyle(), containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {renderLeftIcon()}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          secureTextEntry={showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.gray400}
          {...textInputProps}
        />
        
        {renderRightIcon()}
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
