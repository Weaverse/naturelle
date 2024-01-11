/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./@/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        background: {
          DEFAULT: 'var(--color-background)',
          subtle: {
            1: 'var(--color-background-subtle-1)',
            2: 'var(--color-background-subtle-2)',
          },
          basic: 'var(--color-background-basic)',
        },
        foreground: {
          DEFAULT: 'var(--color-text)',
          subtle: 'var(--color-text-subtle)',
          basic: 'var(--color-text-basis)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        outline: {
          DEFAULT: 'var(--color-outline)',
          foreground: 'var(--color-outline-foreground)',
        },
        bar: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
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
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
