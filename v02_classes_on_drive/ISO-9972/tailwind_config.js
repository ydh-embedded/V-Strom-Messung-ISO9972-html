/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./*.html"
  ],
  theme: {
    extend: {
      // Custom colors for the application
      colors: {
        'brand': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        'measurement': {
          theoretical: '#3b82f6',
          simulated: '#f59e0b',
          real: '#22c55e',
          underpressure: '#ef4444',
          overpressure: '#a855f7'
        }
      },
      // Custom spacing for A4 dimensions
      spacing: {
        'a4-width': '297mm',
        'a4-height': '210mm',
        'a4-margin': '35mm',
      },
      // Custom width/height classes for A4
      width: {
        'a4-landscape': '297mm',
      },
      height: {
        'a4-landscape': '210mm',
      },
      minHeight: {
        'a4-landscape': '210mm',
        'a4-section': '180mm',
      },
      maxHeight: {
        'a4-section': '180mm',
      },
      // Typography
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      // Box shadows
      boxShadow: {
        'elegant': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      // Backdrop blur
      backdropBlur: {
        'xs': '2px',
      },
      // Animation
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      // Custom gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'measurement-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'analysis-bg': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'protocol-bg': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Custom plugin for print styles
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        '.print-only': {
          '@media print': {
            display: 'block',
          },
          '@media screen': {
            display: 'none',
          },
        },
        '.screen-only': {
          '@media print': {
            display: 'none',
          },
        },
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.input-field-print': {
          '@media print': {
            'border-bottom': '1pt solid black',
            'min-width': '50mm',
            display: 'inline-block',
            padding: '1pt 2pt',
            background: 'transparent',
            'font-size': '10pt',
            height: '12pt',
          },
        },
      }

      const newComponents = {
        '.elegant-button': {
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            'box-shadow': '0 10px 25px rgba(0, 0, 0, 0.15)',
          },
        },
        '.measurement-card': {
          background: 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          'border-radius': '1rem',
          padding: '1.5rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
        '.logo-glow': {
          'box-shadow': '0 0 20px rgba(59, 130, 246, 0.3)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
        '.shine-effect': {
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
            transform: 'rotate(45deg)',
            animation: 'shine 3s ease-in-out infinite',
          },
        },
      }

      addUtilities(newUtilities)
      addComponents(newComponents)
    }
  ],
  // Dark mode configuration
  darkMode: 'class',
}