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
      body: ["Open Sans Variable", "ui-sans-serif", "system-ui", "sans-serif"],
      heading: ["Cormorant Variable", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
    },
    extend: {
      colors: {
        background: {
          DEFAULT: 'rgb(var(--color-background) / <alpha-value>)',
          subtle: {
            1: 'rgb(var(--color-background-subtle) / <alpha-value>)',
            2: 'rgb(var(--color-background-subtle-2) / <alpha-value>)',
          },
          basic: 'rgb(var(--color-background-basic) / <alpha-value>)',
        },
        foreground: {
          DEFAULT: 'rgb(var(--color-foreground) / <alpha-value>)',
          subtle: 'rgb(var(--color-foreground-subtle) / <alpha-value>)',
          basic: 'rgb(var(--color-foreground-basis) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          foreground: 'rgb(var(--color-primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
          foreground: 'rgb(var(--color-secondary-foreground) / <alpha-value>)',
        },
        outline: {
          DEFAULT: 'rgb(var(--color-outline) / <alpha-value>)',
          foreground: 'rgb(var(--color-outline-foreground) / <alpha-value>)',
        },
        bar: {
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
        'scrollText':{
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'scrollImage':{
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'scrollText': 'scrollText linear infinite',
        'scrollImage': 'scrollImage linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    typographyPlugin
  ],
};
