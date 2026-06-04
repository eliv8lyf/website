import { createClient } from '@/lib/supabase/server'
import Nav from './Nav'

export default async function NavWrapper() {
  const supabase = await createClient()
  const { data } = await (supabase.from('nav_items') as any)
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
  return <Nav items={data ?? []} />
}
