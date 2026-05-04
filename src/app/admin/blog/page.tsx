import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { readBlogPosts } from '@/lib/supabase-store'

export default async function AdminBlogPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')
  const posts = await readBlogPosts()

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Блог</h1>
          <p className="text-sm text-gray-400 mt-1">{posts.length} публикации</p>
        </div>
        <a
          href="/admin/blog/new"
          className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Нова публикация
        </a>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 opacity-30"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <p className="text-sm">Няма публикации</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <a
              key={post.id}
              href={`/admin/blog/${post.id}`}
              className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-5 py-4 hover:border-gray-300 transition-colors group"
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{post.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.published ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                    {post.published ? 'Публикувана' : 'Чернова'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString('bg-BG')}
                  </span>
                  {post.excerpt && (
                    <span className="text-xs text-gray-400 truncate hidden sm:block max-w-xs">{post.excerpt}</span>
                  )}
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 group-hover:text-gray-600 shrink-0 ml-4 transition-colors"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
