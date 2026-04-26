import { isAuthenticated } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { list } from '@vercel/blob'
import { notFound } from 'next/navigation'
import BlogEditorClient from './BlogEditorClient'
import type { BlogPost } from '@/app/api/admin/blog/route'

async function fetchPost(id: string): Promise<BlogPost | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return null
  if (id === 'new') return null
  try {
    const { blobs } = await list({ prefix: `blog/${id}.json`, token })
    if (!blobs[0]) return null
    const res = await fetch(blobs[0].url, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export default async function BlogEditorPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect('/admin/login')
  const { id } = await params
  const isNew = id === 'new'
  const post = isNew ? null : await fetchPost(id)
  if (!isNew && !post) notFound()

  return <BlogEditorClient post={post} />
}
