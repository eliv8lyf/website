'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/showcases', label: 'AI in Action' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-56 min-h-screen bg-[#0c0d10] border-r border-white/[0.07] flex flex-col">
      <div className="px-6 py-6 border-b border-white/[0.07]">
        <div className="font-bold text-lg tracking-widest text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          ELIV<span className="text-[#c9a84c]">8</span>
        </div>
        <div className="text-white/30 text-[0.65rem] tracking-widest uppercase mt-0.5">Admin</div>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {LINKS.map(({ href, label }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2.5 text-sm rounded-sm transition-colors ${active ? 'bg-[#c9a84c]/15 text-[#c9a84c]' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'}`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/[0.07]">
        <button
          onClick={signOut}
          className="w-full px-4 py-2.5 text-sm text-white/40 hover:text-white text-left transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}
