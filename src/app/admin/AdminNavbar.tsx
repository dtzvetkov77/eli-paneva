'use client'

export default function AdminNavbar() {
  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    window.location.href = '/admin/login'
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <span className="font-semibold text-sm tracking-wide">Ели Панева · Админ</span>
      <div className="flex items-center gap-6">
        <a href="/admin" className="text-xs text-gray-300 hover:text-white transition-colors">Начало</a>
        <a href="/admin/images" className="text-xs text-gray-300 hover:text-white transition-colors">Снимки</a>
        <a href="/admin/pages" className="text-xs text-gray-300 hover:text-white transition-colors">Страници</a>
        <a href="/" target="_blank" className="text-xs text-gray-300 hover:text-white transition-colors">← Сайт</a>
        <button
          onClick={logout}
          className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
        >
          Изход
        </button>
      </div>
    </nav>
  )
}
