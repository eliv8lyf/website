import NavWrapper from '@/components/NavWrapper'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60
export const metadata: Metadata = { title: 'Services — ELIV8 LYF FZE' }

export default async function ServicesPage() {
  const supabase = await createClient()

  const [{ data: textRows }, { data: servicesData }] = await Promise.all([
    (supabase.from('site_text') as any).select('key,value').eq('section', 'services_page'),
    (supabase.from('services') as any).select('*').eq('published', true).order('sort_order'),
  ])

  const t: Record<string, string> = {}
  ;(textRows ?? []).forEach((r: { key: string; value: string }) => { t[r.key] = r.value })
  const services = servicesData ?? []

  return (
    <>
      <Cursor />
      <NavWrapper />

      <div className="pt-[120px] px-6 md:px-12 pb-16 md:pb-20 bg-black">
        <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
          <span className="block w-6 h-px bg-gold" />{t.services_page_eyebrow ?? 'What We Do'}
        </div>
        <h1 className="font-syne font-extrabold text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-cream max-w-3xl">
          {t.services_page_headline ?? 'End-to-end AI consulting services'}
        </h1>
        <p className="text-muted text-[1.05rem] leading-[1.7] max-w-[560px] mt-6">
          {t.services_page_subtext ?? ''}
        </p>
      </div>

      <div className="bg-off-black">
        {services.map((s: any, i: number) => (
          <div key={s.id} className={`px-6 md:px-12 py-12 md:py-[80px] border-b border-white/[0.07] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start ${i % 2 === 1 ? 'bg-black' : ''}`}>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 border border-white/[0.07] flex items-center justify-center text-[1.4rem] bg-gold-dim">{s.icon}</div>
                <span className="font-syne text-[0.7rem] text-gold/50 tracking-[0.1em]">{s.num}</span>
              </div>
              <h2 className="font-syne font-bold text-[1.8rem] text-cream mb-5 leading-tight">{s.title}</h2>
              <p className="text-muted text-[0.9rem] leading-[1.8]">{s.description}</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {(s.tags ?? []).map((tag: string) => (
                  <span key={tag} className="px-3 py-1 border border-white/[0.07] text-[0.7rem] tracking-[0.08em] text-muted uppercase">{tag}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[0.7rem] tracking-[0.12em] uppercase text-gold mb-4">Key Deliverables</div>
              <ul className="space-y-3">
                {(s.deliverables ?? []).map((d: string) => (
                  <li key={d} className="flex items-start gap-3 text-muted text-[0.88rem] leading-[1.6]">
                    <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0 mt-2" />{d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gold px-6 md:px-12 py-12 md:py-[80px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-10">
        <div>
          <h2 className="font-syne font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] text-black leading-tight">
            {t.services_page_cta_headline ?? 'Ready to get started?'}
          </h2>
          <p className="text-black/65 mt-3">{t.services_page_cta_subtext ?? ''}</p>
        </div>
        <Link href={t.services_page_cta_button_url ?? '/contact'} className="inline-flex items-center gap-2.5 px-11 py-[18px] bg-black text-gold font-syne font-bold text-[0.95rem] tracking-[0.04em] flex-shrink-0 transition-colors hover:bg-off-black">
          {t.services_page_cta_button_label ?? 'Book a Consultation →'}
        </Link>
      </div>

      <Footer />
    </>
  )
}
