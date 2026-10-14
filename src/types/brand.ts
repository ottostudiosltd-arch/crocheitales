/**
 * Crochei Tales - Centralized Design Tokens & Brand System
 * Phase 1: Brand System and UI Design
 */

export const BRAND_COLORS = {
  burgundy: {
    DEFAULT: '#79002F',
    dark: '#550021',
    light: '#961542',
    hover: '#660027',
  },
  dustyRose: '#C77D91',
  blush: '#F2B8C5',
  softPink: '#FBE0E6',
  cream: {
    DEFAULT: '#F8F1E5',
    light: '#FFFBF7',
    peach: '#FEEFEA',
  },
  text: {
    primary: '#3A101D',
    secondary: '#5C2735',
    muted: '#875B67',
    inverse: '#FFFFFF',
  },
  border: {
    DEFAULT: '#F2D5DC',
    subtle: '#F8E7EC',
  },
} as const;

export const BRAND_FONTS = {
  heading: 'DM Serif Display, Playfair Display, Georgia, serif',
  body: 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
  accent: 'Caveat, Dancing Script, cursive',
} as const;

/**
 * Record of unconfirmed vs confirmed brand assets/values
 * Acceptance criterion: "Unconfirmed brand values are documented."
 */
export const BRAND_VERIFICATION_STATUS = {
  logo: {
    status: 'CONFIRMED_ASSET',
    source: 'client-provided high-res image (crochei tales with yarn heart needle)',
    verified: true,
  },
  palette: {
    status: 'CONFIRMED_FROM_MOCKUP',
    values: {
      deepBurgundy: '#79002F',
      dustyRose: '#C77D91',
      blushPink: '#F2B8C5',
      warmCream: '#F8F1E5',
      softPink: '#FBE0E6',
    },
    verified: true,
  },
  typography: {
    status: 'PROVISIONAL_ACCESSIBLE_FONTS',
    heading: 'DM Serif Display / Playfair Display (provisional serif aesthetic)',
    body: 'Plus Jakarta Sans (provisional clean sans-serif)',
    verified: false,
    note: 'Will seamlessly update if client provides specific licensed web font files (.woff2)',
  },
  domain: {
    status: 'PENDING_CLIENT_DNS',
    target: 'crocheitales.in',
    verified: false,
  },
} as const;
