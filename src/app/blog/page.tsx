import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog — ELIV8 LYF FZE' }
export const revalidate = 60

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image, published_at, categories(name, slug)')
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <>
      <Cursor />
      <Nav />

      <div className="pt-[120px] px-12 pb-20 bg-black">
        <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
          <span className="block w-6 h-px bg-gold" />Insights
        </div>
        <h1 className="font-syne font-extrabold text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-cream max-w-3xl">
          AI insights & perspectives
        </h1>
        <p className="text-muted text-[1.05rem] leading-[1.7] max-w-[560px] mt-6">
          Thinking from the team at ELIV8 LYF on AI strategy, implementation, and the future of work.
        </p>
      </div>

      <section className="bg-off-black px-12 py-20 min-h-[60vh]">
        {!posts || posts.length === 0 ? (
          <div className="text-muted text-[1rem] py-20 text-center">No posts published yet. Check back soon.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
            {posts.map((post) => {
              const cat = post.categories as { name: string; slug: string } | null
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-panel border border-white/[0.07] flex flex-col group hover:border-gold/30 transition-colors"
                >
                  {post.cover_image && (
                    <div className="h-48 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.cover_image} alt={post.title ?? ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-1">
                    {cat && (
                      <span className="text-[0.68rem] tracking-[0.14em] uppercase text-gold mb-3 font-medium">{cat.name}</span>
                    )}
                    <h2 className="font-syne font-bold text-[1.1rem] text-cream mb-3 leading-tight group-hover:text-gold transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted text-[0.85rem] leading-[1.7] flex-1">{post.excerpt}</p>
                    )}
                    <div className="text-[0.75rem] text-muted mt-5 pt-5 border-t border-white/[0.07]">
                      {formatDate(post.published_at)}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <Footer />
    </>
  )
}
