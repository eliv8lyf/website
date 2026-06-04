'use client'

import { useState } from 'react'
import type { Showcase } from '@/lib/supabase/types'

type FilterTab = 'all' | Showcase['category']

const TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'app', label: 'Apps' },
  { value: 'generative_media', label: 'Generative Media' },
  { value: 'agent', label: 'Agents' },
]

const CATEGORY_LABEL: Record<Showcase['category'], string> = {
  app: 'App',
  generative_media: 'Generative Media',
  agent: 'Agent',
}

function ShowcaseCard({ showcase }: { showcase: Showcase }) {
  return (
    <div className="bg-panel border border-white/[0.07] transition-all hover:bg-gold-dim hover:border-gold/40 group flex flex-col">
      <div className="relative w-full aspect-video overflow-hidden bg-[#0c0d10] border-b border-white/[0.07]">
        {showcase.media_url ? (
          showcase.media_type === 'video' ? (
            <video
              src={showcase.media_url}
              className="w-full h-full object-cover"
              muted
              playsInline
              loop
              onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play()}
              onMouseLeave={e => (e.currentTarget as HTMLVideoElement).pause()}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={showcase.media_url} alt={showcase.title} className="w-full h-full object-cover" />
          )
        ) : (
          <div className="w-full h-full bg-gold/[0.08] flex items-center justify-center">
            <span className="text-gold/30 text-[0.7rem] tracking-[0.15em] uppercase">No Preview</span>
          </div>
        )}
      </div>

      <div className="p-9 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="font-syne font-bold text-[1.05rem] text-cream group-hover:text-gold transition-colors leading-snug">
            {showcase.title}
          </h3>
          <span className="flex-shrink-0 px-3 py-1 border border-white/[0.07] text-[0.7rem] tracking-[0.08em] text-muted uppercase">
            {CATEGORY_LABEL[showcase.category]}
          </span>
        </div>

        <p className="text-muted text-[0.86rem] leading-[1.75] flex-1">{showcase.description}</p>

        {showcase.tags && showcase.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {showcase.tags.map(tag => (
              <span key={tag} className="px-3 py-1 border border-white/[0.07] text-[0.7rem] tracking-[0.08em] text-muted uppercase">
                {tag}
              </span>
            ))}
          </div>
        )}

        {showcase.url && (
          <a
            href={showcase.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-6 text-gold text-[0.82rem] font-medium tracking-[0.05em] hover:text-gold/70 transition-colors"
          >
            View →
          </a>
        )}
      </div>
    </div>
  )
}

export default function ShowcaseGrid({ showcases }: { showcases: Showcase[] }) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const filtered = activeTab === 'all'
    ? showcases
    : showcases.filter(s => s.category === activeTab)

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-10 mb-10">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-5 py-2 text-[0.78rem] tracking-[0.08em] uppercase font-medium transition-all border ${
              activeTab === tab.value
                ? 'bg-gold text-black border-gold'
                : 'border-white/[0.07] text-muted hover:border-gold/40 hover:text-cream'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center text-muted text-[0.9rem]">
          Coming soon — check back shortly.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {filtered.map(s => (
            <ShowcaseCard key={s.id} showcase={s} />
          ))}
        </div>
      )}
    </>
  )
}
