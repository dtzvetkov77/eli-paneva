import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { readBlogPost, writeBlogPost, deleteBlogPost } from '@/lib/supabase-store'

interface Ctx { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const post = await readBlogPost(id)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const existing = await readBlogPost(id)
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const updated = {
    ...existing,
    title: body.title ?? existing.title,
    slug: body.slug ?? existing.slug,
    excerpt: body.excerpt ?? existing.excerpt,
    content: body.content ?? existing.content,
    coverImage: body.coverImage ?? existing.coverImage,
    published: body.published !== undefined ? body.published : existing.published,
  }
  await writeBlogPost(updated)
  return NextResponse.json({ ok: true, post: updated })
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await deleteBlogPost(id)
  return NextResponse.json({ ok: true })
}
