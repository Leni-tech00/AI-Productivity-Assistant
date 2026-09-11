/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          900: "#0B0F19",
          800: "#111827",
          700: "#1A1F2E",
          600: "#232938",
          500: "#2D3447",
          400: "#3A4257",
        },
        coral: {
          50: "#FFF1F0",
          100: "#FFE0DD",
          200: "#FFC7C2",
          300: "#FFA59E",
          400: "#FF7A6E",
          500: "#F95442",
          600: "#E6392A",
          700: "#BF2B1E",
          800: "#992519",
          900: "#7A2018",
        },
        rose: {
          50: "#FFF5F7",
          100: "#FFE8EE",
          200: "#FFD0DC",
          300: "#FFA8BE",
          400: "#FF7A9C",
          500: "#F95478",
          600: "#E6395E",
          700: "#BF2B4C",
          800: "#99253F",
          900: "#7A2033",
        },
        accent: {
          50: "#F0FBFF",
          100: "#D9F5FF",
          200: "#B8EDFF",
          300: "#84E2FF",
          400: "#4AD2FF",
          500: "#1FB8F0",
          600: "#0E94C4",
          700: "#0B759B",
          800: "#0D5C7B",
          900: "#0F4A64",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "shimmer": "shimmer 1.5s infinite linear",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(249, 84, 66, 0.15)" },
          "50%": { boxShadow: "0 0 30px rgba(249, 84, 66, 0.3)" },
        },
      },
    },
  },
  plugins: [],
};
