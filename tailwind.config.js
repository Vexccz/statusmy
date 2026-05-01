/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        card: 'var(--card)',
        border: 'var(--border)',
        brand: {
          DEFAULT: 'var(--brand)',
          light: 'var(--brand-light)',
          bg: 'var(--brand-bg)',
        },
        semantic: {
          success: 'var(--success)',
          error: 'var(--error)',
          warning: 'var(--warning)',
          info: 'var(--info)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      borderRadius: {
        'xs': '6px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.04)',
        'md': '0 4px 16px -2px rgba(0, 0, 0, 0.08)',
        'lg': '0 12px 24px -4px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.15)',
        'glow-lg': '0 0 30px rgba(16, 185, 129, 0.25)',
      },
      backgroundImage: {
        'grad-brand': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'grad-purple': 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
        'grad-dark': 'linear-gradient(180deg, #0a0a0f 0%, #141420 100%)',
      },
      maxWidth: {
        'container': '1280px',
      },
      gap: {
        'grid': '24px',
      },
      transitionDuration: {
        'micro': '150ms',
        'small': '250ms',
        'medium': '350ms',
        'large': '500ms',
      },
      transitionTimingFunction: {
        'micro': 'ease-out',
        'small': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'medium': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      fontSize: {
        'heading-xl': ['clamp(3rem, 6vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'heading-lg': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-md': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
