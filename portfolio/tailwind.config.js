/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "th-bg":     "rgb(var(--bg)     / <alpha-value>)",
        "th-sect":   "rgb(var(--sect)   / <alpha-value>)",
        "th-card":   "rgb(var(--card)   / <alpha-value>)",
        "th-alt":    "rgb(var(--alt)    / <alpha-value>)",
        "th-fg":     "rgb(var(--fg)     / <alpha-value>)",
        "th-body":   "rgb(var(--body)   / <alpha-value>)",
        "th-subtle": "rgb(var(--subtle) / <alpha-value>)",
      },
    },
  },
  plugins: [],
}
