import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import ImageManager from './ImageManager'

export default async function ImagesPage() {
  if (!(await isAuthenticated())) redirect('/admin/login')
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Снимки</h1>
        <p className="text-gray-500 text-sm">Снимките се качват директно в WordPress медия библиотека и са достъпни чрез URL на elipaneva.com.</p>
      </div>
      <ImageManager />
    </div>
  )
}
