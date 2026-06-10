import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Footer() {
  const supabase = await createClient()
  const { data } = await (supabase.from('site_text') as any)
    .select('key, value')
    .eq('section', 'footer')

  const t: Record<string, string> = {}
  ;(data ?? []).forEach((r: { key: string; value: string }) => { t[r.key] = r.value })

  return (
    <footer className="bg-off-black border-t border-white/[0.07] px-6 md:px-12 py-10 md:py-12 flex flex-wrap items-center justify-between gap-6">
      <div className="font-syne font-extrabold text-[1.1rem] text-cream">
        ELIV<span className="text-gold">8</span> LYF{' '}
        <span className="text-muted font-normal text-[0.7rem] ml-2 tracking-widest">FZE</span>
      </div>
      <div className="text-muted text-[0.78rem]">{t.footer_copyright ?? '© 2025 ELIV8 LYF FZE. All rights reserved.'}</div>
      <div className="text-muted text-[0.75rem] tracking-widest">{t.footer_tagline ?? 'Incorporated in the UAE · AI Consulting'}</div>
    </footer>
  )
}
