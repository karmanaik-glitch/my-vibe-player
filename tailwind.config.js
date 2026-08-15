/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#050507",
        glass: "rgba(255,255,255,0.06)",
        "glass-border": "rgba(255,255,255,0.12)",
        ember: "#E8A33D",
        "ember-dim": "#9C6B22",
        ink: "#F3F1EC",
        "ink-dim": "rgba(243,241,236,0.55)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        ember: "0 0 12px rgba(232,163,61,0.55)",
      },
      transitionTimingFunction: {
        glass: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
