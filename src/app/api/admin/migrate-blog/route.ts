import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { put, list } from '@vercel/blob'
import type { BlogPost } from '@/app/api/admin/blog/route'

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN!
const WP_API = process.env.WP_API_URL ?? 'https://elipaneva.com/wp-json/wp/v2'

interface WPPost {
  id: number
  slug: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  date: string
  status: string
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim()
}

async function fetchAllWPPosts(): Promise<WPPost[]> {
  const all: WPPost[] = []
  let page = 1
  while (true) {
    const url = `${WP_API}/posts?per_page=100&page=${page}&status=publish&_embed=1`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) break
    const posts: WPPost[] = await res.json()
    if (!posts.length) break
    all.push(...posts)
    const total = parseInt(res.headers.get('X-WP-TotalPages') ?? '1')
    if (page >= total) break
    page++
  }
  return all
}

export async function POST() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!TOKEN) return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not set' }, { status: 500 })

  try {
    // Find existing blob IDs to avoid duplicates
    const { blobs } = await list({ prefix: 'blog/', token: TOKEN })
    const existing = new Set(blobs.map(b => b.pathname))

    const wpPosts = await fetchAllWPPosts()
    if (!wpPosts.length) {
      return NextResponse.json({ error: 'No posts fetched from WordPress — API may not be reachable' }, { status: 502 })
    }

    let migrated = 0
    let skipped = 0

    for (const wp of wpPosts) {
      const id = `wp-${wp.id}`
      const pathname = `blog/${id}.json`

      if (existing.has(pathname)) { skipped++; continue }

      const coverImage = wp._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ''

      const post: BlogPost = {
        id,
        slug: wp.slug,
        title: stripHtml(wp.title.rendered),
        excerpt: wp.excerpt.rendered,
        content: wp.content.rendered,
        date: wp.date,
        coverImage,
        published: true,
      }

      await put(pathname, JSON.stringify(post), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        token: TOKEN,
      })
      migrated++
    }

    return NextResponse.json({ ok: true, migrated, skipped, total: wpPosts.length })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
