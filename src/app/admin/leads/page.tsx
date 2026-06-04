'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Lead } from '@/lib/supabase/types'

type LeadRow = Lead & { ip_address?: string | null }

const STATUSES = ['all', 'new', 'read', 'contacted']

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    let q = (supabase.from('leads') as any).select('*').order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setLeads(data ?? [])
    setLoading(false)
  }, [filter])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  async function updateStatus(id: string, status: string) {
    const supabase = createClient()
    await (supabase.from('leads') as any).update({ status }).eq('id', id)
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>Leads</h1>
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 text-xs tracking-widest uppercase border transition-colors ${filter === s ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-white/[0.07] text-white/40 hover:text-white'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111318] border border-white/[0.07]">
        {loading ? (
          <div className="px-6 py-10 text-white/30 text-sm">Loading…</div>
        ) : leads.length === 0 ? (
          <div className="px-6 py-10 text-white/30 text-sm">No leads found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  {['Name', 'Email', 'Phone', 'Organisation', 'Country', 'Service', 'Referral', 'Message', 'IP Address', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-white/30 text-xs tracking-widest uppercase font-normal whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <>
                    <tr
                      key={lead.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] align-top cursor-pointer"
                      onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                    >
                      <td className="px-4 py-4 text-white whitespace-nowrap">{lead.first_name} {lead.last_name}</td>
                      <td className="px-4 py-4 text-white/60 whitespace-nowrap">{lead.email}</td>
                      <td className="px-4 py-4 text-white/60 whitespace-nowrap">{lead.phone ?? '—'}</td>
                      <td className="px-4 py-4 text-white/60">{lead.organisation ?? '—'}</td>
                      <td className="px-4 py-4 text-white/60 whitespace-nowrap">{lead.country ?? '—'}</td>
                      <td className="px-4 py-4 text-white/60 whitespace-nowrap">{lead.service ?? '—'}</td>
                      <td className="px-4 py-4 text-white/60 whitespace-nowrap">{lead.referral_source ?? '—'}</td>
                      <td className="px-4 py-4 text-white/40 max-w-[160px]">
                        <span className="line-clamp-2 text-xs">{lead.message ?? '—'}</span>
                      </td>
                      <td className="px-4 py-4 text-white/30 text-xs whitespace-nowrap font-mono">{lead.ip_address ?? '—'}</td>
                      <td className="px-4 py-4 text-white/30 text-xs whitespace-nowrap">{formatDate(lead.created_at)}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 text-xs rounded-sm ${lead.status === 'new' ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : lead.status === 'contacted' ? 'bg-green-900/30 text-green-400' : 'bg-white/[0.06] text-white/40'}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                          {lead.status !== 'read' && (
                            <button onClick={() => updateStatus(lead.id, 'read')} className="text-xs text-white/40 hover:text-white transition-colors whitespace-nowrap">Mark Read</button>
                          )}
                          {lead.status !== 'contacted' && (
                            <button onClick={() => updateStatus(lead.id, 'contacted')} className="text-xs text-[#c9a84c]/60 hover:text-[#c9a84c] transition-colors whitespace-nowrap">Mark Contacted</button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expanded === lead.id && (
                      <tr key={`${lead.id}-expanded`} className="border-b border-white/[0.04] bg-white/[0.01]">
                        <td colSpan={12} className="px-6 py-4">
                          <div className="text-xs text-white/50 leading-relaxed whitespace-pre-wrap">
                            <span className="text-white/30 uppercase tracking-widest mr-2">Message:</span>
                            {lead.message || '—'}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
