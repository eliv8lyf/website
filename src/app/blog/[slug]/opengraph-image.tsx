import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: { slug: string } }) {
  const { slug } = params

  let title = 'AI Consulting & Strategy'
  let excerpt = ''

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/posts?select=title,excerpt&slug=eq.${slug}&published=eq.true&limit=1`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      }
    )
    const [post] = await res.json()
    if (post?.title) title = post.title
    if (post?.excerpt) excerpt = post.excerpt
  } catch {}

  const shortExcerpt = excerpt.length > 130 ? excerpt.slice(0, 130) + '…' : excerpt

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#050608',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background grid texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(201,168,76,0.06) 0%, transparent 60%)',
          }}
        />

        {/* Gold top accent */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '2px', background: '#c9a84c' }} />
          <span style={{ color: '#c9a84c', fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            ELIV8 LYF FZE · AI Consulting
          </span>
        </div>

        {/* Title + excerpt */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, justifyContent: 'center' }}>
          <div
            style={{
              color: '#f0ede8',
              fontSize: title.length > 55 ? '48px' : '60px',
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: '960px',
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
          {shortExcerpt && (
            <div
              style={{
                color: 'rgba(240,237,232,0.55)',
                fontSize: '22px',
                lineHeight: 1.55,
                maxWidth: '820px',
              }}
            >
              {shortExcerpt}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#f0ede8', fontSize: '22px', fontWeight: 800, letterSpacing: '0.08em' }}>
              ELIV<span style={{ color: '#c9a84c' }}>8</span> LYF
            </span>
          </div>
          <span style={{ color: 'rgba(240,237,232,0.3)', fontSize: '15px', letterSpacing: '0.06em' }}>
            eliv8lyf.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
