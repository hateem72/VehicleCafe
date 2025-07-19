/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryYellow: '#FFD700',
        primaryRed: '#FF4500',
        primaryBlue: '#1E90FF',
        primaryGreen: '#32CD32',
        backgroundWhite: '#FFFFFF'
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'serif': ['Lora', 'serif'],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(to right, #9C27B0, #7B1FA2)",
      },
    },
  },
  plugins: [],
}