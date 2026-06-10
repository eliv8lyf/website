'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

type Post = {
  id: string
  title: string | null
  slug: string | null
  excerpt: string | null
  cover_image: string | null
  published_at: string | null
  categories: { name: string; slug: string } | null
}

export default function BlogListing({ posts }: { posts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = Array.from(
    new Map(
      posts
        .filter(p => p.categories)
        .map(p => [p.categories!.slug, p.categories!])
    ).values()
  )

  const filtered = activeCategory
    ? posts.filter(p => p.categories?.slug === activeCategory)
    : posts

  const [featured, ...rest] = filtered

  return (
    <>
      {categories.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 text-[0.75rem] tracking-[0.1em] uppercase border transition-colors ${
              !activeCategory
                ? 'border-gold text-gold'
                : 'border-white/10 text-muted hover:border-white/30 hover:text-cream'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-1.5 text-[0.75rem] tracking-[0.1em] uppercase border transition-colors ${
                activeCategory === cat.slug
                  ? 'border-gold text-gold'
                  : 'border-white/10 text-muted hover:border-white/30 hover:text-cream'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {!filtered.length ? (
        <div className="text-muted text-[1rem] py-20 text-center">No posts in this category yet.</div>
      ) : (
        <>
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="block group mb-0.5 bg-panel border border-white/[0.07] hover:border-gold/30 transition-colors md:flex"
            >
              {featured.cover_image && (
                <div className="md:w-[45%] h-56 md:h-72 overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.cover_image}
                    alt={featured.title ?? ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-8 md:p-12 flex flex-col justify-center flex-1">
                {featured.categories && (
                  <span className="text-[0.68rem] tracking-[0.14em] uppercase text-gold mb-3 font-medium">
                    {featured.categories.name}
                  </span>
                )}
                <h2 className="font-syne font-bold text-[1.5rem] md:text-[1.8rem] text-cream mb-4 leading-[1.15] group-hover:text-gold transition-colors">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-muted text-[0.9rem] leading-[1.75] mb-6 max-w-[520px]">
                    {featured.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-4 text-[0.75rem] text-muted">
                  <span>{formatDate(featured.published_at)}</span>
                  <span className="text-gold font-medium">Read article →</span>
                </div>
              </div>
            </Link>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 mt-0.5">
              {rest.map(post => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="bg-panel border border-white/[0.07] flex flex-col group hover:border-gold/30 transition-colors"
                >
                  {post.cover_image && (
                    <div className="h-48 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover_image}
                        alt={post.title ?? ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-8 flex flex-col flex-1">
                    {post.categories && (
                      <span className="text-[0.68rem] tracking-[0.14em] uppercase text-gold mb-3 font-medium">
                        {post.categories.name}
                      </span>
                    )}
                    <h2 className="font-syne font-bold text-[1.05rem] text-cream mb-3 leading-snug group-hover:text-gold transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-muted text-[0.83rem] leading-[1.7] flex-1 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="text-[0.73rem] text-muted mt-5 pt-5 border-t border-white/[0.07]">
                      {formatDate(post.published_at)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}
