'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type Tab = 'hero' | 'about' | 'process' | 'why' | 'sectors' | 'stats' | 'cta' | 'footer' | 'pages' | 'seo'

const TABS: { id: Tab; label: string }[] = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'stats', label: 'Stats' },
  { id: 'process', label: 'Process' },
  { id: 'why', label: 'Why' },
  { id: 'sectors', label: 'Sectors' },
  { id: 'cta', label: 'CTA Band' },
  { id: 'footer', label: 'Footer' },
  { id: 'pages', label: 'Pages' },
  { id: 'seo', label: 'SEO / AEO' },
]

const inputCls = 'w-full bg-[#0c0d10] border border-white/[0.07] px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50'
const labelCls = 'block text-white/40 text-xs tracking-widest uppercase mb-2'
const sectionHead = 'text-[0.65rem] tracking-widest uppercase text-[#c9a84c] mb-4 mt-2 font-medium'

// Text field editor
function TextField({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className={`${inputCls} resize-y`} />
        : <input value={value} onChange={e => onChange(e.target.value)} className={inputCls} />
      }
    </div>
  )
}

// Simple list item CRUD (for stats, process, why, sectors)
type ListItem = Record<string, string | number>

function ListEditor({ table, fields, emptyItem, title }: {
  table: string
  fields: { key: string; label: string; multiline?: boolean }[]
  emptyItem: ListItem
  title: string
}) {
  const [items, setItems] = useState<(ListItem & { id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<(ListItem & { id: string }) | null>(null)
  const [form, setForm] = useState<ListItem>(emptyItem)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data } = await createClient().from(table as any).select('*').order('sort_order')
    setItems((data ?? []) as unknown as (ListItem & { id: string })[])
    setLoading(false)
  }, [table])

  useEffect(() => { load() }, [load])

  function openNew() { setEditing(null); setForm(emptyItem); setShowForm(true) }
  function openEdit(item: ListItem & { id: string }) { setEditing(item); setForm(Object.fromEntries(fields.map(f => [f.key, item[f.key] ?? '']))); setShowForm(true) }
  function closeForm() { setShowForm(false); setEditing(null); setForm(emptyItem) }

  async function handleSave() {
    setSaving(true)
    const sb = createClient()
    const payload = Object.fromEntries(fields.map(f => [f.key, typeof form[f.key] === 'number' ? Number(form[f.key]) : String(form[f.key] ?? '').trim()]))
    if (editing) await sb.from(table as any).update(payload).eq('id', editing.id)
    else await sb.from(table as any).insert(payload)
    setSaving(false); closeForm(); load()
  }

  async function handleDelete(id: string) {
    await createClient().from(table as any).delete().eq('id', id)
    setDeleteId(null); load()
  }

  const primaryField = fields[0]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className={sectionHead}>{title}</div>
        <button onClick={openNew} className="px-3 py-1 bg-[#c9a84c] text-black text-xs font-bold hover:bg-[#e8c96a] transition-colors">+ Add</button>
      </div>
      <div className="bg-[#0c0d10] border border-white/[0.07]">
        {loading ? <div className="px-4 py-6 text-white/30 text-xs">Loading…</div>
        : items.length === 0 ? <div className="px-4 py-6 text-white/30 text-xs">No items yet.</div>
        : items.map(item => (
          <div key={item.id as string} className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04] last:border-0">
            <span className="text-white/70 text-sm">{item[primaryField.key] as string}</span>
            <div className="flex gap-3">
              <button onClick={() => openEdit(item)} className="text-xs text-white/40 hover:text-white transition-colors">Edit</button>
              <button onClick={() => setDeleteId(item.id as string)} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#111318] border border-white/[0.07] w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
              <h3 className="text-base font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{editing ? `Edit ${title}` : `New ${title}`}</h3>
              <button onClick={closeForm} className="text-white/30 hover:text-white">✕</button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              {fields.map(f => (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  {f.multiline
                    ? <textarea value={String(form[f.key] ?? '')} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} rows={3} className={`${inputCls} resize-none`} />
                    : <input value={String(form[f.key] ?? '')} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className={inputCls} />
                  }
                </div>
              ))}
              <div className="flex gap-3 pt-1">
                <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#c9a84c] text-black text-xs font-bold hover:bg-[#e8c96a] disabled:opacity-50 transition-colors">
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={closeForm} className="px-5 py-2 bg-white/[0.06] text-white/60 text-xs hover:bg-white/[0.1] transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#111318] border border-white/[0.07] w-full max-w-xs p-7">
            <p className="text-white text-sm mb-5">Delete this item?</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="px-5 py-2 bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-colors">Delete</button>
              <button onClick={() => setDeleteId(null)} className="px-5 py-2 bg-white/[0.06] text-white/60 text-xs hover:bg-white/[0.1] transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Text section editor (reads/writes site_text by section)
function TextSection({ section, fields }: { section: string; fields: { key: string; label: string; multiline?: boolean }[] }) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { data } = await (createClient().from('site_text') as any).select('key,value').eq('section', section)
      const v: Record<string, string> = {}
      ;(data ?? []).forEach((r: { key: string; value: string }) => { v[r.key] = r.value })
      setValues(v)
    })()
  }, [section])

  async function handleSave() {
    setSaving(true)
    const sb = createClient()
    await Promise.all(
      fields.map(f =>
        (sb.from('site_text') as any)
          .upsert({ key: f.key, value: values[f.key] ?? '', section }, { onConflict: 'key' })
      )
    )
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5">
      {fields.map(f => (
        <TextField key={f.key} label={f.label} value={values[f.key] ?? ''} onChange={v => setValues(p => ({ ...p, [f.key]: v }))} multiline={f.multiline} />
      ))}
      <div className="flex items-center gap-4 pt-2">
        <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-[#c9a84c] text-black text-sm font-bold tracking-widest hover:bg-[#e8c96a] disabled:opacity-50 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {saved && <span className="text-green-400 text-xs">Saved ✓</span>}
      </div>
    </div>
  )
}

export default function ContentPage() {
  const [tab, setTab] = useState<Tab>('hero')

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>Site Content</h1>
      <p className="text-white/30 text-xs mb-8">Edit text that appears across every page. Changes take effect on next page load (site caches for 60 seconds).</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-8 border-b border-white/[0.07] pb-0">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-xs tracking-widest uppercase transition-colors border-b-2 -mb-px ${tab === t.id ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-white/40 hover:text-white'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">
        {tab === 'hero' && (
          <TextSection section="hero" fields={[
            { key: 'hero_eyebrow', label: 'Eyebrow Label' },
            { key: 'hero_headline_1', label: 'Headline Line 1' },
            { key: 'hero_headline_accent', label: 'Headline Accent Word (gold)' },
            { key: 'hero_headline_outline', label: 'Headline Outline Line' },
            { key: 'hero_subtext', label: 'Sub-text', multiline: true },
            { key: 'hero_cta_primary_label', label: 'Primary Button Text' },
            { key: 'hero_cta_primary_url', label: 'Primary Button URL' },
            { key: 'hero_cta_secondary_label', label: 'Secondary Button Text' },
            { key: 'hero_cta_secondary_url', label: 'Secondary Button URL' },
          ]} />
        )}

        {tab === 'about' && (
          <TextSection section="about_section" fields={[
            { key: 'about_eyebrow', label: 'Eyebrow Label' },
            { key: 'about_headline', label: 'Headline', multiline: true },
            { key: 'about_body_1', label: 'Paragraph 1', multiline: true },
            { key: 'about_body_2', label: 'Paragraph 2', multiline: true },
            { key: 'about_body_3', label: 'Paragraph 3', multiline: true },
            { key: 'about_cta_label', label: 'CTA Button Text' },
            { key: 'about_cta_url', label: 'CTA Button URL' },
          ]} />
        )}

        {tab === 'stats' && (
          <ListEditor
            table="stats"
            title="Stat"
            emptyItem={{ value_text: '', label: '', sort_order: 0 }}
            fields={[
              { key: 'value_text', label: 'Value (e.g. 50+)' },
              { key: 'label', label: 'Label (e.g. AI Projects Delivered)' },
              { key: 'sort_order', label: 'Sort Order' },
            ]}
          />
        )}

        {tab === 'process' && (
          <>
            <TextSection section="process_section" fields={[
              { key: 'process_eyebrow', label: 'Eyebrow Label' },
              { key: 'process_headline', label: 'Headline' },
            ]} />
            <div className="mt-8">
              <ListEditor
                table="process_steps"
                title="Step"
                emptyItem={{ step_num: '', title: '', timeframe: '', description: '', sort_order: 0 }}
                fields={[
                  { key: 'step_num', label: 'Step Number (e.g. 01)' },
                  { key: 'title', label: 'Title' },
                  { key: 'timeframe', label: 'Timeframe (e.g. Weeks 1–2)' },
                  { key: 'description', label: 'Description', multiline: true },
                  { key: 'sort_order', label: 'Sort Order' },
                ]}
              />
            </div>
          </>
        )}

        {tab === 'why' && (
          <>
            <TextSection section="why_section" fields={[
              { key: 'why_eyebrow', label: 'Eyebrow Label' },
              { key: 'why_headline', label: 'Headline' },
            ]} />
            <div className="mt-8">
              <ListEditor
                table="why_cards"
                title="Card"
                emptyItem={{ icon: '', title: '', description: '', sort_order: 0 }}
                fields={[
                  { key: 'icon', label: 'Icon (emoji)' },
                  { key: 'title', label: 'Title' },
                  { key: 'description', label: 'Description', multiline: true },
                  { key: 'sort_order', label: 'Sort Order' },
                ]}
              />
            </div>
          </>
        )}

        {tab === 'sectors' && (
          <>
            <TextSection section="sectors_section" fields={[
              { key: 'sectors_eyebrow', label: 'Eyebrow Label' },
              { key: 'sectors_headline', label: 'Headline' },
            ]} />
            <div className="mt-8">
              <ListEditor
                table="sectors"
                title="Sector"
                emptyItem={{ icon: '', name: '', description: '', sort_order: 0 }}
                fields={[
                  { key: 'icon', label: 'Icon (emoji)' },
                  { key: 'name', label: 'Sector Name' },
                  { key: 'description', label: 'Description', multiline: true },
                  { key: 'sort_order', label: 'Sort Order' },
                ]}
              />
            </div>
          </>
        )}

        {tab === 'cta' && (
          <TextSection section="cta_band" fields={[
            { key: 'cta_headline', label: 'Headline', multiline: true },
            { key: 'cta_subtext', label: 'Sub-text' },
            { key: 'cta_button_label', label: 'Button Text' },
            { key: 'cta_button_url', label: 'Button URL' },
          ]} />
        )}

        {tab === 'footer' && (
          <TextSection section="footer" fields={[
            { key: 'footer_copyright', label: 'Copyright Text' },
            { key: 'footer_tagline', label: 'Tagline' },
          ]} />
        )}

        {tab === 'pages' && (
          <div className="flex flex-col gap-10">
            <div>
              <div className={sectionHead}>Services Page</div>
              <TextSection section="services_page" fields={[
                { key: 'services_page_eyebrow', label: 'Eyebrow Label' },
                { key: 'services_page_headline', label: 'Headline' },
                { key: 'services_page_subtext', label: 'Sub-text', multiline: true },
                { key: 'services_page_cta_headline', label: 'CTA Headline' },
                { key: 'services_page_cta_subtext', label: 'CTA Sub-text' },
                { key: 'services_page_cta_button_label', label: 'CTA Button Text' },
                { key: 'services_page_cta_button_url', label: 'CTA Button URL' },
              ]} />
            </div>
            <div>
              <div className={sectionHead}>About Page</div>
              <TextSection section="about_page" fields={[
                { key: 'about_page_eyebrow', label: 'Eyebrow Label' },
                { key: 'about_page_headline', label: 'Headline' },
                { key: 'about_page_body_1', label: 'Paragraph 1', multiline: true },
                { key: 'about_page_body_2', label: 'Paragraph 2', multiline: true },
                { key: 'about_page_body_3', label: 'Paragraph 3', multiline: true },
                { key: 'about_page_body_4', label: 'Paragraph 4', multiline: true },
                { key: 'about_page_edge_eyebrow', label: 'Edge Section Eyebrow' },
                { key: 'about_page_edge_headline', label: 'Edge Section Headline' },
                { key: 'about_page_cta_headline', label: 'CTA Headline' },
                { key: 'about_page_cta_subtext', label: 'CTA Sub-text' },
                { key: 'about_page_cta_button_label', label: 'CTA Button Text' },
                { key: 'about_page_cta_button_url', label: 'CTA Button URL' },
              ]} />
            </div>
            <div>
              <div className={sectionHead}>Contact Page</div>
              <TextSection section="contact_page" fields={[
                { key: 'contact_page_eyebrow', label: 'Eyebrow Label' },
                { key: 'contact_page_headline', label: 'Headline' },
                { key: 'contact_page_subtext', label: 'Sub-text', multiline: true },
                { key: 'contact_office_label', label: 'Office Label' },
                { key: 'contact_office_value', label: 'Office Value', multiline: true },
                { key: 'contact_email_label', label: 'Email Label' },
                { key: 'contact_email_value', label: 'Email Value' },
                { key: 'contact_operations_label', label: 'Operations Label' },
                { key: 'contact_operations_value', label: 'Operations Value' },
              ]} />
            </div>
          </div>
        )}

        {tab === 'seo' && (
          <div className="flex flex-col gap-10">
            <p className="text-white/30 text-xs -mt-2">These fields control what appears in Google results, social link previews, and AI answer engines. Leave blank to use the default text.</p>
            {[
              { page: 'home',     label: 'Home Page' },
              { page: 'services', label: 'Services Page' },
              { page: 'about',    label: 'About Page' },
              { page: 'contact',  label: 'Contact Page' },
              { page: 'blog',     label: 'Blog Listing Page' },
            ].map(({ page, label }) => (
              <div key={page}>
                <div className={sectionHead}>{label}</div>
                <TextSection section="seo" fields={[
                  { key: `seo_${page}_title`,       label: 'Meta Title (shown in Google — keep under 60 chars)' },
                  { key: `seo_${page}_description`, label: 'Meta Description (shown in Google — keep under 155 chars)', multiline: true },
                  { key: `seo_${page}_og_image`,    label: 'OG Image URL (1200×630px — for social link previews)' },
                ]} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
