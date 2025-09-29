/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        zetech: {
          blue: '#0056b3',
          'blue-light': '#007bff',
          'blue-dark': '#004494',
          gray: '#f0f2f5',
          'gray-dark': '#6c757d'
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif']
      },
      boxShadow: {
        'zetech': '0 4px 6px rgba(0, 86, 179, 0.1)',
        'zetech-md': '0 6px 12px rgba(0, 86, 179, 0.15)'
      }
    },
  },
  plugins: [],
}