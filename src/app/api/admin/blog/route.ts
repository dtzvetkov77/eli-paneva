import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { readBlogPosts, writeBlogPost } from '@/lib/supabase-store'
import type { BlogPost } from '@/lib/blog'
import { randomUUID } from 'crypto'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const posts = await readBlogPosts()
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { title, slug, excerpt, content, coverImage, published } = body
  if (!title?.trim()) return NextResponse.json({ error: 'Заглавието е задължително' }, { status: 400 })

  const id = randomUUID()
  const post: BlogPost = {
    id,
    slug: slug?.trim() || title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '').slice(0, 80),
    title: title.trim(),
    excerpt: excerpt ?? '',
    content: content ?? '',
    coverImage: coverImage ?? '',
    date: new Date().toISOString(),
    published: published ?? false,
  }
  await writeBlogPost(post)
  return NextResponse.json({ ok: true, post })
}
