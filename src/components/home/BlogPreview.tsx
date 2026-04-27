import Link from 'next/link'
import Image from 'next/image'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import { getPosts } from '@/lib/wordpress'

export default async function BlogPreview() {
  let posts = []
  try { posts = await getPosts(1, 3) } catch { return null }
  if (!posts.length) return null

  return (
    <section className="bg-(--sage-light) py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <SectionHeader eyebrow="Блог" title="Статии и вдъхновения" />
          <Button href="/blog" variant="ghost" className="hidden md:inline-flex shrink-0">Всички статии →</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => {
            const image = post._embedded?.['wp:featuredmedia']?.[0]
            return (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white block rounded-2xl overflow-hidden border border-(--border) hover:border-(--sage) transition-colors">
                <div className="aspect-video bg-(--sage)/20 relative overflow-hidden">
                  {image && (
                    <Image
                      src={encodeURI(image.source_url)}
                      alt={image.alt_text || ''}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized
                    />
                  )}
                </div>
                <div className="p-6">
                  <h3
                    className="font-serif text-xl text-(--text-dark) mb-3 group-hover:text-(--sage) transition-colors line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <div
                    className="text-sm text-(--text-muted) line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                </div>
              </Link>
            )
          })}
        </div>
        <div className="md:hidden mt-8 text-center">
          <Button href="/blog" variant="outline">Всички статии</Button>
        </div>
      </div>
    </section>
  )
}
