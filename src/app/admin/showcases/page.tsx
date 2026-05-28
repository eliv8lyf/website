'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Showcase } from '@/lib/supabase/types'

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'app' as Showcase['category'],
  url: '',
  media_url: '',
  media_type: 'image' as Showcase['media_type'],
  tags: '',
  published: false,
  sort_order: 0,
}

type FormState = typeof EMPTY_FORM

export default function ShowcasesPage() {
  const [showcases, setShowcases] = useState<Showcase[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Showcase | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const supabase = createClient()
    const { data } = await (supabase.from('showcases') as any)
      .select('*')
      .order('sort_order', { ascending: true })
    setShowcases(data ?? [])
    setLoading(false)
  }

  function openNew() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEdit(showcase: Showcase) {
    setEditing(showcase)
    setForm({
      title: showcase.title,
      description: showcase.description,
      category: showcase.category,
      url: showcase.url ?? '',
      media_url: showcase.media_url ?? '',
      media_type: showcase.media_type ?? 'image',
      tags: (showcase.tags ?? []).join(', '),
      published: showcase.published,
      sort_order: showcase.sort_order,
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.description.trim()) return
    setSaving(true)
    const supabase = createClient()
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      url: form.url.trim() || null,
      media_url: form.media_url.trim() || null,
      media_type: form.media_type,
      tags: form.tags.trim()
        ? form.tags.split(',').map(t => t.trim()).filter(Boolean)
        : null,
      published: form.published,
      sort_order: Number(form.sort_order) || 0,
    }

    if (editing) {
      await (supabase.from('showcases') as any)
        .update(payload)
        .eq('id', editing.id)
    } else {
      await (supabase.from('showcases') as any)
        .insert(payload)
    }

    setSaving(false)
    closeForm()
    load()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await (supabase.from('showcases') as any).delete().eq('id', id)
    setDeleteId(null)
    load()
  }

  const categoryLabel: Record<Showcase['category'], string> = {
    app: 'App',
    generative_media: 'Generative Media',
    agent: 'Agent',
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
          Showcases
        </h1>
        <button
          onClick={openNew}
          className="px-5 py-2.5 bg-[#c9a84c] text-black text-sm font-bold tracking-widest hover:bg-[#e8c96a] transition-colors"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          New Showcase
        </button>
      </div>

      {/* List */}
      <div className="bg-[#111318] border border-white/[0.07]">
        {loading ? (
          <div className="px-6 py-10 text-white/30 text-sm">Loading…</div>
        ) : showcases.length === 0 ? (
          <div className="px-6 py-10 text-white/30 text-sm">
            No showcases yet.{' '}
            <button onClick={openNew} className="text-[#c9a84c] hover:underline">
              Create the first one
            </button>
            .
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Title', 'Category', 'Status', 'Order', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-white/30 text-xs tracking-widest uppercase font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {showcases.map(s => (
                <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-6 py-3 text-white font-medium">{s.title}</td>
                  <td className="px-6 py-3 text-white/40 text-xs">{categoryLabel[s.category]}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-sm ${s.published ? 'bg-green-900/30 text-green-400' : 'bg-white/[0.06] text-white/40'}`}>
                      {s.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-white/30 text-xs">{s.sort_order}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-4">
                      <button
                        onClick={() => openEdit(s)}
                        className="text-xs text-white/40 hover:text-white transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#111318] border border-white/[0.07] w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.07]">
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                {editing ? 'Edit Showcase' : 'New Showcase'}
              </h2>
              <button onClick={closeForm} className="text-white/30 hover:text-white text-lg transition-colors">
                ✕
              </button>
            </div>

            <div className="px-7 py-6 flex flex-col gap-5">
              {/* Title */}
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-[#0c0d10] border border-white/[0.07] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                  placeholder="Showcase title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-[#0c0d10] border border-white/[0.07] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50 resize-none"
                  placeholder="Short description"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as Showcase['category'] }))}
                  className="w-full bg-[#0c0d10] border border-white/[0.07] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                >
                  <option value="app">App</option>
                  <option value="generative_media">Generative Media</option>
                  <option value="agent">Agent</option>
                </select>
              </div>

              {/* URL */}
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">URL</label>
                <input
                  value={form.url}
                  onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                  className="w-full bg-[#0c0d10] border border-white/[0.07] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                  placeholder="https://…"
                />
              </div>

              {/* Media URL */}
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">Media URL</label>
                <input
                  value={form.media_url}
                  onChange={e => setForm(f => ({ ...f, media_url: e.target.value }))}
                  className="w-full bg-[#0c0d10] border border-white/[0.07] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                  placeholder="https://…"
                />
              </div>

              {/* Media Type */}
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">Media Type</label>
                <select
                  value={form.media_type}
                  onChange={e => setForm(f => ({ ...f, media_type: e.target.value as Showcase['media_type'] }))}
                  className="w-full bg-[#0c0d10] border border-white/[0.07] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">Tags (comma-separated)</label>
                <input
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                  className="w-full bg-[#0c0d10] border border-white/[0.07] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                  placeholder="e.g. LLM, Automation, Healthcare"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">Sort Order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                  className="w-full bg-[#0c0d10] border border-white/[0.07] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50"
                />
              </div>

              {/* Published */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  className="w-4 h-4 accent-[#c9a84c]"
                />
                <span className="text-white/60 text-sm">Published</span>
              </label>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#c9a84c] text-black text-sm font-bold tracking-widest hover:bg-[#e8c96a] transition-colors disabled:opacity-50"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create'}
                </button>
                <button
                  onClick={closeForm}
                  className="px-6 py-2.5 bg-white/[0.06] text-white/60 text-sm hover:bg-white/[0.1] hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#111318] border border-white/[0.07] w-full max-w-sm p-8">
            <h2 className="text-lg font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
              Delete showcase?
            </h2>
            <p className="text-white/40 text-sm mb-7">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-6 py-2.5 bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="px-6 py-2.5 bg-white/[0.06] text-white/60 text-sm hover:bg-white/[0.1] hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
