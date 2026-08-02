import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Gallery-at-night palette, pulled from the real reference photos:
        // near-black room walls, brass track lighting, warm oak floor.
        ink: "#151210",       // page background — dim gallery room
        wall: "#2A2521",      // panel / card background — gallery wall
        oak: "#4A3324",       // floor / grounding tone
        parchment: "#EDE6D9", // primary text — spotlit canvas white
        brass: "#B8863C",     // frame gold / accent — track lighting
        clay: "#A6432F",      // sparing accent — pulled from the red panel/backpack
        slate: "#7C8FA6",     // sparing accent — pulled from the blue figures
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
