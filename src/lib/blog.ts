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

export async function getPosts(page = 1, perPage = 20): Promise<BlogPost[]> {
  const { readBlogPosts } = await import('./supabase-store')
  const all = (await readBlogPosts()).filter(p => p.published)
  const start = (page - 1) * perPage
  return all.slice(start, start + perPage)
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const { readBlogPosts } = await import('./supabase-store')
  const all = await readBlogPosts()
  return all.find(p => p.slug === slug && p.published) ?? null
}
