import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        tesda: {
          blue: '#0047AB',
          'blue-dark': '#003380',
          'blue-light': '#1E5FBF',
        }
      }
    }
  },
  plugins: []
} satisfies Config;

