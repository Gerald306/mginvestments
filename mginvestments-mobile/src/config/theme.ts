// MG Investments Mobile App - Modern Theme Configuration
// Enhanced with latest design trends and mobile-first approach

import { Platform } from 'react-native';

export const theme = {
  colors: {
    // Primary Brand Colors - Modern Blue Palette
    primary: '#2563EB',        // Modern Blue (Blue-600)
    primaryLight: '#3B82F6',   // Blue-500
    primaryDark: '#1D4ED8',    // Blue-700
    primaryExtraLight: '#DBEAFE', // Blue-100
    primarySoft: '#EFF6FF',    // Blue-50

    // Secondary Colors - Enhanced Green Palette
    secondary: '#059669',      // Emerald-600
    secondaryLight: '#10B981', // Emerald-500
    secondaryDark: '#047857',  // Emerald-700
    secondaryExtraLight: '#D1FAE5', // Emerald-100
    secondarySoft: '#ECFDF5',  // Emerald-50

    // Accent Colors - Modern Purple Palette
    accent: '#7C3AED',         // Violet-600
    accentLight: '#8B5CF6',    // Violet-500
    accentDark: '#6D28D9',     // Violet-700
    accentExtraLight: '#E0E7FF', // Violet-100
    accentSoft: '#F5F3FF',     // Violet-50

    // Status Colors - Enhanced with soft variants
    success: '#059669',        // Emerald-600
    successLight: '#10B981',   // Emerald-500
    successSoft: '#ECFDF5',    // Emerald-50

    warning: '#D97706',        // Amber-600
    warningLight: '#F59E0B',   // Amber-500
    warningSoft: '#FFFBEB',    // Amber-50

    error: '#DC2626',          // Red-600
    errorLight: '#EF4444',     // Red-500
    errorSoft: '#FEF2F2',      // Red-50

    info: '#2563EB',           // Blue-600
    infoLight: '#3B82F6',      // Blue-500
    infoSoft: '#EFF6FF',       // Blue-50

    // Neutral Colors
    white: '#FFFFFF',
    black: '#000000',

    // Enhanced Gray Scale - More nuanced
    gray25: '#FCFCFD',
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
    gray950: '#030712',

    // Modern Background System
    background: '#FAFAFA',     // Slightly warmer than pure gray
    backgroundSecondary: '#F5F5F7', // iOS-inspired
    surface: '#FFFFFF',
    surfaceSecondary: '#FAFAFA',
    card: '#FFFFFF',
    cardSecondary: '#F8FAFC',

    // Enhanced Text Colors
    textPrimary: '#111827',    // Gray-900
    textSecondary: '#4B5563',  // Gray-600
    textTertiary: '#9CA3AF',   // Gray-400
    textQuaternary: '#D1D5DB', // Gray-300
    textInverse: '#FFFFFF',
    textOnPrimary: '#FFFFFF',
    textOnSecondary: '#FFFFFF',
    textOnAccent: '#FFFFFF',

    // Modern Border System
    border: '#E5E7EB',         // Gray-200
    borderLight: '#F3F4F6',    // Gray-100
    borderDark: '#D1D5DB',     // Gray-300
    borderFocus: '#3B82F6',    // Blue-500
    borderError: '#EF4444',    // Red-500
    borderSuccess: '#10B981',  // Emerald-500

    // Role-specific Colors - Enhanced
    teacher: {
      primary: '#2563EB',      // Blue-600
      light: '#3B82F6',        // Blue-500
      dark: '#1D4ED8',         // Blue-700
      soft: '#EFF6FF',         // Blue-50
      accent: '#DBEAFE',       // Blue-100
    },
    school: {
      primary: '#059669',      // Emerald-600
      light: '#10B981',        // Emerald-500
      dark: '#047857',         // Emerald-700
      soft: '#ECFDF5',         // Emerald-50
      accent: '#D1FAE5',       // Emerald-100
    },
    admin: {
      primary: '#7C3AED',      // Violet-600
      light: '#8B5CF6',        // Violet-500
      dark: '#6D28D9',         // Violet-700
      soft: '#F5F3FF',         // Violet-50
      accent: '#E0E7FF',       // Violet-100
    },

    // Modern Overlay System
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.25)',
    overlayDark: 'rgba(0, 0, 0, 0.75)',
    backdrop: 'rgba(17, 24, 39, 0.8)', // Gray-900 with opacity
  },

  // Modern Spacing System - 8pt grid system
  spacing: {
    px: 1,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
    // Semantic spacing
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  // Enhanced Border Radius System
  borderRadius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },

  // Modern Typography System
  typography: {
    // Font Families - Platform optimized
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
      display: 'System',
      mono: 'monospace',
    },

    // Enhanced Font Sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 36,
      '6xl': 42,
      '7xl': 48,
      '8xl': 56,
      '9xl': 64,
    },

    // Line Heights
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },

    // Enhanced Font Weights
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },

    // Letter Spacing
    letterSpacing: {
      tighter: -0.05,
      tight: -0.025,
      normal: 0,
      wide: 0.025,
      wider: 0.05,
      widest: 0.1,
    },
  },
  
  // Enhanced Shadow System - Modern depth
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
      elevation: 1,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 20 },
      shadowOpacity: 0.25,
      shadowRadius: 25,
      elevation: 12,
    },
    '2xl': {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 25 },
      shadowOpacity: 0.25,
      shadowRadius: 50,
      elevation: 16,
    },
  },
  
  // Modern Component System - Enhanced with variants
  components: {
    // Button System
    button: {
      primary: {
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 24,
        fontSize: 16,
        fontWeight: '600',
        minWidth: 120,
      },
      secondary: {
        height: 44,
        borderRadius: 10,
        paddingHorizontal: 20,
        borderWidth: 1.5,
        fontSize: 16,
        fontWeight: '500',
      },
      small: {
        height: 36,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 14,
        fontWeight: '500',
      },
      large: {
        height: 56,
        borderRadius: 14,
        paddingHorizontal: 32,
        fontSize: 18,
        fontWeight: '600',
      },
      icon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        padding: 0,
      },
      fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        padding: 0,
      },
    },

    // Input System
    input: {
      default: {
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1.5,
        fontSize: 16,
      },
      small: {
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 12,
        borderWidth: 1,
        fontSize: 14,
      },
      large: {
        height: 56,
        borderRadius: 14,
        paddingHorizontal: 20,
        borderWidth: 1.5,
        fontSize: 18,
      },
      textarea: {
        minHeight: 96,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1.5,
        fontSize: 16,
      },
    },

    // Card System
    card: {
      default: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
      },
      small: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
      },
      large: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
      },
      compact: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
      },
    },

    // Header System
    header: {
      default: {
        height: 56,
        paddingHorizontal: 20,
        elevation: 0,
        borderBottomWidth: 0,
      },
      elevated: {
        height: 56,
        paddingHorizontal: 20,
        elevation: 4,
        borderBottomWidth: 0,
      },
      large: {
        height: 96,
        paddingHorizontal: 20,
        elevation: 0,
      },
    },

    // Tab Bar System
    tabBar: {
      default: {
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
        borderTopWidth: 0,
        elevation: 8,
      },
      compact: {
        height: 50,
        paddingBottom: 4,
        paddingTop: 4,
      },
    },

    // Badge System
    badge: {
      small: {
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        paddingHorizontal: 4,
      },
      default: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        paddingHorizontal: 6,
      },
      large: {
        minWidth: 24,
        height: 24,
        borderRadius: 12,
        paddingHorizontal: 8,
      },
    },
  },

  // Animation durations
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  // Layout constants
  layout: {
    headerHeight: 56,
    tabBarHeight: 60,
    statusBarHeight: 24,
    screenPadding: 16,
    sectionSpacing: 24,
  },
};

// Enhanced Role-based theme variants with modern design
export const roleThemes = {
  teacher: {
    ...theme,
    colors: {
      ...theme.colors,
      primary: theme.colors.teacher.primary,
      primaryLight: theme.colors.teacher.light,
      primaryDark: theme.colors.teacher.dark,
      primarySoft: theme.colors.teacher.soft,
      primaryAccent: theme.colors.teacher.accent,
    },
  },
  school: {
    ...theme,
    colors: {
      ...theme.colors,
      primary: theme.colors.school.primary,
      primaryLight: theme.colors.school.light,
      primaryDark: theme.colors.school.dark,
      primarySoft: theme.colors.school.soft,
      primaryAccent: theme.colors.school.accent,
    },
  },
  admin: {
    ...theme,
    colors: {
      ...theme.colors,
      primary: theme.colors.admin.primary,
      primaryLight: theme.colors.admin.light,
      primaryDark: theme.colors.admin.dark,
      primarySoft: theme.colors.admin.soft,
      primaryAccent: theme.colors.admin.accent,
    },
  },
};

// Modern Design Tokens
export const designTokens = {
  // Spacing scale based on 4px grid
  space: theme.spacing,

  // Color palette
  colors: theme.colors,

  // Typography scale
  text: theme.typography,

  // Border radius scale
  radii: theme.borderRadius,

  // Shadow scale
  shadows: theme.shadows,

  // Component tokens
  components: theme.components,

  // Animation tokens
  transitions: {
    fast: '150ms ease-out',
    normal: '300ms ease-out',
    slow: '500ms ease-out',
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
};

export type Theme = typeof theme;
export type RoleTheme = keyof typeof roleThemes;
