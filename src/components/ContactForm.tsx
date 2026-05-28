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

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
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
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const inputCls = 'bg-panel border border-white/[0.07] text-cream placeholder:text-cream/25 px-[18px] py-3.5 font-dm text-[0.9rem] outline-none w-full transition-colors focus:border-gold appearance-none'
  const labelCls = 'text-[0.72rem] tracking-[0.1em] text-muted uppercase'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className={labelCls}>First Name</label>
          <input name="first_name" type="text" placeholder="Amara" required className={inputCls} />
        </div>
        <div className="flex flex-col gap-2">
          <label className={labelCls}>Last Name</label>
          <input name="last_name" type="text" placeholder="Osei" required className={inputCls} />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Work Email</label>
        <input name="email" type="email" placeholder="you@company.com" required className={inputCls} />
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Organisation</label>
        <input name="organisation" type="text" placeholder="Your company name" className={inputCls} />
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Area of Interest</label>
        <select name="service" className={inputCls} defaultValue="">
          <option value="" disabled>Select a service area</option>
          {SERVICES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="flex flex-col gap-2">
        <label className={labelCls}>Message</label>
        <textarea name="message" placeholder="Tell us about your challenge or opportunity…" rows={5} className={`${inputCls} resize-y`} />
      </div>

      {status === 'success' && (
        <div className="bg-accent/20 border border-accent-bright/40 text-cream px-5 py-4 text-[0.88rem]">
          Thank you — we&apos;ll be in touch within 24 hours.
        </div>
      )}
      {status === 'error' && (
        <div className="bg-red-900/20 border border-red-500/40 text-cream px-5 py-4 text-[0.88rem]">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full flex items-center justify-center gap-2.5 px-9 py-4 bg-gold text-black font-syne font-bold text-[0.9rem] tracking-[0.04em] transition-all hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending…' : 'Send Message →'}
      </button>
    </form>
  )
}
