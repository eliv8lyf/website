import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import ReadingProgress from '@/components/ReadingProgress'
import ShareButtons from '@/components/ShareButtons'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 60

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://eliv8lyf.com'

interface Props {
  params: Promise<{ slug: string }>
}

function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = text.split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('title, excerpt, cover_image')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!data) return { title: 'Post Not Found — ELIV8 LYF FZE' }

  const url = `${SITE_URL}/blog/${slug}`
  const images = data.cover_image ? [{ url: data.cover_image, width: 1200, height: 630 }] : undefined

  return {
    title: `${data.title} — ELIV8 LYF FZE`,
    description: data.excerpt ?? undefined,
    openGraph: {
      title: data.title ?? undefined,
      description: data.excerpt ?? undefined,
      type: 'article',
      url,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title ?? undefined,
      description: data.excerpt ?? undefined,
    },
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

  const content = post.content ?? ''
  const mins = readingTime(content)
  const cat = post.categories as { name: string; slug: string } | null

  return (
    <>
      <Cursor />
      <ReadingProgress />
      <Nav />

      <article className="bg-black pt-[120px] pb-20">
        <div className="px-6 md:px-8 max-w-[760px] mx-auto">

          {/* Category + back link */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            {cat ? (
              <Link href="/blog" className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase font-medium hover:text-gold-light transition-colors">
                <span className="block w-6 h-px bg-gold" />{cat.name}
              </Link>
            ) : (
              <Link href="/blog" className="text-muted text-[0.78rem] tracking-[0.06em] hover:text-cream transition-colors">
                ← Blog
              </Link>
            )}
          </div>

          {/* Title */}
          <h1 className="font-syne font-extrabold text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.1] tracking-[-0.02em] text-cream mb-4">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-4 text-muted text-[0.8rem] mb-10 flex-wrap">
            <span>{formatDate(post.published_at)}</span>
            <span className="w-px h-3 bg-white/20" />
            <span>{mins} min read</span>
          </div>

          {/* Cover image */}
          {post.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image}
              alt={post.title ?? ''}
              className="w-full h-auto max-h-[460px] object-cover rounded-[6px] mb-12"
            />
          )}

          {/* Body */}
          <div
            className="prose-tiptap"
            dangerouslySetInnerHTML={{ __html: content }}
          />

          {/* Share */}
          <div className="mt-14 pt-8 border-t border-white/[0.07]">
            <ShareButtons title={post.title ?? ''} />
          </div>
        </div>
      </article>

      {/* Footer CTA bar */}
      <div className="bg-off-black px-6 md:px-12 py-14 flex items-center justify-between gap-6 flex-wrap border-t border-white/[0.07]">
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
