module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      'vk-blue': '#0077FF',
      'vk-magenta': '#FF0084',

      'white': '#fff',
      'dark': '#343434',

      'muted': '#F2F3F5',
      'incorrect': '#EB5757',
      'correct': '#27AE60',
      'neutral': '#F2C94C',
      'score': '#00EAFF',

      'inactive': '#4F4F4F',
      'active': '#FFF',
    },
    extend: {
      fontSize: {
        'h1': '12.5rem', // 200px
        'h2': '9rem', // 144px
        'h3': '7.75rem', // 124px
        'h4': '4.375rem', // 70px
        'h5': '2.125rem', // 34px
      },
      borderRadius: {
        'sm': '0.3125rem',
        DEFAULT: '0.5rem',
        'md': '2.625rem',
      },
    },
  },
  plugins: [],
};
