'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type NavItem = { id: string; label: string; url: string; sort_order: number; is_cta: boolean; published: boolean }

const EMPTY = { label: '', url: '', sort_order: 0, is_cta: false, published: true }

export default function NavPage() {
  const [items, setItems] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<NavItem | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const sb = createClient()
    const { data } = await (sb.from('nav_items') as any).select('*').order('sort_order')
    setItems(data ?? [])
    setLoading(false)
  }

  function openNew() { setEditing(null); setForm(EMPTY); setShowForm(true) }
  function openEdit(item: NavItem) { setEditing(item); setForm({ label: item.label, url: item.url, sort_order: item.sort_order, is_cta: item.is_cta, published: item.published }); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditing(null); setForm(EMPTY) }

  async function handleSave() {
    if (!form.label.trim() || !form.url.trim()) return
    setSaving(true)
    const sb = createClient()
    const payload = { label: form.label.trim(), url: form.url.trim(), sort_order: Number(form.sort_order) || 0, is_cta: form.is_cta, published: form.published }
    if (editing) await (sb.from('nav_items') as any).update(payload).eq('id', editing.id)
    else await (sb.from('nav_items') as any).insert(payload)
    setSaving(false); closeForm(); load()
  }

  async function handleDelete(id: string) {
    await (createClient().from('nav_items') as any).delete().eq('id', id)
    setDeleteId(null); load()
  }

  const inputCls = 'w-full bg-[#0c0d10] border border-white/[0.07] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50'
  const labelCls = 'block text-white/40 text-xs tracking-widest uppercase mb-2'

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Navigation</h1>
        <button onClick={openNew} className="px-5 py-2.5 bg-[#c9a84c] text-black text-sm font-bold tracking-widest hover:bg-[#e8c96a] transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
          + Add Link
        </button>
      </div>

      <p className="text-white/30 text-xs mb-6">Changes here update the site navigation. Mark one item as CTA to show the gold button in the top-right. Sort order controls left-to-right sequence.</p>

      <div className="bg-[#111318] border border-white/[0.07]">
        {loading ? <div className="px-6 py-10 text-white/30 text-sm">Loading…</div>
        : items.length === 0 ? <div className="px-6 py-10 text-white/30 text-sm">No nav items yet.</div>
        : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Label', 'URL', 'Order', 'CTA Button', 'Published', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-white/30 text-xs tracking-widest uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-6 py-3 text-white font-medium">{item.label}</td>
                  <td className="px-6 py-3 text-white/40 font-mono text-xs">{item.url}</td>
                  <td className="px-6 py-3 text-white/30 text-xs">{item.sort_order}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-sm ${item.is_cta ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'bg-white/[0.06] text-white/30'}`}>
                      {item.is_cta ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-sm ${item.published ? 'bg-green-900/30 text-green-400' : 'bg-white/[0.06] text-white/40'}`}>
                      {item.published ? 'Live' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-4">
                      <button onClick={() => openEdit(item)} className="text-xs text-white/40 hover:text-white transition-colors">Edit</button>
                      <button onClick={() => setDeleteId(item.id)} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#111318] border border-white/[0.07] w-full max-w-md">
            <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.07]">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{editing ? 'Edit Link' : 'New Link'}</h2>
              <button onClick={closeForm} className="text-white/30 hover:text-white text-lg">✕</button>
            </div>
            <div className="px-7 py-6 flex flex-col gap-5">
              <div><label className={labelCls}>Label *</label><input value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className={inputCls} placeholder="e.g. About" /></div>
              <div><label className={labelCls}>URL *</label><input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} className={inputCls} placeholder="e.g. /#about or /services" /></div>
              <div><label className={labelCls}>Sort Order (lower = first)</label><input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className={inputCls} /></div>
              <label className="flex items-center gap-3"><input type="checkbox" checked={form.is_cta} onChange={e => setForm(f => ({ ...f, is_cta: e.target.checked }))} className="w-4 h-4 accent-[#c9a84c]" /><span className="text-white/60 text-sm">Show as CTA button (gold, top-right)</span></label>
              <label className="flex items-center gap-3"><input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 accent-[#c9a84c]" /><span className="text-white/60 text-sm">Published (visible in nav)</span></label>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#c9a84c] text-black text-sm font-bold tracking-widest hover:bg-[#e8c96a] transition-colors disabled:opacity-50" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Link'}
                </button>
                <button onClick={closeForm} className="px-6 py-2.5 bg-white/[0.06] text-white/60 text-sm hover:bg-white/[0.1] transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#111318] border border-white/[0.07] w-full max-w-sm p-8">
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Remove nav link?</h2>
            <p className="text-white/40 text-sm mb-7">It will disappear from the site navigation immediately.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="px-6 py-2.5 bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition-colors">Remove</button>
              <button onClick={() => setDeleteId(null)} className="px-6 py-2.5 bg-white/[0.06] text-white/60 text-sm hover:bg-white/[0.1] transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
