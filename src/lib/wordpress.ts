import { translitSlug } from '@/lib/translit'

export interface WPPost {
  id: number
  slug: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
  date: string
  modified: string
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
    // Step 1: scan all post slugs (no embed — lightweight, fast)
    let cyrillicSlug: string | null = null
    let page = 1
    while (page <= 10) {
      const r = await fetch(
        `${WP_API}/posts?per_page=100&page=${page}&_fields=slug`,
        { next: { revalidate: 3600 } }
      )
      if (!r.ok) break
      const batch: Array<{ slug: string }> = await r.json()
      if (batch.length === 0) break
      const match = batch.find(
        p => translitSlug(p.slug) === slug || p.slug === slug || decodeURIComponent(p.slug) === slug
      )
      if (match) { cyrillicSlug = decodeURIComponent(match.slug); break }
      if (batch.length < 100) break
      page++
    }
    if (!cyrillicSlug) return null

    // Step 2: fetch the specific post by its Cyrillic slug with embed
    const u = new URL(`${WP_API}/posts`)
    u.searchParams.set('slug', cyrillicSlug)
    u.searchParams.set('_embed', 'wp:featuredmedia')
    const r2 = await fetch(u.toString(), { next: { revalidate: 3600 } })
    if (!r2.ok) return null
    const posts: WPPost[] = await r2.json()
    return posts[0] ?? null
  } catch {
    return null
  }
}
