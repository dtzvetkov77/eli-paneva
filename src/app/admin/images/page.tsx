import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import ImageManager from './ImageManager'

export default async function ImagesPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Снимки</h1>
        <p className="text-gray-500 text-sm">Качени снимки се намират в <code className="bg-gray-100 px-1 rounded">/public/uploads/</code> и са достъпни директно чрез URL.</p>
      </div>
      <ImageManager />
    </div>
  )
}
