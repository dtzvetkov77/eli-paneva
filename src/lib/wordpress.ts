import { translitSlug } from '@/lib/translit'

export interface WPPost {
  id: number
  slug: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  date: string
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>
  }
}

const WP_API = process.env.WP_API_URL

export async function getPosts(page = 1, perPage = 10): Promise<WPPost[]> {
  if (!WP_API) return []
  try {
    const url = `${WP_API}/posts?per_page=${perPage}&page=${page}&_embed=wp:featuredmedia`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function getPost(slug: string): Promise<WPPost | null> {
  if (!WP_API) return null
  try {
    // Try direct WP slug lookup (decoded — covers Cyrillic or Latin slugs)
    const u = new URL(`${WP_API}/posts`)
    u.searchParams.set('slug', decodeURIComponent(slug))
    u.searchParams.set('_embed', 'wp:featuredmedia')
    const res = await fetch(u.toString(), { cache: 'no-store' })
    if (res.ok) {
      const posts: WPPost[] = await res.json()
      if (posts.length > 0) return posts[0]
    }

    // Fallback: incoming slug is transliterated Latin; fetch all posts across pages
    // and match by transliterating the WP slug
    let page = 1
    while (page <= 5) {
      const pageRes = await fetch(
        `${WP_API}/posts?per_page=100&page=${page}&_embed=wp:featuredmedia`,
        { cache: 'no-store' }
      )
      if (!pageRes.ok) break
      const batch: WPPost[] = await pageRes.json()
      if (batch.length === 0) break
      const match = batch.find(
        p => translitSlug(p.slug) === slug || p.slug === slug || decodeURIComponent(p.slug) === slug
      )
      if (match) return match
      if (batch.length < 100) break
      page++
    }
    return null
  } catch {
    return null
  }
}
