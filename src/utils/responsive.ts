// Responsive Design Utilities
// Provides consistent responsive breakpoints and utilities across the application

export const BREAKPOINTS = {
  xs: '320px',   // Extra small devices (phones)
  sm: '640px',   // Small devices (large phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (laptops)
  xl: '1280px',  // Extra large devices (desktops)
  '2xl': '1536px' // 2X large devices (large desktops)
} as const;

// Responsive class generators
export const responsive = {
  // Grid utilities
  grid: {
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-1 sm:grid-cols-2',
    cols3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    cols5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    cols6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
    
    // Auto-fit grids
    autoFit: {
      sm: 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
      md: 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
      lg: 'grid-cols-[repeat(auto-fit,minmax(300px,1fr))]'
    }
  },

  // Flex utilities
  flex: {
    col: 'flex flex-col',
    colSm: 'flex flex-col sm:flex-row',
    colMd: 'flex flex-col md:flex-row',
    colLg: 'flex flex-col lg:flex-row',
    wrap: 'flex flex-wrap',
    nowrap: 'flex flex-nowrap',
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-start',
    end: 'flex items-end'
  },

  // Spacing utilities
  spacing: {
    padding: {
      xs: 'p-2 sm:p-3',
      sm: 'p-3 sm:p-4',
      md: 'p-4 sm:p-6',
      lg: 'p-6 sm:p-8',
      xl: 'p-8 sm:p-12'
    },
    margin: {
      xs: 'm-2 sm:m-3',
      sm: 'm-3 sm:m-4',
      md: 'm-4 sm:m-6',
      lg: 'm-6 sm:m-8',
      xl: 'm-8 sm:m-12'
    },
    gap: {
      xs: 'gap-2 sm:gap-3',
      sm: 'gap-3 sm:gap-4',
      md: 'gap-4 sm:gap-6',
      lg: 'gap-6 sm:gap-8',
      xl: 'gap-8 sm:gap-12'
    }
  },

  // Typography utilities
  text: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl',
    '5xl': 'text-5xl sm:text-6xl',
    
    // Headings
    h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold',
    h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold',
    h3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold',
    h4: 'text-base sm:text-lg md:text-xl lg:text-2xl font-semibold',
    h5: 'text-sm sm:text-base md:text-lg lg:text-xl font-medium',
    h6: 'text-xs sm:text-sm md:text-base lg:text-lg font-medium'
  },

  // Container utilities
  container: {
    full: 'w-full',
    responsive: 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    narrow: 'w-full max-w-4xl mx-auto px-4 sm:px-6',
    wide: 'w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'
  },

  // Button utilities
  button: {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm sm:text-base',
    lg: 'px-6 py-3 text-base sm:text-lg',
    xl: 'px-8 py-4 text-lg sm:text-xl',
    
    // Mobile-first button sizes
    mobile: 'w-full sm:w-auto px-4 py-3 text-base font-medium',
    mobileSmall: 'w-full sm:w-auto px-3 py-2 text-sm'
  },

  // Card utilities
  card: {
    padding: 'p-4 sm:p-6',
    paddingLarge: 'p-6 sm:p-8',
    shadow: 'shadow-lg hover:shadow-xl transition-shadow duration-300',
    border: 'border border-gray-200 rounded-lg',
    full: 'border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6'
  },

  // Form utilities
  form: {
    input: 'w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    label: 'block text-sm font-medium text-gray-700 mb-1',
    group: 'space-y-1',
    row: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
    rowThree: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
  },

  // Navigation utilities
  nav: {
    mobile: 'block sm:hidden',
    desktop: 'hidden sm:block',
    item: 'block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 transition-colors',
    itemMobile: 'block w-full text-left px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 transition-colors'
  },

  // Table utilities
  table: {
    responsive: 'overflow-x-auto',
    container: 'min-w-full divide-y divide-gray-200',
    cell: 'px-3 py-2 sm:px-6 sm:py-4 text-sm',
    header: 'px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
  },

  // Modal utilities
  modal: {
    overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4',
    content: 'bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-y-auto',
    header: 'px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200',
    body: 'px-4 py-3 sm:px-6 sm:py-4',
    footer: 'px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end'
  },

  // Hide/show utilities
  visibility: {
    mobileOnly: 'block sm:hidden',
    tabletUp: 'hidden sm:block',
    desktopOnly: 'hidden lg:block',
    mobileTablet: 'block lg:hidden'
  }
};

// Responsive breakpoint hooks
export const useResponsive = () => {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  const isDesktop = window.innerWidth >= 1024;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
};

// Responsive class builder
export const buildResponsiveClasses = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Common responsive patterns
export const responsivePatterns = {
  // Hero section
  hero: buildResponsiveClasses(
    'py-12 sm:py-16 md:py-20 lg:py-24',
    'px-4 sm:px-6 lg:px-8',
    'text-center'
  ),
  
  // Section spacing
  section: buildResponsiveClasses(
    'py-8 sm:py-12 md:py-16 lg:py-20',
    'px-4 sm:px-6 lg:px-8'
  ),
  
  // Card grid
  cardGrid: buildResponsiveClasses(
    'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    'gap-4 sm:gap-6 lg:gap-8'
  ),
  
  // Form layout
  formLayout: buildResponsiveClasses(
    'space-y-4 sm:space-y-6',
    'max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto'
  ),
  
  // Navigation
  navigation: buildResponsiveClasses(
    'flex items-center justify-between',
    'px-4 sm:px-6 lg:px-8',
    'py-3 sm:py-4'
  ),
  
  // Stats grid
  statsGrid: buildResponsiveClasses(
    'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    'gap-3 sm:gap-4 lg:gap-6'
  )
};

// Mobile-first media queries for CSS-in-JS
export const mediaQueries = {
  sm: `@media (min-width: ${BREAKPOINTS.sm})`,
  md: `@media (min-width: ${BREAKPOINTS.md})`,
  lg: `@media (min-width: ${BREAKPOINTS.lg})`,
  xl: `@media (min-width: ${BREAKPOINTS.xl})`,
  '2xl': `@media (min-width: ${BREAKPOINTS['2xl']})`
};

export default responsive;
