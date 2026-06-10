import NavWrapper from '@/components/NavWrapper'
import Footer from '@/components/Footer'
import Cursor from '@/components/Cursor'
import BlogListing from '@/components/BlogListing'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { getPageSeo, SITE_URL } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('blog')
  const title = seo.title ?? 'Blog'
  const description = seo.description ?? 'AI strategy, implementation insights, and the future of work from the team at ELIV8 LYF.'
  return {
    title,
    description,
    openGraph: {
      title: seo.title ?? 'Blog — ELIV8 LYF FZE',
      description,
      url: `${SITE_URL}/blog`,
      ...(seo.ogImage ? { images: [{ url: seo.ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: { title, description },
  }
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image, published_at, categories(name, slug)')
    .eq('published', true)
    .order('published_at', { ascending: false })

  const safePosts = (posts ?? []).map(p => ({
    ...p,
    categories: Array.isArray(p.categories) ? p.categories[0] ?? null : p.categories,
  }))

  return (
    <>
      <Cursor />
      <NavWrapper />

      <div className="pt-[120px] px-6 md:px-12 pb-16 bg-black">
        <div className="max-w-[1100px] mx-auto">
          <div className="inline-flex items-center gap-3 text-gold text-[0.72rem] tracking-[0.2em] uppercase mb-5 font-medium">
            <span className="block w-6 h-px bg-gold" />Insights
          </div>
          <h1 className="font-syne font-extrabold text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-cream max-w-3xl">
            AI insights & perspectives
          </h1>
          <p className="text-muted text-[1rem] leading-[1.75] max-w-[520px] mt-5">
            Thinking from the team at ELIV8 LYF on AI strategy, implementation, and the future of work.
          </p>
        </div>
      </div>

      <section className="bg-off-black px-6 md:px-12 py-16 min-h-[60vh]">
        <div className="max-w-[1100px] mx-auto">
          {!safePosts.length ? (
            <div className="text-muted text-[1rem] py-20 text-center">No posts published yet. Check back soon.</div>
          ) : (
            <BlogListing posts={safePosts} />
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
