import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        black: '#050608',
        'off-black': '#0c0d10',
        panel: '#111318',
        gold: '#c9a84c',
        'gold-light': '#e8c96a',
        'gold-dim': 'rgba(201,168,76,0.15)',
        cream: '#f0ede8',
        muted: 'rgba(240,237,232,0.45)',
        accent: '#1a6b5a',
        'accent-bright': '#23917a',
        border: 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        'scroll-pulse': 'scrollPulse 2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        scrollPulse: {
          '0%,100%': { opacity: '0.3', transform: 'scaleY(1)' },
          '50%': { opacity: '1', transform: 'scaleY(1.1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
