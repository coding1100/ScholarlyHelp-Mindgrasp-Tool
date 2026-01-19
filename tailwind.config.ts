import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  // Strict content paths for better CSS purging
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Safelist essential classes that might be dynamically generated
  safelist: [
    'animate-pulse',
    'bg-gray-100',
  ],
  theme: {
    screens: {
      sm: "576px",
      md: "768px",
      mid: "827px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
    extend: {
      // Override default font family to prevent Inter/Roboto loading
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'system-ui', '-apple-system', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        sample: "url('/Image/sampleBg.webp')",
        heroImage: "url('/Image/bgHeroBoyGirl.webp')",
      },
      colors: {
        primary: {
          100: "#F7F7FD",
          200: "#ECECFB",
          300: "#D1D1F7",
          400: "#565add",
          500: "#2B1C50",
          600: "#212529",
        },
        secondary: {
          200: "#F2E0C7",
          400: "#f97316",
          500: "#ff641a",
        },
      },
    },
  },
  // Reduce unused CSS by disabling unused core plugins
  corePlugins: {
    preflight: true,
    container: true,
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
export default config;
