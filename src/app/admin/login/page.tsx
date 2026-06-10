'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  const inputCls = 'bg-[#0c0d10] border border-white/[0.1] text-white placeholder:text-white/25 px-4 py-3 text-sm outline-none w-full transition-colors focus:border-[#c9a84c]'

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="font-bold text-2xl tracking-widest text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
            ELIV<span className="text-[#c9a84c]">8</span> LYF
          </div>
          <div className="text-white/40 text-xs tracking-widest uppercase">Admin Portal</div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest text-white/40 uppercase">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputCls} placeholder="admin@eliv8lyf.com" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs tracking-widest text-white/40 uppercase">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className={inputCls} placeholder="••••••••" />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/40 text-white/80 px-4 py-3 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#c9a84c] text-black font-bold text-sm tracking-widest uppercase disabled:opacity-60 hover:bg-[#e8c96a] transition-colors"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
