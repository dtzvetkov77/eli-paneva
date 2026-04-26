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
      <div className="flex-1 ml-60 min-h-screen">
        <main>{children}</main>
      </div>
    </div>
  )
}
