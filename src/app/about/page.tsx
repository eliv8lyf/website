import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About — ELIV8 LYF FZE' }

export default function AboutPage() {
  return (
    <>
      <Cursor />
      <Nav />

      <div className="pt-[120px] px-6 md:px-12 pb-16 md:pb-20 bg-black">
        <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
          <span className="block w-6 h-px bg-gold" />Who We Are
        </div>
        <h1 className="font-syne font-extrabold text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-cream max-w-3xl">
          AI-native consulting for a new era of business
        </h1>
      </div>

      <section className="bg-off-black px-6 md:px-12 py-12 md:py-[80px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div>
          <p className="text-muted leading-[1.8] mb-5 text-[1rem]">
            <strong className="text-cream font-medium">ELIV8 LYF FZE</strong> is an AI consulting firm incorporated in the UAE Free Zone, purpose-built to serve ambitious organisations across emerging and established markets.
          </p>
          <p className="text-muted leading-[1.8] mb-5">
            We go beyond the buzzwords — delivering concrete AI roadmaps, production-ready systems, and the capability-building your teams need to sustain competitive advantage in an AI-first world.
          </p>
          <p className="text-muted leading-[1.8] mb-5">
            Our consultants have shipped real AI systems at scale across financial services, healthcare, government, and retail sectors. We build what we recommend — no middlemen, no vague strategy decks.
          </p>
          <p className="text-muted leading-[1.8]">
            Whether you&apos;re beginning your AI journey or scaling an existing function, we bring the architecture, expertise, and market sensitivity to make it real.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-0.5">
          {[
            { num: '50+', label: 'AI Projects Delivered' },
            { num: '12+', label: 'Industry Sectors' },
            { num: 'UAE', label: 'FZE · Global Operations' },
            { num: '3×', label: 'Avg. ROI for Clients' },
          ].map(s => (
            <div key={s.label} className="bg-panel border border-white/[0.07] p-8">
              <div className="font-syne font-extrabold text-[2.8rem] text-gold leading-none mb-2">{s.num}</div>
              <div className="text-muted text-[0.82rem]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black px-6 md:px-12 py-12 md:py-[80px]">
        <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
          <span className="block w-6 h-px bg-gold" />Our Edge
        </div>
        <h2 className="font-syne font-extrabold text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-cream mb-16">
          Built different, for complex markets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {[
            { icon: '🌍', title: 'Emerging Market Expertise', desc: "We understand the infrastructure, regulatory, and cultural realities of African and Middle Eastern markets — not just Silicon Valley playbooks." },
            { icon: '⚡', title: 'Speed to Value', desc: "No 12-month strategy decks. We move fast — delivering working prototypes and measurable outcomes within weeks, not quarters." },
            { icon: '🔬', title: 'Technical Depth', desc: "Our consultants build what they recommend. No middlemen — just engineers and strategists who've shipped real AI systems at scale." },
            { icon: '🏛️', title: 'UAE FZE Credibility', desc: "Incorporated in the UAE Free Zone — giving clients international contracting capability, regulatory clarity, and institutional confidence." },
          ].map(w => (
            <div key={w.title} className="bg-panel border border-white/[0.07] p-12 flex gap-7">
              <div className="flex-shrink-0 w-[52px] h-[52px] bg-gold-dim border border-gold/30 flex items-center justify-center text-[1.4rem]">{w.icon}</div>
              <div>
                <h3 className="font-syne font-bold text-[1.05rem] mb-2.5 text-cream">{w.title}</h3>
                <p className="text-muted text-[0.86rem] leading-[1.75]">{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-gold px-6 md:px-12 py-12 md:py-[80px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-10">
        <div>
          <h2 className="font-syne font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] text-black leading-tight">Work with us</h2>
          <p className="text-black/65 mt-3">Let&apos;s explore what AI can do for your organisation.</p>
        </div>
        <Link href="/contact" className="inline-flex items-center gap-2.5 px-11 py-[18px] bg-black text-gold font-syne font-bold text-[0.95rem] tracking-[0.04em] flex-shrink-0 transition-colors hover:bg-off-black">
          Get in Touch →
        </Link>
      </div>

      <Footer />
    </>
  )
}
