'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setPct(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gold"
        style={{ width: `${pct}%`, transition: 'width 80ms linear' }}
      />
    </div>
  )
}
