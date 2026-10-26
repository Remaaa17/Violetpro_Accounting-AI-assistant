/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Brand Colors
        'brand-dark': '#02202C',      // Dark backgrounds, headers, structural elements
        'brand-navy': '#044B65',      // Dark accents, navigation, important elements
        'brand-primary': '#089ACC',   // Primary accent - buttons, links, icons
        'brand-mint': '#A8FBD2',      // Subtle highlights, hover states, secondary accents
        'brand-mint-dark': '#059669', // Darker mint for income/positive values with better contrast
        'brand-light': '#EBFEF3',     // Light backgrounds, cards, content areas
        
        primary: {
          DEFAULT: '#089ACC',
          dark: '#044B65',
          darker: '#02202C',
          light: '#A8FBD2',
          lightest: '#EBFEF3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(2, 32, 44, 0.08)',
        'medium': '0 4px 20px rgba(2, 32, 44, 0.12)',
        'hard': '0 10px 40px rgba(2, 32, 44, 0.15)',
        'glow': '0 0 20px rgba(8, 154, 204, 0.3)',
        'mint': '0 0 20px rgba(168, 251, 210, 0.3)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(45deg, #02202C, #044B65, #089ACC, #A8FBD2, #EBFEF3)',
        'brand-gradient-reverse': 'linear-gradient(225deg, #EBFEF3, #A8FBD2, #089ACC, #044B65, #02202C)',
        'brand-gradient-soft': 'linear-gradient(135deg, #089ACC, #A8FBD2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'bounce-soft': 'bounceSoft 2s infinite',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
