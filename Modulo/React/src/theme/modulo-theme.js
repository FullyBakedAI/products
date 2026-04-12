/**
 * Modulo Brand Theme
 *
 * Theme configuration for the Modulo DeFi wallet.
 * Maps to --bk-* CSS custom properties via ThemeProvider.
 *
 * To rebrand: swap this file for a different theme config.
 *
 * @type {import('./theme-types').BakeKitTheme}
 */
const moduloTheme = {
  brandName: 'Modulo',
  logoSrc: '/assets/modulo-logo.svg',
  fontFamily: "'Inter', sans-serif",

  // Brand
  primaryColor: '#584BEB',
  gradientStart: '#584BEB',
  gradientEnd: '#4A3DE0',

  // Surfaces
  bgBase: '#0D0E17',
  bgCard: '#1A1A29',
  bgCardAlt: '#1F1F33',
  bgNav: '#13141F',
  bgElevated: '#13141F',
  bgOuter: '#0C0C0F',

  // Text
  textPrimary: '#F5F5F6',
  textSecondary: '#B3B2B8',
  textMuted: '#87878C',
  textPlaceholder: 'rgba(245, 245, 246, 0.5)',

  // Borders
  borderSubtle: '#1E1F2E',
  borderCard: 'rgba(45, 44, 74, 0.2)',
  borderPill: 'rgba(45, 44, 74, 0.4)',
  borderActive: '#584BEB',
  borderSearch: '#2A2A3D',
  borderRow: '#181929',

  // Semantic
  success: '#22C55E',
  error: '#F04348',
  warning: '#F59E0B',

  // Special
  overlay: 'rgba(0, 0, 0, 0.6)',
  statusBarDim: '#3A3B4E',
  pillBg: '#2A2A3E',
  earnCardBg: 'rgba(88, 75, 235, 0.18)',
  earnCardBorder: 'rgba(88, 75, 235, 0.2)',
};

export default moduloTheme;
