import { isAuthenticated } from '@/lib/admin-auth'
import AdminNavbar from './AdminNavbar'

export const metadata = { title: 'Админ | Ели Панева', robots: { index: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated()
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {authed && <AdminNavbar />}
      {children}
    </div>
  )
}
