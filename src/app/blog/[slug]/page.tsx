import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!data) return { title: 'Post Not Found — ELIV8 LYF FZE' }
  return {
    title: `${data.title} — ELIV8 LYF FZE`,
    description: data.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!post) notFound()

  let safeContent = post.content ?? ''
  try {
    const DOMPurify = (await import('isomorphic-dompurify')).default
    safeContent = DOMPurify.sanitize(post.content ?? '', {
      ALLOWED_TAGS: ['h1','h2','h3','h4','p','ul','ol','li','strong','em','a','blockquote','code','pre','img','br'],
      ALLOWED_ATTR: ['href','src','alt','class','target','rel'],
    })
  } catch {
    safeContent = post.content ?? ''
  }

  const cat = post.categories as { name: string; slug: string } | null

  return (
    <>
      <Cursor />
      <Nav />

      <article className="bg-black pt-[120px] pb-20">
        <div className="px-12 max-w-[800px]">
          {cat && (
            <Link href="/blog" className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium hover:text-gold-light">
              <span className="block w-6 h-px bg-gold" />{cat.name}
            </Link>
          )}
          <h1 className="font-syne font-extrabold text-[clamp(2rem,4vw,3.5rem)] leading-[1.08] tracking-[-0.02em] text-cream mb-6">
            {post.title}
          </h1>
          <div className="text-muted text-[0.82rem] mb-12">{formatDate(post.published_at)}</div>

          {post.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover_image} alt={post.title ?? ''} className="w-full h-[420px] object-cover mb-12" />
          )}

          <div
            className="prose-tiptap"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        </div>
      </article>

      <div className="bg-off-black px-12 py-16 flex items-center justify-between gap-8 flex-wrap border-t border-white/[0.07]">
        <Link href="/blog" className="text-muted text-[0.85rem] tracking-[0.06em] hover:text-cream transition-colors">
          ← Back to Blog
        </Link>
        <Link href="/contact" className="inline-flex items-center gap-2.5 px-9 py-4 bg-gold text-black font-syne font-bold text-[0.9rem] tracking-[0.04em] transition-all hover:bg-gold-light">
          Book a Consultation →
        </Link>
      </div>

      <Footer />
    </>
  )
}
