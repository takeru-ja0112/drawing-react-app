module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  safelist: [
    'bg-yellow-400',
    'bg-yellow-300',
    'bg-yellow-200',
    'bg-amber-400',
    'bg-amber-300',
    'bg-amber-200',
    'border-yellow-400',
    'border-yellow-300',
    'border-yellow-200',
    'border-amber-400',
    'border-amber-300',
    'border-amber-200',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
