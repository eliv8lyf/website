# ELIV8 LYF FZE — Website

## Project
AI consulting website for ELIV8 LYF FZE (UAE Free Zone).

## Stack
- Next.js 14 App Router · TypeScript · Tailwind CSS
- Supabase (project: `luiaruzqojacauwdjnhj`, region: ap-southeast-2)
- Vercel deployment

## Repo
- Repo: `eliv8lyf/website`
- Working branch: `claude/peaceful-clarke-WFch8`

## Structure
- `/src/app` — pages (home, /services, /about, /blog, /contact, /admin/*)
- `/src/components` — Nav, Footer, Cursor, ThreeCanvas, MarqueeStrip, ContactForm, admin/*
- `/src/lib/supabase` — client.ts, server.ts, types.ts
- `middleware.ts` — auth guard for /admin, rate limiting on /api/contact

## Supabase Schema
- `leads` — contact form submissions (RLS: public insert only)
- `posts` — blog posts (RLS: public select published only)
- `categories` — blog categories (RLS: public select)
- Admin auth via Supabase Auth (email/password)

## Admin Users
- eliv8lyf@proton.me
- gthawani@gmail.com

## Key Notes
- Supabase mutations use `(supabase.from('x') as any)` due to @supabase/ssr v0.10 generic inference issue
- Blog uses ISR (revalidate: 60)
- TipTap editor for post content, DOMPurify sanitises output on render
- Service role key is server-only (never exposed to client)
