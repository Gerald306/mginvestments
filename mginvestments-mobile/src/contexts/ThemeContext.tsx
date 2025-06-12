import React, { createContext, useContext, ReactNode } from 'react';
import { theme, Theme } from '../config/theme';

interface ThemeContextType {
  theme: Theme;
  colors: Theme['colors'];
  spacing: Theme['spacing'];
  borderRadius: Theme['borderRadius'];
  fontSize: Theme['fontSize'];
  fontWeight: Theme['fontWeight'];
  shadows: Theme['shadows'];
  components: Theme['components'];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Use default theme for now (no auth dependency)
  const currentTheme = theme;

  const value: ThemeContextType = {
    theme: currentTheme,
    colors: currentTheme.colors,
    spacing: currentTheme.spacing,
    borderRadius: currentTheme.borderRadius,
    fontSize: currentTheme.fontSize,
    fontWeight: currentTheme.fontWeight,
    shadows: currentTheme.shadows,
    components: currentTheme.components,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
