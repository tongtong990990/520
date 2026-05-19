import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          main: "#FFB6C8",
          light: "#FFE5EE",
        },
        cream: {
          white: "#FFF7EF",
        },
        heart: {
          red: "#FF5C7A",
        },
        brown: {
          text: "#5A3A36",
        },
      },
      fontFamily: {
        display: ['"ZCOOL KuaiLe"', "cursive", "sans-serif"],
        body: ['"Noto Sans SC"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        cream: "0 8px 32px rgba(255, 92, 122, 0.22)",
        glow: "0 0 40px rgba(255, 182, 200, 0.55)",
      },
      backgroundImage: {
        "pink-sky": "linear-gradient(180deg, #FFE5EE 0%, #FFB6C8 55%, #FF9BB5 100%)",
        "night-magic":
          "linear-gradient(180deg, #2D1B3D 0%, #4A2C5A 50%, #6B3D7A 100%)",
        "paper-scroll": "linear-gradient(180deg, #FFF7EF 0%, #FFE5EE 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
