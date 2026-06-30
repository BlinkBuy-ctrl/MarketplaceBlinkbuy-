/**
 * Market Hub Malawi - Theme Configuration
 * Color Scheme: Pink & Black
 * Primary: #FF2D8D (Hot Pink)
 * Secondary: #FF6FAE (Light Pink)
 * Background: #0F0F0F (Dark Black)
 * Card BG: #1C1C1C (Dark Gray)
 */

export const theme = {
  colors: {
    // Primary Colors
    primary: '#FF2D8D',        // Hot Pink
    primaryLight: '#FF6FAE',   // Light Pink
    primaryDark: '#E0256F',    // Dark Pink
    
    // Background
    background: '#0F0F0F',     // Dark Black
    surface: '#1C1C1C',        // Dark Gray (Cards)
    surfaceLight: '#2C2C2C',   // Lighter Gray
    
    // Text
    text: '#FFFFFF',           // White
    textSecondary: '#B5B5B5',  // Gray
    textTertiary: '#888888',   // Darker Gray
    
    // Status Colors
    success: '#10B981',        // Green
    warning: '#F59E0B',        // Amber
    error: '#EF4444',          // Red
    info: '#3B82F6',           // Blue
    
    // Borders
    border: '#FF2D8D',         // Pink border
    borderLight: '#2C2C2C',    // Light border
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
  },

  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(255, 45, 141, 0.1)',
    lg: '0 10px 15px -3px rgba(255, 45, 141, 0.2)',
    xl: '0 20px 25px -5px rgba(255, 45, 141, 0.3)',
  },

  transitions: {
    fast: '150ms ease-in-out',
    base: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
};

// CSS Variables for use in stylesheets
export const cssVariables = `
  :root {
    --color-primary: ${theme.colors.primary};
    --color-primary-light: ${theme.colors.primaryLight};
    --color-primary-dark: ${theme.colors.primaryDark};
    --color-background: ${theme.colors.background};
    --color-surface: ${theme.colors.surface};
    --color-surface-light: ${theme.colors.surfaceLight};
    --color-text: ${theme.colors.text};
    --color-text-secondary: ${theme.colors.textSecondary};
    --color-text-tertiary: ${theme.colors.textTertiary};
    --color-success: ${theme.colors.success};
    --color-warning: ${theme.colors.warning};
    --color-error: ${theme.colors.error};
    --color-info: ${theme.colors.info};
    --color-border: ${theme.colors.border};
    --color-border-light: ${theme.colors.borderLight};
    
    --spacing-xs: ${theme.spacing.xs};
    --spacing-sm: ${theme.spacing.sm};
    --spacing-md: ${theme.spacing.md};
    --spacing-lg: ${theme.spacing.lg};
    --spacing-xl: ${theme.spacing.xl};
    --spacing-2xl: ${theme.spacing['2xl']};
    
    --radius-sm: ${theme.borderRadius.sm};
    --radius-md: ${theme.borderRadius.md};
    --radius-lg: ${theme.borderRadius.lg};
    --radius-xl: ${theme.borderRadius.xl};
    --radius-full: ${theme.borderRadius.full};
    
    --transition-fast: ${theme.transitions.fast};
    --transition-base: ${theme.transitions.base};
    --transition-slow: ${theme.transitions.slow};
  }
`;

// Tailwind Color Mapping
export const tailwindConfig = {
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      black: '#000000',
      pink: {
        50: '#FFF0F7',
        100: '#FFE0EE',
        200: '#FFC0E0',
        300: '#FFA0D2',
        400: '#FF6FAE',
        500: '#FF2D8D',
        600: '#E0256F',
        700: '#C01D5B',
        800: '#A01547',
        900: '#800D33',
      },
      gray: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
      },
      slate: {
        900: '#0F0F0F',
        800: '#1C1C1C',
        700: '#2C2C2C',
      },
      green: {
        400: '#10B981',
        500: '#059669',
      },
      yellow: {
        400: '#F59E0B',
        500: '#FBBF24',
      },
      red: {
        400: '#EF4444',
        500: '#DC2626',
      },
      blue: {
        400: '#3B82F6',
        500: '#2563EB',
      },
    },
    extend: {
      backgroundColor: {
        primary: '#FF2D8D',
        surface: '#1C1C1C',
        dark: '#0F0F0F',
      },
      textColor: {
        primary: '#FF2D8D',
        secondary: '#B5B5B5',
        light: '#FFFFFF',
      },
      borderColor: {
        primary: '#FF2D8D',
        secondary: '#B5B5B5',
        light: '#2C2C2C',
      },
    },
  },
};

// Component Styles Template
export const componentStyles = {
  button: {
    primary: `
      bg-gradient-to-r from-[#FF2D8D] to-[#FF6FAE]
      text-white font-semibold
      px-4 py-2 rounded-lg
      hover:shadow-lg hover:shadow-[#FF2D8D]/50
      transition-all duration-300
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    secondary: `
      bg-[#1C1C1C] text-[#B5B5B5]
      border border-[#FF2D8D]/30
      px-4 py-2 rounded-lg
      hover:border-[#FF2D8D] hover:text-[#FF2D8D]
      transition-colors duration-300
    `,
    ghost: `
      text-[#FF2D8D] bg-transparent
      hover:bg-[#FF2D8D]/10
      px-4 py-2 rounded-lg
      transition-colors duration-300
    `,
  },

  card: `
    bg-[#1C1C1C] rounded-xl p-6
    border border-[#FF2D8D]/20
    hover:border-[#FF2D8D]/50
    transition-all duration-300
  `,

  input: `
    bg-[#1C1C1C] border border-[#FF2D8D]/30
    rounded-lg px-4 py-3 text-white
    placeholder-[#B5B5B5]
    focus:outline-none focus:border-[#FF2D8D]
    transition-colors duration-300
  `,

  badge: {
    pink: 'bg-[#FF2D8D]/20 text-[#FF2D8D] px-3 py-1 rounded-full text-xs font-semibold',
    green: 'bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold',
    yellow: 'bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold',
    red: 'bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-semibold',
  },
};

// Gradient Presets
export const gradients = {
  primary: 'linear-gradient(to right, #FF2D8D, #FF6FAE)',
  dark: 'linear-gradient(to bottom right, #0F0F0F, #1C1C1C)',
  hover: 'linear-gradient(135deg, #FF2D8D, #FF6FAE)',
};

export default theme;
