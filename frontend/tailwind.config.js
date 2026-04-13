/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: ["SFMono-Regular", "ui-monospace", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ScoreX extended palette
        stripe: {
          purple: "var(--stripe-purple)",
          "purple-hover": "var(--stripe-purple-hover)",
          "purple-deep": "var(--stripe-purple-deep)",
          "purple-light": "var(--stripe-purple-light)",
          "purple-mid": "var(--stripe-purple-mid)",
        },
        navy: {
          DEFAULT: "var(--deep-navy)",
          dark: "var(--dark-navy)",
        },
        brand: {
          dark: "var(--brand-dark)",
        },
        ruby: "var(--ruby)",
        magenta: {
          DEFAULT: "var(--magenta)",
          light: "var(--magenta-light)",
        },
        success: {
          DEFAULT: "var(--success)",
          text: "var(--success-text)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "stripe-1": "var(--shadow-level-1)",
        "stripe-2": "var(--shadow-level-2)",
        "stripe-3": "var(--shadow-level-3)",
        "stripe-4": "var(--shadow-level-4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}