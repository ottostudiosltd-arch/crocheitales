/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: {
            DEFAULT: '#79002F',
            dark: '#550021',
            light: '#961542',
            50: '#FDF2F4',
            100: '#F9E2E7',
            200: '#F3C4CF',
            300: '#E898AC',
            400: '#C77D91',
            500: '#79002F',
            600: '#660027',
            700: '#550021',
          },
          dustyRose: '#C77D91',
          blush: '#F2B8C5',
          softPink: '#FBE0E6',
          cream: {
            DEFAULT: '#F8F1E5',
            light: '#FCF8F2',
            subtle: '#FFFBF7',
          },
          peach: '#FEEFEA',
          card: '#FFFFFF',
          text: {
            primary: '#3A101D',
            secondary: '#5C2735',
            muted: '#875B67',
            light: '#FFFFFF',
          },
          border: {
            DEFAULT: '#F2D5DC',
            light: '#F8E7EC',
          }
        }
      },
      fontFamily: {
        serif: ['"DM Serif Display"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        handwriting: ['"Caveat"', '"Dancing Script"', 'cursive'],
      },
      borderRadius: {
        'card': '1.25rem',
        'pill': '9999px',
        'boutique': '1rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(121, 0, 47, 0.05), 0 2px 6px -1px rgba(121, 0, 47, 0.02)',
        'card': '0 8px 30px -4px rgba(121, 0, 47, 0.08)',
        'glow': '0 0 15px rgba(242, 184, 197, 0.4)',
      }
    },
  },
  plugins: [],
}
