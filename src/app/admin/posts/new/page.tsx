'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Category } from '@/lib/supabase/types'

const TipTapEditor = dynamic(() => import('@/components/admin/TipTapEditor'), { ssr: false })

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [content, setContent] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    createClient().from('categories').select('*').order('name').then(({ data }) => setCategories(data ?? []))
  }, [])

  function handleTitleChange(v: string) {
    setTitle(v)
    setSlug(slugify(v))
  }

  async function save(publish: boolean) {
    setSaving(true)
    setError('')
    const safeSlug = slugify(slug || title)
    if (!title || !safeSlug) { setError('Title and slug are required.'); setSaving(false); return }

    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase.from('posts') as any).insert({
      title,
      slug: safeSlug,
      excerpt: excerpt || null,
      cover_image: coverImage || null,
      category_id: categoryId || null,
      content,
      published: publish,
      published_at: publish ? new Date().toISOString() : null,
    })

    if (err) { setError(err.message); setSaving(false); return }
    router.push('/admin/posts')
  }

  const inputCls = 'bg-[#0c0d10] border border-white/[0.1] text-white placeholder:text-white/25 px-4 py-3 text-sm outline-none w-full transition-colors focus:border-[#c9a84c]'
  const labelCls = 'text-xs tracking-widest text-white/40 uppercase mb-2 block'

  return (
    <div className="p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>New Post</h1>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <label className={labelCls}>Title</label>
          <input value={title} onChange={e => handleTitleChange(e.target.value)} className={inputCls} placeholder="Post title" />
        </div>
        <div>
          <label className={labelCls}>Slug</label>
          <input value={slug} onChange={e => setSlug(slugify(e.target.value))} className={inputCls} placeholder="post-slug" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Category</label>
            <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className={inputCls}>
              <option value="">No category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Cover Image URL</label>
            <input value={coverImage} onChange={e => setCoverImage(e.target.value)} className={inputCls} placeholder="https://…" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Excerpt</label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} className={`${inputCls} resize-y`} placeholder="Short description shown on listing page" />
        </div>
        <div>
          <label className={labelCls}>Content</label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        {error && <div className="bg-red-900/20 border border-red-500/40 text-white/80 px-4 py-3 text-sm">{error}</div>}

        <div className="flex gap-4">
          <button onClick={() => save(false)} disabled={saving} className="px-6 py-3 border border-white/[0.1] text-white/60 text-sm hover:text-white hover:border-white/30 transition-colors disabled:opacity-40">
            Save Draft
          </button>
          <button onClick={() => save(true)} disabled={saving} className="px-6 py-3 bg-[#c9a84c] text-black text-sm font-bold tracking-widest hover:bg-[#e8c96a] transition-colors disabled:opacity-40" style={{ fontFamily: 'Syne, sans-serif' }}>
            {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
