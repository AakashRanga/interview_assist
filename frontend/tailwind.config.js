


export default {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: '#02f576',
        secondary: '#1e2345',
        tertiary: '#F8FAFC',
        neutral: '#7A7581',
        cyan: '#02f576',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(2, 245, 118, 0.08)',
        'glass-lg': '0 20px 60px rgba(2, 245, 118, 0.12)',
        'glow': '0 0 20px rgba(2, 245, 118, 0.4)',
        'glow-cyan': '0 0 20px rgba(2, 245, 118, 0.4)',
      },
    },
  },
  plugins: [],
}


