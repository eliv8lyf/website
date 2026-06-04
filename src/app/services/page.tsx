import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Services — ELIV8 LYF FZE' }

const SERVICES = [
  {
    num: '01', icon: '🧭', title: 'AI Strategy & Roadmapping',
    desc: 'We begin with a deep diagnostic of your business — understanding your processes, data maturity, team capabilities, and competitive dynamics. From this foundation we construct a prioritised AI roadmap with clear business cases, ROI projections, and phased delivery milestones.',
    deliverables: ['AI Opportunity Assessment', 'Phased Transformation Roadmap', 'ROI & Business Case Modelling', 'Executive & Board Presentation', 'Vendor & Technology Evaluation'],
    tags: ['Opportunity Assessment', 'ROI Modelling', 'Board Presentations'],
  },
  {
    num: '02', icon: '⚙️', title: 'AI Implementation & Integration',
    desc: 'We move from strategy to working systems. Our engineers deploy LLMs, ML pipelines, and intelligent APIs — production-hardened, monitored, and integrated with your existing infrastructure. We work in your cloud or ours.',
    deliverables: ['LLM & Foundation Model Deployment', 'API & System Integration', 'MLOps Pipeline Setup', 'Model Fine-tuning & Evaluation', 'Monitoring & Observability'],
    tags: ['LLM Deployment', 'API Integration', 'MLOps'],
  },
  {
    num: '03', icon: '🤖', title: 'Intelligent Process Automation',
    desc: 'We map and redesign your workflows for AI — replacing manual, error-prone tasks with intelligent automation that learns, adapts, and scales. From document processing to customer-facing chatbots to back-office reconciliation.',
    deliverables: ['Process Discovery & Mapping', 'RPA + AI Hybrid Workflows', 'Document Intelligence (OCR, NLP)', 'Chatbot & Agent Deployment', 'Change Management Support'],
    tags: ['RPA + AI', 'Document AI', 'Workflow Design'],
  },
  {
    num: '04', icon: '📊', title: 'Data Intelligence & Analytics',
    desc: 'Your data is your competitive moat — if you can access and interpret it. We build the pipelines, warehouses, and predictive models that turn raw data into decisions. We deliver dashboards that surface what matters to who matters.',
    deliverables: ['Data Audit & Strategy', 'Data Pipeline Engineering', 'Predictive & Prescriptive Models', 'Executive BI Dashboards', 'Data Quality & Governance'],
    tags: ['Predictive Analytics', 'Data Engineering', 'BI Dashboards'],
  },
  {
    num: '05', icon: '🎓', title: 'AI Training & Workforce Upskilling',
    desc: 'Technology only succeeds when your people can use it. We design and deliver bespoke training — from executive briefings to hands-on technical workshops — that build lasting AI capability across your organisation.',
    deliverables: ['Executive AI Literacy Workshops', 'Technical Bootcamps (Python, ML, LLMs)', 'Prompt Engineering Masterclasses', 'AI Tool Adoption Programmes', 'Internal AI Champion Coaching'],
    tags: ['Executive Workshops', 'Technical Bootcamps', 'Change Management'],
  },
  {
    num: '06', icon: '🛡️', title: 'AI Governance & Compliance',
    desc: 'AI without governance is a liability. We help you implement responsible AI frameworks, navigate UAE and international regulations, conduct bias audits, and build the policies that protect your organisation and your customers.',
    deliverables: ['AI Risk & Bias Assessment', 'Responsible AI Policy Design', 'Regulatory Compliance Mapping (UAE, EU AI Act)', 'Data Privacy Framework', 'AI Ethics Board Support'],
    tags: ['Risk Assessment', 'Policy Design', 'Regulatory Mapping'],
  },
]

export default function ServicesPage() {
  return (
    <>
      <Cursor />
      <Nav />

      <div className="pt-[120px] px-6 md:px-12 pb-16 md:pb-20 bg-black">
        <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
          <span className="block w-6 h-px bg-gold" />What We Do
        </div>
        <h1 className="font-syne font-extrabold text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-cream max-w-3xl">
          End-to-end AI consulting services
        </h1>
        <p className="text-muted text-[1.05rem] leading-[1.7] max-w-[560px] mt-6">
          We cover every stage of your AI journey — from the first strategy conversation to production systems running at scale.
        </p>
      </div>

      <div className="bg-off-black">
        {SERVICES.map((s, i) => (
          <div
            key={s.num}
            className={`px-6 md:px-12 py-12 md:py-[80px] border-b border-white/[0.07] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start ${i % 2 === 1 ? 'bg-black' : ''}`}
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 border border-white/[0.07] flex items-center justify-center text-[1.4rem] bg-gold-dim">{s.icon}</div>
                <span className="font-syne text-[0.7rem] text-muted tracking-[0.1em]">{s.num}</span>
              </div>
              <h2 className="font-syne font-bold text-[1.8rem] text-cream mb-5 leading-tight">{s.title}</h2>
              <p className="text-muted text-[0.9rem] leading-[1.8]">{s.desc}</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {s.tags.map(t => (
                  <span key={t} className="px-3 py-1 border border-white/[0.07] text-[0.7rem] tracking-[0.08em] text-muted uppercase">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[0.7rem] tracking-[0.12em] uppercase text-gold mb-4">Key Deliverables</div>
              <ul className="space-y-3">
                {s.deliverables.map(d => (
                  <li key={d} className="flex items-start gap-3 text-muted text-[0.88rem] leading-[1.6]">
                    <span className="w-1 h-1 rounded-full bg-gold flex-shrink-0 mt-2" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gold px-6 md:px-12 py-12 md:py-[80px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-10">
        <div>
          <h2 className="font-syne font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] text-black leading-tight">Ready to get started?</h2>
          <p className="text-black/65 mt-3">Tell us about your challenge — we&apos;ll help you find the right approach.</p>
        </div>
        <Link href="/contact" className="inline-flex items-center gap-2.5 px-11 py-[18px] bg-black text-gold font-syne font-bold text-[0.95rem] tracking-[0.04em] flex-shrink-0 transition-colors hover:bg-off-black">
          Book a Consultation →
        </Link>
      </div>

      <Footer />
    </>
  )
}
