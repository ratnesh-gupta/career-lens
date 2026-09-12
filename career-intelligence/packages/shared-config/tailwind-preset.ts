import type { Config } from "tailwindcss";

/**
 * Shared Tailwind CSS preset for all CareerLens apps.
 * Extend in each app's tailwind.config.ts:
 *   import preset from "@careerlens/shared-config/tailwind";
 *   export default { presets: [preset], content: [...] } satisfies Config;
 */
const preset: Config = {
  darkMode: ["class"],
  content: [],
  theme: {
    extend: {
      colors: {
        // CSS variable bridge — defined per-app in globals.css
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // CareerLens brand tokens
        brand: {
          50: "hsl(var(--brand-50))",
          100: "hsl(var(--brand-100))",
          200: "hsl(var(--brand-200))",
          500: "hsl(var(--brand-500))",
          600: "hsl(var(--brand-600))",
          700: "hsl(var(--brand-700))",
          900: "hsl(var(--brand-900))",
        },
        score: {
          excellent: "hsl(var(--score-excellent))",
          good: "hsl(var(--score-good))",
          fair: "hsl(var(--score-fair))",
          poor: "hsl(var(--score-poor))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        "score-fill": {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "var(--score-offset)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "score-fill": "score-fill 1.2s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in-right": "slide-in-right 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default preset;
