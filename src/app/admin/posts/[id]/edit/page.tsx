'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Category, Post } from '@/lib/supabase/types'

const TipTapEditor = dynamic(() => import('@/components/admin/TipTapEditor'), { ssr: false })

export default function EditPostPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [post, setPost] = useState<Post | null>(null)
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
    const supabase = createClient()
    Promise.all([
      supabase.from('posts').select('*').eq('id', id).single(),
      supabase.from('categories').select('*').order('name'),
    ]).then(([{ data: p }, { data: cats }]) => {
      if (p) {
        setPost(p)
        setTitle(p.title ?? '')
        setSlug(p.slug ?? '')
        setExcerpt(p.excerpt ?? '')
        setCoverImage(p.cover_image ?? '')
        setCategoryId(p.category_id ?? '')
        setContent(p.content ?? '')
      }
      setCategories(cats ?? [])
    })
  }, [id])

  async function save(publish?: boolean) {
    setSaving(true)
    setError('')
    const safeSlug = slugify(slug || title)
    if (!title || !safeSlug) { setError('Title and slug are required.'); setSaving(false); return }

    const supabase = createClient()
    const published = publish !== undefined ? publish : (post?.published ?? false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: err } = await (supabase.from('posts') as any).update({
      title,
      slug: safeSlug,
      excerpt: excerpt || null,
      cover_image: coverImage || null,
      category_id: categoryId || null,
      content,
      published,
      published_at: published && !post?.published_at ? new Date().toISOString() : post?.published_at ?? null,
    }).eq('id', id)

    if (err) { setError(err.message); setSaving(false); return }
    router.push('/admin/posts')
  }

  const inputCls = 'bg-[#0c0d10] border border-white/[0.1] text-white placeholder:text-white/25 px-4 py-3 text-sm outline-none w-full transition-colors focus:border-[#c9a84c]'
  const labelCls = 'text-xs tracking-widest text-white/40 uppercase mb-2 block'

  if (!post) return <div className="p-10 text-white/30 text-sm">Loading…</div>

  return (
    <div className="p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Edit Post</h1>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <label className={labelCls}>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Slug</label>
          <input value={slug} onChange={e => setSlug(slugify(e.target.value))} className={inputCls} />
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
            <input value={coverImage} onChange={e => setCoverImage(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Excerpt</label>
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} className={`${inputCls} resize-y`} />
        </div>
        <div>
          <label className={labelCls}>Content</label>
          <TipTapEditor content={content} onChange={setContent} />
        </div>

        {error && <div className="bg-red-900/20 border border-red-500/40 text-white/80 px-4 py-3 text-sm">{error}</div>}

        <div className="flex gap-4">
          <button onClick={() => save()} disabled={saving} className="px-6 py-3 border border-white/[0.1] text-white/60 text-sm hover:text-white hover:border-white/30 transition-colors disabled:opacity-40">
            Save
          </button>
          <button onClick={() => save(!post.published)} disabled={saving} className={`px-6 py-3 text-sm font-bold tracking-widest transition-colors disabled:opacity-40 ${post.published ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-[#c9a84c] text-black hover:bg-[#e8c96a]'}`} style={{ fontFamily: 'Syne, sans-serif' }}>
            {saving ? 'Saving…' : post.published ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
