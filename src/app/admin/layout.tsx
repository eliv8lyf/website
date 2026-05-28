import AdminNav from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#050608] text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
      <AdminNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
