/** @type {import('tailwindcss').Config} */
// Theme colours are rgb channel variables set by theme/ThemeContext.tsx (see theme/cssVars.ts)
// so opacity modifiers (text-link/40) work.
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#EC4007",
        "primary-light": "#FFC7CC",
        border: "#4A413F",
        text: "#616161",
        // Semantic, theme-aware colours: values come from CSS variables set by
        // theme/ThemeContext.tsx (single source of truth: theme/tokens.ts).
        link: v("link"),
        background: v("background"),
        "background-soft": v("background-soft"),
        surface: v("surface"),
        "surface-cream": v("surface-cream"),
        tint: v("tint"),
        fg: v("text-strong"),
        body: v("text-body"),
        muted: v("text-muted"),
        line: v("border"),
        "line-light": v("border-light"),
        "line-soft": v("border-soft"),
        "brand-text": v("brand-text"),
        "fill-muted": v("fill-muted"),
        "line-gray": v("border-gray"),
        skeleton: v("skeleton"),
        "purple-text": v("purple"),
        "reader-highlight": v("reader-highlight"),
        "reader-highlight-text": v("reader-highlight-text"),
        "reader-panel": v("reader-panel"),
        "reader-panel-border": v("reader-panel-border"),
        "reader-paper": v("reader-paper"),
        "reader-paper-text": v("reader-paper-text"),
        // Fixed (non-themed) dark text for use on fixed light surfaces (yellow banners, etc.)
        ink: "#212121",
        "ink-body": "#616161",
        black: "#212121",
        "bg-light": "#FFFCFBFB",
        bgLight: "#FFFCFBFB",
        light: "#FAF42",
        disabled: "#FF8771",
        purple: "#866EFF",
        "border-light": "#E0E0E0",
        "border-lighter": "#FAF4F2",
        blue: "#4807EC",
        yellow: "#ECC607",
        "purple-light": "#D1C8FF",
      },
    },
  },
  plugins: [],
};
