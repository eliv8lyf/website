'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

interface Props {
  headings: Heading[]
  variant?: 'inline' | 'sidebar'
}

export default function TableOfContents({ headings, variant = 'inline' }: Props) {
  const [activeId, setActiveId] = useState('')
  const [open, setOpen] = useState(variant === 'sidebar')

  useEffect(() => {
    if (!headings.length) return
    const observer = new IntersectionObserver(
      entries => {
        const hit = entries.find(e => e.isIntersecting)
        if (hit) setActiveId(hit.target.id)
      },
      { rootMargin: '-80px 0px -65% 0px' }
    )
    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  const isSidebar = variant === 'sidebar'

  return (
    <div className={isSidebar ? '' : 'mb-10 border border-white/[0.07] bg-[#0c0d10]'}>
      {!isSidebar && (
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center justify-between px-5 py-4 text-left"
        >
          <span className="text-cream font-syne font-semibold text-[0.82rem] tracking-[0.1em] uppercase">
            Contents
          </span>
          <span className={`text-muted transition-transform duration-200 text-lg leading-none ${open ? '-rotate-180' : ''}`}>
            ⌄
          </span>
        </button>
      )}

      {isSidebar && (
        <p className="text-[0.7rem] tracking-[0.15em] uppercase text-muted mb-4 font-medium">On this page</p>
      )}

      {(open || isSidebar) && (
        <nav className={isSidebar ? 'flex flex-col gap-2' : 'px-5 pb-5 flex flex-col gap-2'}>
          {headings.map(h => (
            <a
              key={h.id}
              href={`#${h.id}`}
              onClick={() => !isSidebar && setOpen(false)}
              className={`text-[0.8rem] leading-[1.5] transition-colors hover:text-gold ${
                h.level === 3 ? 'pl-3 border-l border-white/[0.07]' : ''
              } ${activeId === h.id ? 'text-gold' : 'text-muted'}`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  )
}
