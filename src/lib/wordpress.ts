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
    // Try direct WP slug lookup (works if slug is original Cyrillic or Latin)
    const u = new URL(`${WP_API}/posts`)
    u.searchParams.set('slug', decodeURIComponent(slug))
    u.searchParams.set('_embed', 'wp:featuredmedia')
    const res = await fetch(u.toString(), { next: { revalidate: 3600 } })
    if (res.ok) {
      const posts: WPPost[] = await res.json()
      if (posts.length > 0) return posts[0]
    }

    // Fallback: slug arriving here is transliterated Latin — fetch all posts
    // and match by transliterating each WP slug
    const allRes = await fetch(
      `${WP_API}/posts?per_page=100&_embed=wp:featuredmedia`,
      { next: { revalidate: 3600 } }
    )
    if (!allRes.ok) return null
    const allPosts: WPPost[] = await allRes.json()
    return allPosts.find(p => translitSlug(p.slug) === slug) ?? null
  } catch {
    return null
  }
}
