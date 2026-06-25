// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Dana-FaNum', 'Vazirmatn', 'Tahoma', 'sans-serif'],
        dana: ['Dana-FaNum', 'Vazirmatn', 'Tahoma', 'sans-serif'],
        'dana-regular': ['Dana-FaNum', 'Vazirmatn', 'Tahoma', 'sans-serif'],
        'dana-medium': ['Dana-FaNum', 'Vazirmatn', 'Tahoma', 'sans-serif'],
        'dana-bold': ['Dana-FaNum', 'Vazirmatn', 'Tahoma', 'sans-serif'],
        'dana-black': ['Dana-FaNum', 'Vazirmatn', 'Tahoma', 'sans-serif'],
        'dana-light': ['Dana-FaNum', 'Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        bold: 700,
        black: 900,
      },
      animation: {
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
};
