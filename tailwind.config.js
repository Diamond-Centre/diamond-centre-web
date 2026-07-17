/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dice: {
          blue: '#0a89f2',
          'blue-dark': '#0770cc',
          'blue-light': '#e8f4fe',
          glass: 'rgba(255, 255, 255, 0.1)',
          'glass-border': 'rgba(255, 255, 255, 0.2)',
        },
      },
      fontFamily: {
        'google-sans': ['Google Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dice': 'linear-gradient(135deg, #0a89f2, #6c5ce7)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}
