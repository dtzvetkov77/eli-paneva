import { MetadataRoute } from 'next'
import { getProducts, getCategories } from '@/lib/woocommerce'
import { getPosts } from '@/lib/wordpress'
import { services } from '@/data/services'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://elipaneva.com'

  let products: Awaited<ReturnType<typeof getProducts>> = []
  let posts: Awaited<ReturnType<typeof getPosts>> = []
  let categories: Awaited<ReturnType<typeof getCategories>> = []

  try {
    ;[products, posts, categories] = await Promise.all([getProducts(), getPosts(1, 100), getCategories()])
  } catch {
    // Fallback to empty arrays if API unavailable during build
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/za-men`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/uslugi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/mac-karti`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/kursove`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/programi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/kontakti`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const servicePages: MetadataRoute.Sitemap = services.map(s => ({
    url: `${base}/uslugi/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const productPages: MetadataRoute.Sitemap = products.map(p => ({
    url: `${base}/shop/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const blogPages: MetadataRoute.Sitemap = posts.map(p => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories
    .filter(c => !['uncategorized', 'без-категория'].includes(c.slug.toLowerCase()))
    .map(c => ({
      url: `${base}/shop/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

  return [...staticPages, ...servicePages, ...productPages, ...blogPages, ...categoryPages]
}
