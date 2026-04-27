import { list } from '@vercel/blob'

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

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN

export async function getPosts(page = 1, perPage = 20): Promise<BlogPost[]> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return []
  try {
    const { blobs } = await list({ prefix: 'blog/', token })
    const results = await Promise.allSettled(
      blobs.filter(b => b.pathname.endsWith('.json')).map(b =>
        fetch(b.url, { cache: 'no-store' }).then(r => r.json())
      )
    )
    const all = results
      .filter((r): r is PromiseFulfilledResult<BlogPost> => r.status === 'fulfilled')
      .map(r => r.value)
      .filter(p => p.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const start = (page - 1) * perPage
    return all.slice(start, start + perPage)
  } catch { return [] }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return null
  try {
    const { blobs } = await list({ prefix: 'blog/', token })
    const results = await Promise.allSettled(
      blobs.filter(b => b.pathname.endsWith('.json')).map(b =>
        fetch(b.url, { cache: 'no-store' }).then(r => r.json())
      )
    )
    return results
      .filter((r): r is PromiseFulfilledResult<BlogPost> => r.status === 'fulfilled')
      .map(r => r.value)
      .find(p => p.slug === slug && p.published) ?? null
  } catch { return null }
}
