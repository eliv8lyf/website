'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Category } from '@/lib/supabase/types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await createClient().from('categories').select('*').order('name')
    setCategories(data ?? [])
  }

  function handleNameChange(v: string) {
    setName(v)
    setSlug(slugify(v))
  }

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const safeSlug = slugify(slug || name)
    if (!name || !safeSlug) { setError('Name and slug required.'); setSaving(false); return }

    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase.from('categories') as any).insert({ name, slug: safeSlug })
    if (err) { setError(err.message); setSaving(false); return }
    setName('')
    setSlug('')
    setSaving(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this category? Posts in this category will lose their category.')) return
    await createClient().from('categories').delete().eq('id', id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  const inputCls = 'bg-[#0c0d10] border border-white/[0.1] text-white placeholder:text-white/25 px-4 py-3 text-sm outline-none transition-colors focus:border-[#c9a84c]'

  return (
    <div className="p-10 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>Categories</h1>

      <form onSubmit={create} className="flex gap-3 mb-10">
        <input value={name} onChange={e => handleNameChange(e.target.value)} className={`${inputCls} flex-1`} placeholder="Category name" />
        <input value={slug} onChange={e => setSlug(slugify(e.target.value))} className={`${inputCls} w-48`} placeholder="slug" />
        <button type="submit" disabled={saving} className="px-5 py-3 bg-[#c9a84c] text-black text-sm font-bold tracking-widest hover:bg-[#e8c96a] transition-colors disabled:opacity-40" style={{ fontFamily: 'Syne, sans-serif' }}>
          Add
        </button>
      </form>

      {error && <div className="bg-red-900/20 border border-red-500/40 text-white/80 px-4 py-3 text-sm mb-6">{error}</div>}

      <div className="bg-[#111318] border border-white/[0.07]">
        {categories.length === 0 ? (
          <div className="px-6 py-10 text-white/30 text-sm">No categories yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Name', 'Slug', ''].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-white/30 text-xs tracking-widest uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-6 py-3 text-white">{cat.name}</td>
                  <td className="px-6 py-3 text-white/40 font-mono text-xs">{cat.slug}</td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => remove(cat.id)} className="text-xs text-red-400/40 hover:text-red-400 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
