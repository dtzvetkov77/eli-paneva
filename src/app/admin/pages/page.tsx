import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'

const editablePages = [
  { slug: 'home', label: 'Начална страница', path: '/' },
  { slug: 'za-men', label: 'За мен', path: '/za-men' },
  { slug: 'kontakti', label: 'Контакти', path: '/kontakti' },
  { slug: 'cta_section', label: 'CTA секция (долу)', path: '/' },
]

export default async function PagesListPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Страници</h1>
      <p className="text-gray-500 text-sm mb-10">Редактирай текстовото съдържание на страниците.</p>

      <div className="space-y-3">
        {editablePages.map(p => (
          <a
            key={p.slug}
            href={`/admin/pages/${p.slug}`}
            className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 px-6 py-5 hover:border-gray-400 transition-colors group"
          >
            <div>
              <p className="font-medium text-gray-900">{p.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.path}</p>
            </div>
            <span className="text-gray-400 group-hover:text-gray-700 transition-colors text-lg">›</span>
          </a>
        ))}
      </div>
    </div>
  )
}
