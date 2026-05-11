/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        claude: {
          primary: '#cc785c',
          'primary-hover': '#a9583e',
          'primary-disabled': '#e6dfd8',
          ink: '#141413',
          body: '#3d3d3a',
          'body-strong': '#252523',
          muted: '#6c6a64',
          'muted-soft': '#8e8b82',
          hairline: '#e6dfd8',
          'hairline-soft': '#ebe6df',
          canvas: '#faf9f5',
          'surface-soft': '#f5f0e8',
          'surface-card': '#efe9de',
          'surface-cream-strong': '#e8e0d2',
          'surface-dark': '#181715',
          'surface-dark-elevated': '#252320',
          'surface-dark-soft': '#1f1e1b',
          teal: '#5db8a6',
          amber: '#e8a55a',
          success: '#5db872',
          warning: '#d4a017',
          error: '#c64545',
        },
      },
      fontFamily: {
        claude: [
          '"Inter"',
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto',
          '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"',
          'sans-serif',
        ],
        'claude-mono': [
          '"JetBrains Mono"', '"SF Mono"', 'Menlo', 'Consolas',
          '"Liberation Mono"', 'monospace',
        ],
      },
      borderRadius: {
        claude: {
          xs: '4px',
          sm: '6px',
          md: '8px',
          lg: '12px',
          xl: '16px',
          '2xl': '20px',
          pill: '9999px',
        },
      },
      boxShadow: {
        claude: {
          sm: '0 0 0 1px #e6dfd8',
          md: '0 0 0 1px #e6dfd8, 0 4px 16px rgba(20,20,19,0.06)',
          lg: '0 0 0 1px #e6dfd8, 0 8px 32px rgba(20,20,19,0.1)',
          'card': '0 0 0 1px #e6dfd8',
          'card-hover': '0 0 0 1px #ebe6df, 0 4px 16px rgba(20,20,19,0.08)',
        },
      },
    },
  },
  plugins: [],
};
