/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFC107',
          dark: '#FFA000',
          light: '#FFECB3',
        },
        sidebar: {
          DEFAULT: '#1F1F1F',
          hover: '#2A2A2A',
        },
        background: {
          DEFAULT: '#FAFAFA',
          dark: '#F5F5F5',
        },
        // default border color used by global styles
        border: '#E5E7EB',
        card: '#FFFFFF',
        text: {
          primary: '#1A1A1A',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        status: {
           todo: '#3B82F6',
          upcoming: '#F59E0B',
          done: '#10B981',
        }
      },
      borderRadius: {
        'card': '12px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }
    },
    
  },
  plugins: [],
}

