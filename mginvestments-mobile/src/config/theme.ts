// MG Investments Mobile App Theme Configuration

export const theme = {
  colors: {
    // Primary Brand Colors
    primary: '#1E40AF',        // MG Investments Blue
    primaryLight: '#3B82F6',   // Lighter Blue
    primaryDark: '#1E3A8A',    // Darker Blue
    
    // Secondary Colors
    secondary: '#059669',      // Green for success/schools
    secondaryLight: '#10B981', // Light Green
    secondaryDark: '#047857',  // Dark Green
    
    // Accent Colors
    accent: '#7C3AED',         // Purple for admin
    accentLight: '#8B5CF6',    // Light Purple
    accentDark: '#6D28D9',     // Dark Purple
    
    // Status Colors
    success: '#10B981',        // Green
    warning: '#F59E0B',        // Amber
    error: '#EF4444',          // Red
    info: '#3B82F6',           // Blue
    
    // Neutral Colors
    white: '#FFFFFF',
    black: '#000000',
    
    // Gray Scale
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    
    // Background Colors
    background: '#F9FAFB',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // Text Colors
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    
    // Border Colors
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    borderDark: '#D1D5DB',
    
    // Role-specific Colors
    teacher: '#3B82F6',        // Blue for teachers
    school: '#059669',         // Green for schools
    admin: '#7C3AED',          // Purple for admin
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },
  
  // Component-specific styles
  components: {
    button: {
      height: 48,
      borderRadius: 8,
      paddingHorizontal: 24,
    },
    input: {
      height: 48,
      borderRadius: 8,
      paddingHorizontal: 16,
      borderWidth: 1,
    },
    card: {
      borderRadius: 12,
      padding: 16,
    },
  },
};

// Role-based theme variants
export const roleThemes = {
  teacher: {
    ...theme,
    colors: {
      ...theme.colors,
      primary: theme.colors.teacher,
      primaryLight: '#60A5FA',
      primaryDark: '#2563EB',
    },
  },
  school: {
    ...theme,
    colors: {
      ...theme.colors,
      primary: theme.colors.school,
      primaryLight: '#34D399',
      primaryDark: '#047857',
    },
  },
  admin: {
    ...theme,
    colors: {
      ...theme.colors,
      primary: theme.colors.admin,
      primaryLight: '#A78BFA',
      primaryDark: '#5B21B6',
    },
  },
};

export type Theme = typeof theme;
export type RoleTheme = keyof typeof roleThemes;
