import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { list } from '@vercel/blob'
import Link from 'next/link'
import type { BlogPost } from '@/app/api/admin/blog/route'
import MigrateBlogButton from './MigrateBlogButton'

async function fetchPosts(): Promise<BlogPost[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return []
  try {
    const { blobs } = await list({ prefix: 'blog/', token })
    const results = await Promise.allSettled(
      blobs.filter(b => b.pathname.endsWith('.json')).map(b =>
        fetch(b.url, { cache: 'no-store' }).then(r => r.json())
      )
    )
    return results
      .filter((r): r is PromiseFulfilledResult<BlogPost> => r.status === 'fulfilled')
      .map(r => r.value)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch { return [] }
}

export default async function AdminBlogPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')
  const posts = await fetchPosts()

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <a href="/admin" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Назад</a>
          <span className="text-gray-300">/</span>
          <h1 className="text-2xl font-semibold text-gray-900">Блог</h1>
        </div>
        <div className="flex items-center gap-3">
          <MigrateBlogButton />
          <Link href="/admin/blog/new" className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors">
            + Нова статия
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400 text-sm mb-4">Все още няма статии.</p>
          <p className="text-gray-400 text-xs mb-6">Използвай бутона „Импорт от WordPress" за да прехвърлиш съществуващите статии.</p>
          <Link href="/admin/blog/new" className="text-sm text-gray-900 underline">Създай първата статия →</Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-widest text-gray-400">
                <th className="text-left px-6 py-4 font-medium">Заглавие</th>
                <th className="text-left px-6 py-4 font-medium">Дата</th>
                <th className="text-left px-6 py-4 font-medium">Статус</th>
                <th className="text-right px-6 py-4 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 line-clamp-1">{post.title || '(без заглавие)'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(post.date).toLocaleDateString('bg-BG')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                      post.published
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}>
                      {post.published ? 'Публикувана' : 'Чернова'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/blog/${post.id}`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Редактирай
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
