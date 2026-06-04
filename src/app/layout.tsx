import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://eliv8lyf.com'

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ELIV8 LYF FZE',
  url: SITE_URL,
  description: 'AI-native consulting firm specialising in AI strategy, implementation, and transformation across the Middle East, Africa, and globally.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'AE',
    addressRegion: 'UAE Free Zone',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer enquiries',
    email: 'connect@eliv8lyf.com',
  },
  areaServed: ['Middle East', 'Africa', 'Global'],
  knowsAbout: ['Artificial Intelligence', 'Machine Learning', 'Large Language Models', 'AI Strategy', 'Digital Transformation'],
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ELIV8 LYF FZE — AI Consulting',
    template: '%s — ELIV8 LYF FZE',
  },
  description: 'ELIV8 LYF FZE partners with forward-thinking organisations to deploy AI strategies that drive measurable outcomes. Middle East · Africa · Global.',
  keywords: ['AI consulting', 'UAE', 'machine learning', 'enterprise AI', 'Africa', 'Middle East', 'LLM', 'AI strategy', 'digital transformation'],
  openGraph: {
    siteName: 'ELIV8 LYF FZE',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
