import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { list, put, del } from '@vercel/blob'

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN!

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  coverImage: string
  published: boolean
}

async function listPosts(): Promise<BlogPost[]> {
  const { blobs } = await list({ prefix: 'blog/', token: TOKEN })
  const results = await Promise.allSettled(
    blobs.filter(b => b.pathname.endsWith('.json')).map(b => fetch(b.url).then(r => r.json()))
  )
  return results
    .filter((r): r is PromiseFulfilledResult<BlogPost> => r.status === 'fulfilled')
    .map(r => r.value)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const posts = await listPosts()
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body: Omit<BlogPost, 'id' | 'date'> = await req.json()
  const id = Date.now().toString()
  const post: BlogPost = {
    ...body,
    id,
    date: new Date().toISOString(),
    slug: body.slug || id,
  }
  await put(`blog/${post.id}.json`, JSON.stringify(post), {
    access: 'public', contentType: 'application/json', addRandomSuffix: false, token: TOKEN,
  })
  return NextResponse.json(post)
}
