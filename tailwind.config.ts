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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'rgb(var(--background-500))',
        foreground: 'rgb(var(--text-950))',
        primary: {
          DEFAULT: 'rgb(var(--primary-500))',
          foreground: 'rgb(var(--primary-50))'
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary-500))',
          foreground: 'rgb(var(--secondary-50))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'rgb(var(--background-200))',
          foreground: 'rgb(var(--text-500))'
        },
        accent: {
          DEFAULT: 'rgb(var(--accent-500))',
          foreground: 'rgb(var(--accent-50))'
        },
        popover: {
          DEFAULT: 'rgb(var(--background-50))',
          foreground: 'rgb(var(--text-900))'
        },
        card: {
          DEFAULT: 'rgb(var(--background-100))',
          foreground: 'rgb(var(--text-900))'
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