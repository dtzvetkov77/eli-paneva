'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error ?? 'Грешка')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Администрация</h1>
        <p className="text-sm text-gray-500 mb-8">Ели Панева · Управление на сайта</p>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label htmlFor="password" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
              Парола
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Влизане...' : 'Влез'}
          </button>
        </form>
      </div>
    </div>
  )
}
