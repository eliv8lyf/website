'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-7 backdrop-blur-md transition-all duration-400 ${
        scrolled ? 'border-b border-white/[0.07] bg-black/85' : 'border-b border-transparent'
      }`}
    >
      <Link href="/" className="font-syne font-extrabold text-[1.4rem] tracking-widest text-cream">
        ELIV<span className="text-gold">8</span> LYF
      </Link>

      <ul className="hidden md:flex gap-10 list-none">
        {[
          ['About', '/#about'],
          ['Services', '/services'],
          ['AI in Action', '/#showcase'],
          ['Blog', '/blog'],
          ['Contact', '/contact'],
        ].map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="text-muted text-[0.85rem] tracking-[0.06em] font-normal transition-colors hover:text-cream"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className="px-6 py-2.5 border border-gold text-gold font-syne font-semibold text-[0.82rem] tracking-widest transition-colors hover:bg-gold hover:text-black"
      >
        Get Started →
      </Link>
    </nav>
  )
}
