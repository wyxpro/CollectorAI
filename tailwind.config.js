/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 使用class模式启用深色模式
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'mobile': '428px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      fontSize: {
        'xs-mobile': ['0.75rem', { lineHeight: '1.5' }],
        'sm-mobile': ['0.875rem', { lineHeight: '1.5' }],
        'base-mobile': ['1rem', { lineHeight: '1.6' }],
        'lg-mobile': ['1.125rem', { lineHeight: '1.6' }],
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      colors: {
        // 可以在这里添加自定义颜色
      },
      animation: {
        'in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
