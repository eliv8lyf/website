import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { first_name, last_name, email, organisation, service, message } = body

  if (!first_name || !last_name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 422 })
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(String(email))) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 422 })
  }

  const supabase = await createServiceClient()

  const { error } = await supabase.from('leads').insert({
    first_name: String(first_name).slice(0, 100),
    last_name: String(last_name).slice(0, 100),
    email: String(email).slice(0, 254),
    organisation: organisation ? String(organisation).slice(0, 200) : null,
    service: service ? String(service).slice(0, 100) : null,
    message: message ? String(message).slice(0, 2000) : null,
    status: 'new',
  })

  if (error) {
    console.error('Lead insert error:', error)
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
