/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace']
      },
      colors: {
        linear: {
          bg: '#08090A',
          sidebar: '#0B0C0D',
          panel: '#111214',
          raised: '#17181B',
          border: '#23252A',
          text: '#F7F8F8',
          muted: '#8A8F98',
          accent: '#5E6AD2',
          accentHover: '#6E79E0'
        }
      },
      borderRadius: {
        DEFAULT: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px'
      }
    },
  },
  plugins: [],
}
