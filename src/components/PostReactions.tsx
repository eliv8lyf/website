'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const EMOJIS: { emoji: string; label: string }[] = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💡', label: 'Insightful' },
  { emoji: '👏', label: 'Applause' },
  { emoji: '🤯', label: 'Mind-blown' },
]

export default function PostReactions({ slug }: { slug: string }) {
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [voted, setVoted] = useState<Set<string>>(new Set())
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`rxn_${slug}`)
      if (stored) setVoted(new Set(JSON.parse(stored)))
    } catch {}

    ;(async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('post_reactions')
        .select('emoji')
        .eq('post_slug', slug)

      if (data) {
        const c: Record<string, number> = {}
        data.forEach(r => { c[r.emoji] = (c[r.emoji] ?? 0) + 1 })
        setCounts(c)
      }
      setReady(true)
    })()
  }, [slug])

  const react = async (emoji: string) => {
    if (voted.has(emoji)) return
    const supabase = createClient()
    await supabase.from('post_reactions').insert({ post_slug: slug, emoji })
    const next = new Set(voted)
    next.add(emoji)
    setVoted(next)
    try { localStorage.setItem(`rxn_${slug}`, JSON.stringify(Array.from(next))) } catch {}
    setCounts(prev => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + 1 }))
  }

  return (
    <div className="mt-10 pt-8 border-t border-white/[0.07]">
      <p className="text-muted text-[0.75rem] tracking-[0.12em] uppercase mb-4">How did this land?</p>
      <div className="flex gap-2.5 flex-wrap">
        {EMOJIS.map(({ emoji, label }) => {
          const active = voted.has(emoji)
          const count = counts[emoji] ?? 0
          return (
            <button
              key={emoji}
              onClick={() => react(emoji)}
              title={label}
              className={`flex items-center gap-2 px-4 py-2.5 border text-[0.82rem] transition-all ${
                active
                  ? 'border-gold bg-gold/10 text-gold cursor-default'
                  : 'border-white/10 text-muted hover:border-gold/40 hover:text-cream cursor-pointer'
              }`}
            >
              <span className="text-[1rem]">{emoji}</span>
              {ready && <span className="font-medium tabular-nums">{count}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
