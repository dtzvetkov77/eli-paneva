import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'

const sections = [
  {
    title: 'Снимки',
    desc: 'Качи и управлявай снимки за сайта',
    href: '/admin/images',
    icon: '🖼️',
  },
  {
    title: 'Страници',
    desc: 'Редактирай съдържанието на страниците',
    href: '/admin/pages',
    icon: '📝',
  },
]

export default async function AdminDashboard() {
  if (!(await isAuthenticated())) redirect('/admin/login')

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Добре дошла, Ели</h1>
      <p className="text-gray-500 mb-10">Управление на съдържанието на сайта</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {sections.map(s => (
          <a
            key={s.href}
            href={s.href}
            className="bg-white rounded-2xl border border-gray-200 p-8 hover:border-gray-400 hover:shadow-sm transition-all duration-200 group"
          >
            <div className="text-3xl mb-4">{s.icon}</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700">{s.title}</h2>
            <p className="text-sm text-gray-500">{s.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
