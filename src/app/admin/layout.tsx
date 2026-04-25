import { isAuthenticated } from '@/lib/admin-auth'
import AdminSidebar from './AdminSidebar'

export const metadata = { title: 'Админ | Ели Панева', robots: { index: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated()

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1] font-sans flex">
      <AdminSidebar />
      {/* Main content — offset by sidebar width */}
      <div className="flex-1 ml-60 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="h-10 bg-[#1d2327] flex items-center px-6 shrink-0">
          <span className="text-xs text-white/50">eli-paneva.vercel.app · Администрация</span>
        </header>
        {/* Page content */}
        <main className="flex-1 p-0">
          {children}
        </main>
      </div>
    </div>
  )
}
