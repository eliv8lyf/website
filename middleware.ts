import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const rateMap = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 1
const WINDOW_MS = 60_000

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate-limit contact form API
  if (pathname === '/api/contact' && request.method === 'POST') {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('x-real-ip') ??
      'unknown'
    const now = Date.now()
    const entry = rateMap.get(ip)
    if (entry && now < entry.reset) {
      if (entry.count >= RATE_LIMIT) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait 60 seconds.' },
          { status: 429 }
        )
      }
      entry.count++
    } else {
      rateMap.set(ip, { count: 1, reset: now + WINDOW_MS })
    }
  }

  let supabaseResponse = NextResponse.next({ request })

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/admin/login'
      return NextResponse.redirect(loginUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/api/contact'],
}
