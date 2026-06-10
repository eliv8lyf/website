import { createServiceClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function AdminDashboard() {
  const supabase = await createServiceClient()

  const [{ count: leadCount }, { count: postCount }, { data: recentLeads }] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold text-white mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Leads', value: leadCount ?? 0 },
          { label: 'Total Posts', value: postCount ?? 0 },
        ].map(stat => (
          <div key={stat.label} className="bg-[#111318] border border-white/[0.07] p-6">
            <div className="text-[2rem] font-extrabold text-[#c9a84c] leading-none mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>{stat.value}</div>
            <div className="text-white/40 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-[#111318] border border-white/[0.07]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h2 className="font-semibold text-white text-sm tracking-wide">Recent Leads</h2>
          <Link href="/admin/leads" className="text-[#c9a84c] text-xs hover:underline">View all</Link>
        </div>
        {!recentLeads || recentLeads.length === 0 ? (
          <div className="px-6 py-10 text-white/30 text-sm">No leads yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.07]">
                {['Name', 'Email', 'Organisation', 'Service', 'Date', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-white/30 text-xs tracking-widest uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLeads.map(lead => (
                <tr key={lead.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                  <td className="px-6 py-3 text-white">{lead.first_name} {lead.last_name}</td>
                  <td className="px-6 py-3 text-white/60">{lead.email}</td>
                  <td className="px-6 py-3 text-white/60">{lead.organisation}</td>
                  <td className="px-6 py-3 text-white/60">{lead.service}</td>
                  <td className="px-6 py-3 text-white/40 text-xs">{formatDate(lead.created_at)}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-sm ${lead.status === 'new' ? 'bg-[#c9a84c]/20 text-[#c9a84c]' : 'bg-white/[0.06] text-white/40'}`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
