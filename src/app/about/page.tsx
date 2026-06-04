import NavWrapper from '@/components/NavWrapper'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60
export const metadata: Metadata = { title: 'About — ELIV8 LYF FZE' }

export default async function AboutPage() {
  const supabase = await createClient()

  const [{ data: textRows }, { data: statsData }, { data: whyData }] = await Promise.all([
    (supabase.from('site_text') as any).select('key,value').eq('section', 'about_page'),
    (supabase.from('stats') as any).select('*').order('sort_order'),
    (supabase.from('why_cards') as any).select('*').order('sort_order'),
  ])

  const t: Record<string, string> = {}
  ;(textRows ?? []).forEach((r: { key: string; value: string }) => { t[r.key] = r.value })
  const stats = statsData ?? []
  const why = whyData ?? []

  return (
    <>
      <Cursor />
      <NavWrapper />

      <div className="pt-[120px] px-6 md:px-12 pb-16 md:pb-20 bg-black">
        <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
          <span className="block w-6 h-px bg-gold" />{t.about_page_eyebrow ?? 'Who We Are'}
        </div>
        <h1 className="font-syne font-extrabold text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-cream max-w-3xl">
          {t.about_page_headline ?? 'AI-native consulting for a new era of business'}
        </h1>
      </div>

      <section className="bg-off-black px-6 md:px-12 py-12 md:py-[80px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div>
          {[t.about_page_body_1, t.about_page_body_2, t.about_page_body_3, t.about_page_body_4].filter(Boolean).map((p, i) => (
            <p key={i} className="text-muted leading-[1.8] mb-5 text-[1rem]">{p}</p>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-0.5">
          {stats.map((s: any) => (
            <div key={s.id} className="bg-panel border border-white/[0.07] p-8">
              <div className="font-syne font-extrabold text-[2.8rem] text-gold leading-none mb-2">{s.value_text}</div>
              <div className="text-muted text-[0.82rem]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black px-6 md:px-12 py-12 md:py-[80px]">
        <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
          <span className="block w-6 h-px bg-gold" />{t.about_page_edge_eyebrow ?? 'Our Edge'}
        </div>
        <h2 className="font-syne font-extrabold text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-cream mb-16">
          {t.about_page_edge_headline ?? 'Built different, for complex markets'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {why.map((w: any) => (
            <div key={w.id} className="bg-panel border border-white/[0.07] p-8 md:p-12 flex gap-7">
              <div className="flex-shrink-0 w-[52px] h-[52px] bg-gold-dim border border-gold/30 flex items-center justify-center text-[1.4rem]">{w.icon}</div>
              <div>
                <h3 className="font-syne font-bold text-[1.05rem] mb-2.5 text-cream">{w.title}</h3>
                <p className="text-muted text-[0.86rem] leading-[1.75]">{w.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-gold px-6 md:px-12 py-12 md:py-[80px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-10">
        <div>
          <h2 className="font-syne font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] text-black leading-tight">
            {t.about_page_cta_headline ?? 'Work with us'}
          </h2>
          <p className="text-black/65 mt-3">{t.about_page_cta_subtext ?? ''}</p>
        </div>
        <Link href={t.about_page_cta_button_url ?? '/contact'} className="inline-flex items-center gap-2.5 px-11 py-[18px] bg-black text-gold font-syne font-bold text-[0.95rem] tracking-[0.04em] flex-shrink-0 transition-colors hover:bg-off-black">
          {t.about_page_cta_button_label ?? 'Get in Touch →'}
        </Link>
      </div>

      <Footer />
    </>
  )
}
