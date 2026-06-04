import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { first_name, last_name, email, phone_code, phone_number, organisation, country, service, message, referral_source } = body
  const phone = phone_number ? `${phone_code ?? ''}${phone_number}`.trim() : null

  if (!first_name || !last_name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 422 })
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRe.test(String(email))) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 422 })
  }

  const supabase = await createClient()

  const { error } = await supabase.from('leads').insert({
    first_name: String(first_name).slice(0, 100),
    last_name: String(last_name).slice(0, 100),
    email: String(email).slice(0, 254),
    phone: phone ? String(phone).slice(0, 30) : null,
    organisation: organisation ? String(organisation).slice(0, 200) : null,
    country: country ? String(country).slice(0, 100) : null,
    service: service ? String(service).slice(0, 100) : null,
    message: message ? String(message).slice(0, 2000) : null,
    referral_source: referral_source ? String(referral_source).slice(0, 100) : null,
    status: 'new',
  })

  if (error) {
    console.error('Lead insert error:', error)
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
