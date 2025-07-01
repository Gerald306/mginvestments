import React from 'react';
import { responsive } from '@/utils/responsive';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'narrow' | 'wide' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md'
}) => {
  const getContainerClasses = () => {
    switch (variant) {
      case 'narrow':
        return responsive.container.narrow;
      case 'wide':
        return responsive.container.wide;
      case 'full':
        return responsive.container.full;
      default:
        return responsive.container.responsive;
    }
  };

  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return responsive.spacing.padding.sm;
      case 'md':
        return responsive.spacing.padding.md;
      case 'lg':
        return responsive.spacing.padding.lg;
      case 'xl':
        return responsive.spacing.padding.xl;
      default:
        return responsive.spacing.padding.md;
    }
  };

  return (
    <div className={`${getContainerClasses()} ${getPaddingClasses()} ${className}`}>
      {children}
    </div>
  );
};

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = 3,
  gap = 'md',
  className = ''
}) => {
  const getGridClasses = () => {
    switch (cols) {
      case 1:
        return responsive.grid.cols1;
      case 2:
        return responsive.grid.cols2;
      case 3:
        return responsive.grid.cols3;
      case 4:
        return responsive.grid.cols4;
      case 5:
        return responsive.grid.cols5;
      case 6:
        return responsive.grid.cols6;
      default:
        return responsive.grid.cols3;
    }
  };

  const getGapClasses = () => {
    switch (gap) {
      case 'xs':
        return responsive.spacing.gap.xs;
      case 'sm':
        return responsive.spacing.gap.sm;
      case 'md':
        return responsive.spacing.gap.md;
      case 'lg':
        return responsive.spacing.gap.lg;
      case 'xl':
        return responsive.spacing.gap.xl;
      default:
        return responsive.spacing.gap.md;
    }
  };

  return (
    <div className={`grid ${getGridClasses()} ${getGapClasses()} ${className}`}>
      {children}
    </div>
  );
};

// Responsive Card Component
interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const ResponsiveCard: React.FC<ResponsiveCardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = true
}) => {
  const getPaddingClass = () => {
    switch (padding) {
      case 'sm':
        return 'p-3 sm:p-4';
      case 'md':
        return responsive.card.padding;
      case 'lg':
        return responsive.card.paddingLarge;
      default:
        return responsive.card.padding;
    }
  };

  const hoverClass = hover ? 'hover:shadow-xl transition-shadow duration-300' : '';

  return (
    <div className={`${responsive.card.border} ${responsive.card.shadow} ${getPaddingClass()} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

// Responsive Text Component
interface ResponsiveTextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  variant = 'body',
  className = '',
  as
}) => {
  const getTextClasses = () => {
    switch (variant) {
      case 'h1':
        return responsive.text.h1;
      case 'h2':
        return responsive.text.h2;
      case 'h3':
        return responsive.text.h3;
      case 'h4':
        return responsive.text.h4;
      case 'h5':
        return responsive.text.h5;
      case 'h6':
        return responsive.text.h6;
      case 'body':
        return responsive.text.base;
      case 'caption':
        return responsive.text.sm;
      default:
        return responsive.text.base;
    }
  };

  const Component = as || (variant.startsWith('h') ? variant : 'p');

  return React.createElement(
    Component,
    { className: `${getTextClasses()} ${className}` },
    children
  );
};

// Responsive Button Component
interface ResponsiveButtonProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'mobile';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  fullWidth = false,
  className = '',
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return responsive.button.xs;
      case 'sm':
        return responsive.button.sm;
      case 'md':
        return responsive.button.md;
      case 'lg':
        return responsive.button.lg;
      case 'xl':
        return responsive.button.xl;
      case 'mobile':
        return responsive.button.mobile;
      default:
        return responsive.button.md;
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white border border-gray-600';
      case 'outline':
        return 'bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600';
    }
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${getSizeClasses()} 
        ${getVariantClasses()} 
        ${widthClass} 
        ${disabledClass}
        rounded-md font-medium transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default ResponsiveLayout;
