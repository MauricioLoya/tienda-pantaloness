import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/[locales]/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)'
      }
    }
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#023d79',
          secondary: '#1d1d1b',
          accent: '#023d79',
          neutral: '#1d1d1b',
          'base-100': '#ffffff',
          info: '#023d79',
          success: '#1d1d1b',
          warning: '#d4af37',
          error: '#ff0000'
        }
      }
    ]
  },
  plugins: [daisyui]
} satisfies Config
