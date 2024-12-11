/** @type {import('tailwindcss').Config} */
import typographyPlugin from '@tailwindcss/typography';
module.exports = {
  darkMode: ['class'],
  content: ['./@/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      screens: {
        '2xl': '1440px',
      },
    },
    fontFamily: {
      body: ["Nunito Sans Variable", "ui-sans-serif", "system-ui", "sans-serif"],
      heading: ["Cormorant Variable", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
    },
    fontSize: {
      scale: [
        "calc(var(--min-size-px) + (var(--max-size) - var(--min-size)) * ((100vw - var(--wv-min-viewport-size, 320) * 1px) / (var(--wv-max-viewport-size, 1920) - var(--wv-min-viewport-size, 320))))",
        1,
      ],
      xs: ["calc(var(--body-base-size) * 0.75)", 1],
      sm: ["calc(var(--body-base-size) * 0.875)", 1.25],
      base: ["var(--body-base-size)", "var(--body-base-line-height)"],
      lg: ["calc(var(--body-base-size) * 1.125)", 1.75],
      xl: ["calc(var(--body-base-size) * 1.25)", 1.75],
      "2xl": ["calc(var(--body-base-size) * 1.5)", 2],
      "3xl": ["calc(var(--body-base-size) * 1.875)", 2.25],
      "4xl": ["calc(var(--body-base-size) * 2.25)", 2.5],
      "5xl": ["calc(var(--body-base-size) * 3)", 1],
      "6xl": ["calc(var(--body-base-size) * 3.75)", 1],
      "7xl": ["calc(var(--body-base-size) * 4.5)", 1],
      "8xl": ["calc(var(--body-base-size) * 6)", 1],
      "9xl": ["calc(var(--body-base-size) * 8)", 1],
    },
    extend: {
      colors: {
        background: {
          DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          subtle: 'rgb(var(--color-text-subtle) / <alpha-value>)',
          inverse: 'rgb(var(--color-text-inverse) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
          subtle: 'rgb(var(--color-border-subtle) / <alpha-value>)',
        },
        label: {
          sale: '#AB2E2E',
          new: '#9AA473',
          soldout: '#A8A79C',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      height: {
        screen: 'var(--screen-height, 100vh)',
        'screen-no-nav':
          'calc(var(--screen-height, 100vh) - var(--height-nav))',
        'screen-in-drawer': 'calc(var(--screen-height, 100vh) - 90px)',
        'screen-dynamic': 'var(--screen-height-dynamic, 100vh)',
        nav: 'var(--height-nav)',
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
        'scrollContent':{
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'scrollContent': 'scrollContent linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    typographyPlugin
  ],
};
