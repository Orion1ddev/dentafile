import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        border: 'rgb(var(--primary) / 0.2)',
        input: 'rgb(var(--primary) / 0.2)',
        ring: 'rgb(var(--primary) / 0.5)',
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--text))',
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          foreground: 'rgb(var(--background))'
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary))',
          foreground: 'rgb(var(--text))'
        },
        destructive: {
          DEFAULT: 'rgb(220 38 38)',
          foreground: 'rgb(var(--background))'
        },
        muted: {
          DEFAULT: 'rgb(var(--secondary))',
          foreground: 'rgb(var(--text) / 0.7)'
        },
        accent: {
          DEFAULT: 'rgb(var(--accent))',
          foreground: 'rgb(var(--background))'
        },
        popover: {
          DEFAULT: 'rgb(var(--background))',
          foreground: 'rgb(var(--text))'
        },
        card: {
          DEFAULT: 'rgb(var(--background))',
          foreground: 'rgb(var(--text))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        fall: {
          '0%': { 
            transform: 'translateY(-100vh) rotate(0deg)',
            opacity: '0'
          },
          '50%': {
            opacity: '0.5'
          },
          '100%': { 
            transform: 'translateY(100vh) rotate(360deg)',
            opacity: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fall': 'fall 20s linear infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;