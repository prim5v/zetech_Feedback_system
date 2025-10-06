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
          blue: '#00264d',
          'blue-light': '#00264d',
          'blue-dark': '#00264d',
          gray: '#f0f2f5',
          'gray-dark': '#6c757d',
          'orange-dark': '#c04000' // 🟧 added dark orange
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
