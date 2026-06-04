import NavWrapper from '@/components/NavWrapper'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import ContactForm from '@/components/ContactForm'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getPageSeo, SITE_URL } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('contact')
  const title = seo.title ?? 'Contact'
  const description = seo.description ?? "Let's talk about your AI opportunity. Get in touch with the ELIV8 LYF FZE team."
  return {
    title,
    description,
    openGraph: {
      title: seo.title ?? 'Contact — ELIV8 LYF FZE',
      description,
      url: `${SITE_URL}/contact`,
      ...(seo.ogImage ? { images: [{ url: seo.ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: { title, description },
  }
}

export default async function ContactPage() {
  const supabase = await createClient()
  const { data: textRows } = await (supabase.from('site_text') as any)
    .select('key,value')
    .eq('section', 'contact_page')

  const t: Record<string, string> = {}
  ;(textRows ?? []).forEach((r: { key: string; value: string }) => { t[r.key] = r.value })

  const infoItems = [
    { icon: '📍', key: 'office', label: t.contact_office_label ?? 'Registered Office', value: t.contact_office_value ?? 'UAE Free Zone (FZE)\nUnited Arab Emirates' },
    { icon: '✉️', key: 'email', label: t.contact_email_label ?? 'Email', value: t.contact_email_value ?? 'connect@eliv8lyf.com' },
    { icon: '🌐', key: 'ops', label: t.contact_operations_label ?? 'Operations', value: t.contact_operations_value ?? 'Middle East · Africa · Global' },
  ]

  return (
    <>
      <Cursor />
      <NavWrapper />

      <section className="bg-black pt-[120px] px-6 md:px-12 pb-20 md:pb-[120px]">
        <div className="max-w-[1100px] mx-auto">
          <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
            <span className="block w-6 h-px bg-gold" />{t.contact_page_eyebrow ?? 'Get In Touch'}
          </div>
          <h1 className="font-syne font-extrabold text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-cream max-w-3xl mb-12 md:mb-16">
            {t.contact_page_headline ?? "Let's talk about your AI opportunity"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
            <div>
              <p className="text-muted leading-[1.8] mb-10">
                {t.contact_page_subtext ?? ''}
              </p>
              {infoItems.map(item => (
                <div key={item.key} className="flex gap-5 items-start mb-7">
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
