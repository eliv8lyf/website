import NavWrapper from '@/components/NavWrapper'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import ReadingProgress from '@/components/ReadingProgress'
import ShareButtons from '@/components/ShareButtons'
import PostReactions from '@/components/PostReactions'
import TableOfContents from '@/components/TableOfContents'
import BackToTop from '@/components/BackToTop'
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

interface Heading {
  id: string
  text: string
  level: number
}

function readingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = text.split(' ').filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function processContent(html: string): { content: string; headings: Heading[] } {
  const headings: Heading[] = []
  const idCounts: Record<string, number> = {}

  const content = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_, lvl, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    let base = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'section'
    idCounts[base] = (idCounts[base] ?? 0) + 1
    const id = idCounts[base] > 1 ? `${base}-${idCounts[base]}` : base
    headings.push({ id, text, level: parseInt(lvl) })
    if (/\bid=/.test(attrs)) return `<h${lvl}${attrs}>${inner}</h${lvl}>`
    return `<h${lvl}${attrs} id="${id}">${inner}</h${lvl}>`
  })

  return { content, headings }
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

  const cat = Array.isArray(post.categories)
    ? post.categories[0] ?? null
    : post.categories as { name: string; slug: string } | null

  const rawContent = post.content ?? ''
  const { content, headings } = processContent(rawContent)
  const mins = readingTime(rawContent)

  // Fetch related, prev, next in parallel
  const [relatedResult, prevResult, nextResult] = await Promise.all([
    post.category_id
      ? supabase
          .from('posts')
          .select('id, title, slug, excerpt, cover_image, published_at, categories(name, slug)')
          .eq('published', true)
          .eq('category_id', post.category_id)
          .neq('id', post.id)
          .order('published_at', { ascending: false })
          .limit(3)
      : Promise.resolve({ data: [] }),
    post.published_at
      ? supabase
          .from('posts')
          .select('slug, title')
          .eq('published', true)
          .lt('published_at', post.published_at)
          .order('published_at', { ascending: false })
          .limit(1)
      : Promise.resolve({ data: [] }),
    post.published_at
      ? supabase
          .from('posts')
          .select('slug, title')
          .eq('published', true)
          .gt('published_at', post.published_at)
          .order('published_at', { ascending: true })
          .limit(1)
      : Promise.resolve({ data: [] }),
  ])

  const related = (relatedResult.data ?? []).map((p: any) => ({
    ...p,
    categories: Array.isArray(p.categories) ? p.categories[0] ?? null : p.categories,
  }))
  const prevPost = (prevResult.data ?? [])[0] ?? null
  const nextPost = (nextResult.data ?? [])[0] ?? null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.published_at,
    author: {
      '@type': 'Organization',
      name: 'ELIV8 LYF FZE',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ELIV8 LYF FZE',
      url: SITE_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${slug}` },
    ...(post.cover_image ? { image: { '@type': 'ImageObject', url: post.cover_image } } : {}),
    ...(cat ? { articleSection: cat.name } : {}),
  }

  return (
    <>
      <Cursor />
      <ReadingProgress />
      <NavWrapper />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="bg-black pt-[120px] pb-20">

        {/* Header */}
        <div className="px-6 md:px-8 max-w-[760px] mx-auto">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {cat ? (
              <Link
                href="/blog"
                className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase font-medium hover:text-gold-light transition-colors"
              >
                <span className="block w-6 h-px bg-gold" />{cat.name}
              </Link>
            ) : (
              <Link href="/blog" className="text-muted text-[0.78rem] tracking-[0.06em] hover:text-cream transition-colors">
                ← Blog
              </Link>
            )}
          </div>

          <h1 className="font-syne font-extrabold text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.1] tracking-[-0.02em] text-cream mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-muted text-[0.8rem] mb-10 flex-wrap">
            <span>{formatDate(post.published_at)}</span>
            <span className="w-px h-3 bg-white/20" />
            <span>{mins} min read</span>
          </div>

          {post.cover_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.cover_image}
              alt={post.title ?? ''}
              className="w-full h-auto max-h-[460px] object-cover rounded-[6px] mb-12"
            />
          )}
        </div>

        {/* Content + TOC sidebar on xl */}
        <div className="xl:flex xl:gap-10 xl:max-w-[1060px] xl:mx-auto px-6 md:px-8 xl:px-8">

          {/* Main content */}
          <div className="max-w-[760px] w-full mx-auto xl:mx-0">
            <div className="xl:hidden">
              <TableOfContents headings={headings} variant="inline" />
            </div>

            <div className="prose-tiptap" dangerouslySetInnerHTML={{ __html: content }} />

            {/* Inline newsletter CTA */}
            <div className="my-12 px-7 py-8 border border-gold/20 bg-gold/[0.04]">
              <p className="font-syne font-bold text-cream text-[1.05rem] mb-2">Stay ahead of AI trends</p>
              <p className="text-muted text-[0.87rem] leading-[1.75] mb-5">
                Strategic AI insights — no fluff, just actionable intelligence for leaders building with AI.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black font-syne font-bold text-[0.82rem] tracking-widest hover:bg-gold-light transition-colors"
              >
                Get in touch →
              </Link>
            </div>

            <PostReactions slug={slug} />

            <div className="mt-10 pt-8 border-t border-white/[0.07]">
              <ShareButtons title={post.title ?? ''} />
            </div>
          </div>

          {/* TOC sidebar — desktop only */}
          {headings.length >= 2 && (
            <aside className="hidden xl:block w-[200px] flex-shrink-0">
              <div className="sticky top-32 pt-1">
                <TableOfContents headings={headings} variant="sidebar" />
              </div>
            </aside>
          )}
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-20 px-6 md:px-8 max-w-[1060px] mx-auto">
            <div className="border-t border-white/[0.07] pt-14">
              <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-8 font-medium">
                <span className="block w-6 h-px bg-gold" />Related reading
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
                {related.map((rp: any) => (
                  <Link
                    key={rp.id}
                    href={`/blog/${rp.slug}`}
                    className="bg-[#0c0d10] border border-white/[0.07] flex flex-col group hover:border-gold/30 transition-colors p-7"
                  >
                    {rp.categories && (
                      <span className="text-[0.65rem] tracking-[0.14em] uppercase text-gold mb-2 font-medium">
                        {rp.categories.name}
                      </span>
                    )}
                    <h3 className="font-syne font-bold text-[0.95rem] text-cream mb-3 leading-snug group-hover:text-gold transition-colors flex-1">
                      {rp.title}
                    </h3>
                    <span className="text-[0.72rem] text-muted">{formatDate(rp.published_at)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>

      {/* Prev / Next navigation */}
      {(prevPost || nextPost) && (
        <div className="bg-[#0c0d10] border-t border-white/[0.07] px-6 md:px-12 py-10 grid grid-cols-2 gap-4 max-w-[1060px] mx-auto">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex flex-col gap-1"
            >
              <span className="text-[0.7rem] tracking-[0.12em] uppercase text-muted group-hover:text-gold transition-colors">← Previous</span>
              <span className="font-syne font-semibold text-[0.9rem] text-cream group-hover:text-gold transition-colors line-clamp-2">
                {prevPost.title}
              </span>
            </Link>
          ) : <div />}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex flex-col gap-1 text-right"
            >
              <span className="text-[0.7rem] tracking-[0.12em] uppercase text-muted group-hover:text-gold transition-colors">Next →</span>
              <span className="font-syne font-semibold text-[0.9rem] text-cream group-hover:text-gold transition-colors line-clamp-2">
                {nextPost.title}
              </span>
            </Link>
          ) : <div />}
        </div>
      )}

      {/* Footer CTA */}
      <div className="bg-off-black px-6 md:px-12 py-14 flex items-center justify-between gap-6 flex-wrap border-t border-white/[0.07]">
        <Link href="/blog" className="text-muted text-[0.85rem] tracking-[0.06em] hover:text-cream transition-colors">
          ← Back to Blog
        </Link>
        <Link href="/contact" className="inline-flex items-center gap-2.5 px-9 py-4 bg-gold text-black font-syne font-bold text-[0.9rem] tracking-[0.04em] transition-all hover:bg-gold-light">
          Book a Consultation →
        </Link>
      </div>

      <BackToTop />
      <Footer />
    </>
  )
}
