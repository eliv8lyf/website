import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import ContactForm from '@/components/ContactForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact — ELIV8 LYF FZE' }

export default function ContactPage() {
  return (
    <>
      <Cursor />
      <Nav />

      <section className="bg-black pt-[120px] px-6 md:px-12 pb-20 md:pb-[120px]">
        <div className="max-w-[1100px] mx-auto">
        <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
          <span className="block w-6 h-px bg-gold" />Get In Touch
        </div>
        <h1 className="font-syne font-extrabold text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-cream max-w-3xl mb-12 md:mb-16">
          Let&apos;s talk about your AI opportunity
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <p className="text-muted leading-[1.8] mb-10">
              Whether you have a specific project in mind or are just beginning to explore what AI can do for your organisation — we&apos;re here to help you think it through.
            </p>
            {[
              { icon: '📍', label: 'Registered Office', value: 'UAE Free Zone (FZE)\nUnited Arab Emirates' },
              { icon: '✉️', label: 'Email', value: 'connect@eliv8lyf.com' },
              { icon: '🌐', label: 'Operations', value: 'Middle East · Africa · Global' },
            ].map(item => (
              <div key={item.label} className="flex gap-5 items-start mb-7">
                <div className="w-10 h-10 flex-shrink-0 border border-white/[0.07] flex items-center justify-center text-[1rem] bg-panel">{item.icon}</div>
                <div>
                  <div className="text-[0.7rem] tracking-[0.12em] text-gold uppercase mb-1">{item.label}</div>
                  <div className="text-cream text-[0.9rem] whitespace-pre-line">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <ContactForm />
        </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
