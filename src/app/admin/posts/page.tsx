'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/lib/supabase/types'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
      setPosts(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  async function togglePublish(post: Post) {
    const supabase = createClient()
    const newVal = !post.published
    await supabase
      .from('posts')
      .update({ published: newVal, published_at: newVal ? new Date().toISOString() : null })
      .eq('id', post.id)
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, published: newVal } : p))
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Posts</h1>
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 bg-[#c9a84c] text-black text-sm font-bold tracking-widest hover:bg-[#e8c96a] transition-colors"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          New Post
        </Link>
      </div>

      <div className="bg-[#111318] border border-white/[0.07]">
        {loading ? (
          <div className="px-6 py-10 text-white/30 text-sm">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="px-6 py-10 text-white/30 text-sm">No posts yet. <Link href="/admin/posts/new" className="text-[#c9a84c] hover:underline">Create your first post</Link>.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Title', 'Slug', 'Status', 'Created', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-white/30 text-xs tracking-widest uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-6 py-3 text-white font-medium">{post.title}</td>
                  <td className="px-6 py-3 text-white/40 text-xs font-mono">{post.slug}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-sm ${post.published ? 'bg-green-900/30 text-green-400' : 'bg-white/[0.06] text-white/40'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-white/30 text-xs">{formatDate(post.created_at)}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-4">
                      <Link href={`/admin/posts/${post.id}/edit`} className="text-xs text-white/40 hover:text-white transition-colors">Edit</Link>
                      <button onClick={() => togglePublish(post)} className={`text-xs transition-colors ${post.published ? 'text-red-400/60 hover:text-red-400' : 'text-[#c9a84c]/60 hover:text-[#c9a84c]'}`}>
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                    </div>
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
