import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ELIV8 LYF FZE — AI Consulting',
  description:
    'ELIV8 LYF FZE partners with forward-thinking organisations to deploy AI strategies that drive measurable outcomes.',
  keywords: ['AI consulting', 'UAE', 'machine learning', 'enterprise AI', 'Africa', 'Middle East'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
