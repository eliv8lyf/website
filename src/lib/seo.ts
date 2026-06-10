import { createClient } from '@/lib/supabase/server'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://eliv8lyf.com'

export async function getPageSeo(pageKey: string) {
  const supabase = await createClient()
  const keys = [`seo_${pageKey}_title`, `seo_${pageKey}_description`, `seo_${pageKey}_og_image`]
  const { data } = await (supabase.from('site_text') as any)
    .select('key,value')
    .eq('section', 'seo')
    .in('key', keys)
  const v: Record<string, string> = {}
  ;(data ?? []).forEach((r: { key: string; value: string }) => { v[r.key] = r.value })
  return {
    title: v[`seo_${pageKey}_title`] || undefined,
    description: v[`seo_${pageKey}_description`] || undefined,
    ogImage: v[`seo_${pageKey}_og_image`] || undefined,
  }
}
