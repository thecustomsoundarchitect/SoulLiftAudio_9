/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Calibri', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
      },
      colors: {
        'primary': '#4D1A77',
        'secondary': '#6E3BA4',
        'muted': '#A082C6',
        'inverted': '#FFFFFF',
        'glass': 'rgba(255,255,255,0.08)',
        'glass-hover': 'rgba(255,255,255,0.16)',
        'button-primary': '#4D1A77',
        'button-secondary': '#6E3BA4',
        'input': '#A082C6',
        'focus': '#4D1A77',
        'soul-purple': '#8B5CF6',
        'soul-blue': '#3B82F6',
        'soul-gradient-start': '#8B5CF6',
        'soul-gradient-end': '#3B82F6',
      },
      backgroundImage: {
        'soul-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
        'soul-gradient-light': 'linear-gradient(135deg, #F3E8FF 0%, #EBF4FF 100%)',
        'dot-black': 'radial-gradient(circle, black 1px, transparent 1px)',
        'dot-white': 'radial-gradient(circle, white 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-black': '20px 20px',
        'dot-white': '20px 20px',
      },
    },
  },
  plugins: [],
}