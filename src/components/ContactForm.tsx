'use client'

import { useState } from 'react'

const SERVICES = [
  'AI Strategy & Roadmapping',
  'AI Implementation',
  'Process Automation',
  'Data Intelligence',
  'AI Training',
  'Governance & Compliance',
  'General Enquiry',
]

const REFERRAL_SOURCES = [
  'Google / Search',
  'LinkedIn',
  'Referral / Word of mouth',
  'Social media',
  'Event or conference',
  'Other',
]

const MESSAGE_LIMIT = 1500

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [msgLen, setMsgLen] = useState(0)
  const [agreed, setAgreed] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!agreed) return
    setStatus('sending')
    setErrorMsg('')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong')
      setStatus('success')
      form.reset()
      setMsgLen(0)
      setAgreed(false)
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const inputCls = 'bg-panel border border-white/[0.07] text-cream placeholder:text-cream/25 px-[18px] py-3.5 text-[0.9rem] outline-none w-full transition-colors focus:border-gold/60 appearance-none'
  const labelCls = 'text-[0.7rem] tracking-[0.12em] text-muted uppercase'

  if (status === 'success') {
    return (
      <div className="flex flex-col items-start gap-4 py-12">
        <div className="w-12 h-12 bg-gold/10 border border-gold/30 flex items-center justify-center text-gold text-xl">✓</div>
        <h3 className="font-syne font-bold text-cream text-[1.3rem]">Message received</h3>
        <p className="text-muted text-[0.92rem] leading-[1.75]">
          Thank you — we&apos;ll review your message and be in touch within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 text-gold text-[0.82rem] tracking-[0.06em] hover:text-gold-light transition-colors underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelCls}>First Name <span className="text-gold">*</span></label>
          <input name="first_name" type="text" placeholder="Amara" required className={inputCls} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Last Name <span className="text-gold">*</span></label>
          <input name="last_name" type="text" placeholder="Osei" required className={inputCls} />
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Work Email <span className="text-gold">*</span></label>
          <input name="email" type="email" placeholder="you@company.com" required className={inputCls} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Mobile / WhatsApp</label>
          <input name="phone" type="tel" placeholder="+971 50 000 0000" className={inputCls} />
        </div>
      </div>

      {/* Organisation + Country */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Organisation</label>
          <input name="organisation" type="text" placeholder="Your company name" className={inputCls} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Country</label>
          <input name="country" type="text" placeholder="UAE, Saudi Arabia, UK…" className={inputCls} />
        </div>
      </div>

      {/* Service */}
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Area of Interest</label>
        <select name="service" className={inputCls} defaultValue="">
          <option value="" disabled>Select a service area</option>
          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className={labelCls}>Message</label>
          <span className={`text-[0.7rem] tabular-nums transition-colors ${msgLen > MESSAGE_LIMIT * 0.9 ? 'text-gold' : 'text-muted/50'}`}>
            {msgLen} / {MESSAGE_LIMIT}
          </span>
        </div>
        <textarea
          name="message"
          placeholder="Tell us about your challenge or opportunity…"
          rows={5}
          maxLength={MESSAGE_LIMIT}
          onChange={e => setMsgLen(e.target.value.length)}
          className={`${inputCls} resize-y`}
        />
      </div>

      {/* Referral source */}
      <div className="flex flex-col gap-2">
        <label className={labelCls}>How did you hear about us?</label>
        <select name="referral_source" className={inputCls} defaultValue="">
          <option value="" disabled>Select an option</option>
          {REFERRAL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Privacy consent */}
      <label className="flex items-start gap-3 cursor-pointer group mt-1">
        <div
          role="checkbox"
          aria-checked={agreed}
          tabIndex={0}
          onClick={() => setAgreed(a => !a)}
          onKeyDown={e => e.key === ' ' && setAgreed(a => !a)}
          className={`mt-0.5 w-4 h-4 flex-shrink-0 border flex items-center justify-center transition-colors ${
            agreed ? 'border-gold bg-gold' : 'border-white/20 group-hover:border-white/40'
          }`}
        >
          {agreed && <span className="text-black text-[10px] font-bold leading-none">✓</span>}
        </div>
        <span className="text-muted text-[0.8rem] leading-[1.65] select-none">
          I agree to be contacted by ELIV8 LYF FZE regarding my enquiry. We respect your privacy and will never share your details with third parties.
        </span>
      </label>

      {status === 'error' && (
        <div className="bg-red-900/20 border border-red-500/30 text-cream px-5 py-4 text-[0.88rem]">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || !agreed}
        className="w-full flex items-center justify-center gap-2.5 px-9 py-4 bg-gold text-black font-syne font-bold text-[0.9rem] tracking-[0.04em] transition-all hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending…' : 'Send Message →'}
      </button>

    </form>
  )
}
