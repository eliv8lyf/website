'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const LINKS = [
  ['About', '/#about'],
  ['Services', '/services'],
  ['AI in Action', '/#showcase'],
  ['Blog', '/blog'],
  ['Contact', '/contact'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 md:py-7 backdrop-blur-md transition-all duration-400 ${
          scrolled || open ? 'border-b border-white/[0.07] bg-black/95' : 'border-b border-transparent'
        }`}
      >
        <Link href="/" className="font-syne font-extrabold text-[1.4rem] tracking-widest text-cream relative z-50" onClick={() => setOpen(false)}>
          ELIV<span className="text-gold">8</span> LYF
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-10 list-none">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <Link href={href} className="text-muted text-[0.85rem] tracking-[0.06em] font-normal transition-colors hover:text-cream">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="hidden md:inline-flex px-6 py-2.5 border border-gold text-gold font-syne font-semibold text-[0.82rem] tracking-widest transition-colors hover:bg-gold hover:text-black"
        >
          Get Started →
        </Link>

        {/* Hamburger — must be z-50 to sit above drawer */}
        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          className="md:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-[5px] bg-transparent border-0 outline-none cursor-pointer"
        >
          <span className={`block w-6 h-px bg-cream transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`block w-6 h-px bg-cream transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-6 h-px bg-cream transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer — outside <nav> so it has its own stacking context */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black flex flex-col px-8 pt-28 pb-10 gap-6 overflow-y-auto">
          {LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="font-syne font-bold text-[2rem] text-cream tracking-[-0.01em] hover:text-gold transition-colors border-b border-white/[0.06] pb-6"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex w-fit px-8 py-4 bg-gold text-black font-syne font-bold text-[0.9rem] tracking-widest"
          >
            Get Started →
          </Link>
        </div>
      )}
    </>
  )
}
