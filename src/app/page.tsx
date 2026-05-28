import dynamic from 'next/dynamic'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MarqueeStrip from '@/components/MarqueeStrip'
import Cursor from '@/components/Cursor'
import Link from 'next/link'
import ShowcaseGrid from '@/components/ShowcaseGrid'
import FadeIn from '@/components/FadeIn'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

const ThreeCanvas = dynamic(() => import('@/components/ThreeCanvas'), { ssr: false })

const SERVICES = [
  {
    num: '01', icon: '🧭', title: 'AI Strategy & Roadmapping',
    desc: 'We audit your current operations, identify high-value AI opportunities, and build a phased transformation roadmap aligned to your commercial objectives.',
    tags: ['Opportunity Assessment', 'ROI Modelling', 'Board Presentations'],
  },
  {
    num: '02', icon: '⚙️', title: 'AI Implementation & Integration',
    desc: 'Production-grade deployment of LLMs, ML pipelines, and automation systems — integrated with your existing tech stack and cloud infrastructure.',
    tags: ['LLM Deployment', 'API Integration', 'MLOps'],
  },
  {
    num: '03', icon: '🤖', title: 'Intelligent Process Automation',
    desc: 'Replace manual, repetitive workflows with AI-powered automation — from document processing to customer service to back-office operations.',
    tags: ['RPA + AI', 'Document AI', 'Workflow Design'],
  },
  {
    num: '04', icon: '📊', title: 'Data Intelligence & Analytics',
    desc: 'Transform raw data into decision-making power. We build data pipelines, predictive models, and executive dashboards that surface what matters.',
    tags: ['Predictive Analytics', 'Data Engineering', 'BI Dashboards'],
  },
  {
    num: '05', icon: '🎓', title: 'AI Training & Workforce Upskilling',
    desc: 'Bespoke training programmes for executive teams, technical staff, and operations — ensuring your people can leverage and sustain AI tools effectively.',
    tags: ['Executive Workshops', 'Technical Bootcamps', 'Change Management'],
  },
  {
    num: '06', icon: '🛡️', title: 'AI Governance & Compliance',
    desc: 'Navigate the evolving AI regulatory landscape — from UAE AI regulations to GDPR-adjacent frameworks — with policies, audits, and ethical AI frameworks.',
    tags: ['Risk Assessment', 'Policy Design', 'Regulatory Mapping'],
  },
]

const SECTORS = [
  { icon: '🏦', name: 'Financial Services', desc: 'Credit scoring, fraud detection, regulatory reporting automation' },
  { icon: '🏥', name: 'Healthcare', desc: 'Clinical AI, patient flow optimisation, diagnostic support' },
  { icon: '🏗️', name: 'Infrastructure & Energy', desc: 'Predictive maintenance, asset management, demand forecasting' },
  { icon: '🛒', name: 'Retail & FMCG', desc: 'Demand planning, personalisation, supply chain AI' },
  { icon: '🏛️', name: 'Government & Public Sector', desc: 'Smart services, policy analytics, citizen experience AI' },
  { icon: '🎓', name: 'Education', desc: 'Adaptive learning, institutional AI, workforce development' },
  { icon: '📡', name: 'Telecoms & Media', desc: 'Churn prediction, content AI, network optimisation' },
  { icon: '🚢', name: 'Logistics & Trade', desc: 'Route optimisation, customs AI, trade intelligence' },
]

export default async function Home() {
  let showcases: any[] = []
  try {
    const supabase = await createClient()
    const { data } = await (supabase.from('showcases') as any)
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
    showcases = data ?? []
  } catch {
    showcases = []
  }

  return (
    <>
      <Cursor />
      <Nav />

      {/* HERO */}
      <section id="hero" className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        <ThreeCanvas />
        <div className="absolute inset-0 z-10" style={{ background: 'radial-gradient(ellipse 60% 80% at 70% 50%, transparent 30%, #050608 100%)' }} />
        <div className="relative z-20 px-6 md:px-12 max-w-[780px]">
          <div className="inline-flex items-center gap-3 text-gold text-[0.75rem] tracking-[0.2em] uppercase mb-8 font-medium">
            <span className="block w-8 h-px bg-gold" />
            AI Consulting · UAE FZE · Global Reach
          </div>
          <h1 className="font-syne font-extrabold text-[clamp(3rem,6vw,5.2rem)] leading-[1.02] tracking-[-0.02em] mb-7 text-cream">
            Elevate Your<br />
            <span className="text-gold">Intelligence.</span>{' '}
            <span className="block" style={{ WebkitTextStroke: '1px rgba(240,237,232,0.4)', color: 'transparent' }}>
              Transform Your Future.
            </span>
          </h1>
          <p className="text-muted text-[1.05rem] leading-[1.7] max-w-[520px] mb-12">
            ELIV8 LYF FZE partners with forward-thinking organisations to deploy AI strategies that drive measurable outcomes — from automation to enterprise transformation.
          </p>
          <div className="flex gap-5 flex-wrap">
            <Link href="/contact" className="inline-flex items-center gap-2.5 px-11 py-[18px] bg-gold text-black font-syne font-bold text-[0.95rem] tracking-[0.04em] shadow-[0_0_32px_rgba(201,168,76,0.25)] transition-all hover:bg-gold-light hover:-translate-y-0.5">
              Book a Consultation →
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2.5 px-8 py-[17px] border border-white/[0.12] text-muted text-[0.85rem] tracking-[0.04em] transition-all hover:border-white/40 hover:text-cream hover:-translate-y-0.5">
              Our Services
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-muted text-[0.7rem] tracking-[0.15em]">
          <div className="w-px h-12 animate-scroll-pulse" style={{ background: 'linear-gradient(to bottom, #c9a84c, transparent)' }} />
          SCROLL
        </div>
      </section>

      <MarqueeStrip />

      {/* ABOUT */}
      <section id="about" className="bg-off-black px-6 md:px-12 py-20 md:py-[120px] grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <FadeIn>
          <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
            <span className="block w-6 h-px bg-gold" />Who We Are
          </div>
          <h2 className="font-syne font-extrabold text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-cream">
            AI-native consulting<br />for a new era of business
          </h2>
          <div className="grid grid-cols-2 gap-0.5 mt-12">
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
        </FadeIn>
        <FadeIn delay={150}>
          <p className="text-muted leading-[1.8] mb-5 text-[1rem]">
            <strong className="text-cream font-medium">ELIV8 LYF FZE</strong> is an AI consulting firm incorporated in the UAE Free Zone, built to serve ambitious organisations across emerging and established markets.
          </p>
          <p className="text-muted leading-[1.8] mb-5">
            We go beyond the buzzwords — delivering concrete AI roadmaps, production-ready systems, and the capability-building your teams need to sustain competitive advantage in an AI-first world.
          </p>
          <p className="text-muted leading-[1.8] mb-8">
            Whether you&apos;re beginning your AI journey or scaling an existing function, we bring the architecture, expertise, and market sensitivity to make it real.
          </p>
          <Link href="/services" className="inline-flex items-center gap-2.5 px-9 py-4 bg-gold text-black font-syne font-bold text-[0.9rem] tracking-[0.04em] transition-all hover:bg-gold-light">
            Explore Services →
          </Link>
        </FadeIn>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-black px-6 md:px-12 py-20 md:py-[120px]">
        <FadeIn className="flex flex-col md:flex-row justify-between md:items-end mb-12 md:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
              <span className="block w-6 h-px bg-gold" />What We Do
            </div>
            <h2 className="font-syne font-extrabold text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-cream">
              End-to-end AI<br />consulting services
            </h2>
          </div>
          <p className="text-muted max-w-[320px] text-[0.9rem] leading-[1.7]">
            From strategy through deployment — we cover the full AI value chain for your organisation.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {SERVICES.map(s => (
            <div
              key={s.num}
              className="bg-panel border border-white/[0.07] p-7 md:p-12 relative overflow-hidden group transition-colors hover:border-gold/30"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold scale-x-0 origin-left transition-transform duration-400 group-hover:scale-x-100" />
              <span className="absolute top-8 right-9 font-syne text-[0.7rem] text-muted tracking-[0.1em]">{s.num}</span>
              <div className="w-12 h-12 border border-white/[0.07] flex items-center justify-center mb-7 text-[1.4rem] bg-gold-dim">{s.icon}</div>
              <h3 className="font-syne font-bold text-[1.2rem] mb-4 text-cream">{s.title}</h3>
              <p className="text-muted text-[0.88rem] leading-[1.75]">{s.desc}</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {s.tags.map(t => (
                  <span key={t} className="px-3 py-1 border border-white/[0.07] text-[0.7rem] tracking-[0.08em] text-muted uppercase">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="bg-off-black px-6 md:px-12 py-20 md:py-[120px]">
        <FadeIn>
        <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
          <span className="block w-6 h-px bg-gold" />How We Work
        </div>
        <h2 className="font-syne font-extrabold text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-cream">
          Our engagement<br />methodology
        </h2>
        </FadeIn>
        <div className="mt-18 flex flex-col">
          {[
            { num: '01', title: 'Discovery & Diagnosis', sub: 'Weeks 1–2', desc: 'We immerse in your business — mapping processes, data assets, team capabilities, and competitive landscape to identify where AI creates the most leverage.' },
            { num: '02', title: 'Strategy & Architecture', sub: 'Weeks 2–4', desc: 'We deliver a clear AI roadmap with prioritised use cases, technical architecture recommendations, vendor assessments, and a business case your board can act on.' },
            { num: '03', title: 'Build & Deploy', sub: 'Ongoing Sprints', desc: 'Agile delivery of AI solutions — from prototype to production. We embed with your team or operate independently, with full transparency at every stage.' },
            { num: '04', title: 'Optimise & Scale', sub: 'Continuous', desc: 'Post-launch, we monitor performance, retrain models, and expand successful pilots — ensuring your AI investment compounds over time.' },
          ].map((step, i, arr) => (
            <div
              key={step.num}
              className={`grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-4 md:gap-12 items-start py-10 md:py-12 border-b border-white/[0.07] ${i === 0 ? 'border-t' : ''}`}
            >
              <div className="font-syne font-extrabold text-[2rem] md:text-[3.5rem] text-white/[0.07] leading-none tracking-[-0.04em]">{step.num}</div>
              <div>
                <div className="font-syne font-bold text-[1.4rem] text-cream mb-2">{step.title}</div>
                <div className="text-gold text-[0.78rem] tracking-[0.1em] uppercase">{step.sub}</div>
              </div>
              <div className="text-muted text-[0.9rem] leading-[1.75]">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section id="why" className="bg-black px-6 md:px-12 py-20 md:py-[120px]">
        <FadeIn>
        <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
          <span className="block w-6 h-px bg-gold" />Why ELIV8 LYF
        </div>
        <h2 className="font-syne font-extrabold text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-cream">
          Built different,<br />for complex markets
        </h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 mt-16">
          {[
            { icon: '🌍', title: 'Emerging Market Expertise', desc: "We understand the infrastructure, regulatory, and cultural realities of African and Middle Eastern markets — not just Silicon Valley playbooks." },
            { icon: '⚡', title: 'Speed to Value', desc: "No 12-month strategy decks. We move fast — delivering working prototypes and measurable outcomes within weeks, not quarters." },
            { icon: '🔬', title: 'Technical Depth', desc: "Our consultants build what they recommend. No middlemen — just engineers and strategists who've shipped real AI systems at scale." },
            { icon: '🏛️', title: 'UAE FZE Credibility', desc: "Incorporated in the UAE Free Zone — giving clients international contracting capability, regulatory clarity, and institutional confidence." },
          ].map(w => (
            <div key={w.title} className="bg-panel border border-white/[0.07] p-7 md:p-12 flex gap-5 md:gap-7">
              <div className="flex-shrink-0 w-13 h-13 bg-gold-dim border border-gold/30 flex items-center justify-center text-[1.4rem] w-[52px] h-[52px]">{w.icon}</div>
              <div>
                <h3 className="font-syne font-bold text-[1.05rem] mb-2.5 text-cream">{w.title}</h3>
                <p className="text-muted text-[0.86rem] leading-[1.75]">{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTORS */}
      <section id="sectors" className="bg-off-black px-6 md:px-12 py-20 md:py-[120px]">
        <FadeIn>
        <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
          <span className="block w-6 h-px bg-gold" />Industries
        </div>
        <h2 className="font-syne font-extrabold text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-cream">Sectors we serve</h2>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 mt-16">
          {SECTORS.map(s => (
            <div key={s.name} className="bg-panel border border-white/[0.07] p-9 transition-all hover:bg-gold-dim hover:border-gold/40 group">
              <span className="text-[2rem] mb-4 block">{s.icon}</span>
              <div className="font-syne font-bold text-[0.95rem] text-cream mb-2 group-hover:text-gold transition-colors">{s.name}</div>
              <div className="text-muted text-[0.78rem] leading-[1.6]">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI IN ACTION */}
      <section id="showcase" className="bg-black px-6 md:px-12 py-20 md:py-[120px]">
        <FadeIn>
        <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
          <span className="block w-6 h-px bg-gold" />AI in Action
        </div>
        <h2 className="font-syne font-extrabold text-[clamp(2rem,4vw,3.4rem)] leading-[1.08] tracking-[-0.02em] text-cream">
          What We&apos;ve Built
        </h2>
        <p className="text-muted text-[0.9rem] leading-[1.7] max-w-[480px] mt-5">
          Real AI products and experiences — apps, agents, and generative media — delivered for our clients.
        </p>
        </FadeIn>
        <ShowcaseGrid showcases={showcases ?? []} />
      </section>

      {/* CTA BAND */}
      <div className="bg-gold px-6 md:px-12 py-16 md:py-[100px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <h2 className="font-syne font-extrabold text-[clamp(2rem,4vw,3rem)] text-black leading-tight">Ready to build your AI advantage?</h2>
          <p className="text-black/65 mt-3 text-[1rem]">Book a no-obligation discovery call with our team.</p>
        </div>
        <Link href="/contact" className="inline-flex items-center gap-2.5 px-11 py-[18px] bg-black text-gold font-syne font-bold text-[0.95rem] tracking-[0.04em] flex-shrink-0 transition-colors hover:bg-off-black">
          Start the Conversation →
        </Link>
      </div>

      <Footer />
    </>
  )
}
