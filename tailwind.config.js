/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#071629',
          900: '#0B1F3A',
          800: '#142E4C',
          700: '#1D3A63',
          100: '#E3E9F2',
          50: '#F1F4F9',
        },
        gold: {
          400: '#D4AF37',
          500: '#C59B27',
          // Gold for text on light surfaces (6.2:1 on white). Never use 400/500 as text on white.
          700: '#7A5C0E',
          50: '#FBF5E5',
        },
        surface: '#F8FAFC',
        line: '#E2E8F0',
        ink: '#0F172A',
        success: '#15803D',
        warning: '#B45309',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Vazirmatn', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        fa: ['Vazirmatn', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        page: '77.5rem', // 1240px
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
