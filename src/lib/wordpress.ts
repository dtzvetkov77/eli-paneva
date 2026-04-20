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

const WP_API = process.env.WP_API_URL!

export async function getPosts(page = 1, perPage = 10): Promise<WPPost[]> {
  const url = `${WP_API}/posts?per_page=${perPage}&page=${page}&_embed=wp:featuredmedia`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  return res.json()
}

export async function getPost(slug: string): Promise<WPPost | null> {
  const url = `${WP_API}/posts?slug=${slug}&_embed=wp:featuredmedia`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return null
  const posts: WPPost[] = await res.json()
  return posts[0] ?? null
}
