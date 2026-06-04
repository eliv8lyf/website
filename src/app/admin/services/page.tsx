'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Service = { id: string; num: string; icon: string; title: string; description: string; tags: string[] | null; deliverables: string[] | null; sort_order: number; published: boolean }
const EMPTY = { num: '', icon: '', title: '', description: '', tags: '', deliverables: '', sort_order: 0, published: true }

export default function ServicesAdminPage() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await (createClient().from('services') as any).select('*').order('sort_order')
    setItems(data ?? []); setLoading(false)
  }

  function openNew() { setEditing(null); setForm(EMPTY); setShowForm(true) }
  function openEdit(s: Service) {
    setEditing(s)
    setForm({ num: s.num, icon: s.icon, title: s.title, description: s.description, tags: (s.tags ?? []).join(', '), deliverables: (s.deliverables ?? []).join('\n'), sort_order: s.sort_order, published: s.published })
    setShowForm(true)
  }
  function closeForm() { setShowForm(false); setEditing(null); setForm(EMPTY) }

  async function handleSave() {
    if (!form.title.trim()) return
    setSaving(true)
    const sb = createClient()
    const payload = {
      num: form.num.trim(),
      icon: form.icon.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags.trim() ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      deliverables: form.deliverables.trim() ? form.deliverables.split('\n').map(d => d.trim()).filter(Boolean) : [],
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
    }
    if (editing) await (sb.from('services') as any).update(payload).eq('id', editing.id)
    else await (sb.from('services') as any).insert(payload)
    setSaving(false); closeForm(); load()
  }

  async function handleDelete(id: string) {
    await (createClient().from('services') as any).delete().eq('id', id)
    setDeleteId(null); load()
  }

  const inputCls = 'w-full bg-[#0c0d10] border border-white/[0.07] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50'
  const labelCls = 'block text-white/40 text-xs tracking-widest uppercase mb-2'

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Services</h1>
        <button onClick={openNew} className="px-5 py-2.5 bg-[#c9a84c] text-black text-sm font-bold tracking-widest hover:bg-[#e8c96a] transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>+ Add Service</button>
      </div>
      <p className="text-white/30 text-xs mb-6">These appear on the homepage and the Services page. Only published services are shown.</p>

      <div className="bg-[#111318] border border-white/[0.07]">
        {loading ? <div className="px-6 py-10 text-white/30 text-sm">Loading…</div>
        : items.length === 0 ? <div className="px-6 py-10 text-white/30 text-sm">No services yet.</div>
        : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['#', 'Icon', 'Title', 'Tags', 'Order', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-white/30 text-xs tracking-widest uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-white/30 text-xs font-mono">{s.num}</td>
                  <td className="px-4 py-3 text-lg">{s.icon}</td>
                  <td className="px-4 py-3 text-white font-medium">{s.title}</td>
                  <td className="px-4 py-3 text-white/30 text-xs">{(s.tags ?? []).join(', ')}</td>
                  <td className="px-4 py-3 text-white/30 text-xs">{s.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-sm ${s.published ? 'bg-green-900/30 text-green-400' : 'bg-white/[0.06] text-white/40'}`}>{s.published ? 'Live' : 'Draft'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(s)} className="text-xs text-white/40 hover:text-white transition-colors">Edit</button>
                      <button onClick={() => setDeleteId(s.id)} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Delete</button>
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
          <div className="bg-[#111318] border border-white/[0.07] w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.07]">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{editing ? 'Edit Service' : 'New Service'}</h2>
              <button onClick={closeForm} className="text-white/30 hover:text-white text-lg">✕</button>
            </div>
            <div className="px-7 py-6 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Number (e.g. 01)</label><input value={form.num} onChange={e => setForm(f => ({ ...f, num: e.target.value }))} className={inputCls} placeholder="01" /></div>
                <div><label className={labelCls}>Icon (emoji)</label><input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className={inputCls} placeholder="🧭" /></div>
              </div>
              <div><label className={labelCls}>Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} /></div>
              <div><label className={labelCls}>Description *</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className={`${inputCls} resize-none`} /></div>
              <div><label className={labelCls}>Tags (comma-separated)</label><input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className={inputCls} placeholder="Strategy, Roadmap, ROI" /></div>
              <div><label className={labelCls}>Deliverables (one per line)</label><textarea value={form.deliverables} onChange={e => setForm(f => ({ ...f, deliverables: e.target.value }))} rows={5} className={`${inputCls} resize-none`} placeholder={'AI Opportunity Assessment\nPhased Roadmap\nROI Modelling'} /></div>
              <div><label className={labelCls}>Sort Order</label><input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))} className={inputCls} /></div>
              <label className="flex items-center gap-3"><input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} className="w-4 h-4 accent-[#c9a84c]" /><span className="text-white/60 text-sm">Published (visible on site)</span></label>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#c9a84c] text-black text-sm font-bold tracking-widest hover:bg-[#e8c96a] disabled:opacity-50 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
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
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>Delete service?</h2>
            <p className="text-white/40 text-sm mb-7">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="px-6 py-2.5 bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition-colors">Delete</button>
              <button onClick={() => setDeleteId(null)} className="px-6 py-2.5 bg-white/[0.06] text-white/60 text-sm hover:bg-white/[0.1] transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
