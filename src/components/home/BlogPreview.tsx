import Link from 'next/link'
import Image from 'next/image'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import { getPosts } from '@/lib/blog'

export default async function BlogPreview() {
  let posts = []
  try {
    posts = await getPosts(1, 3)
  } catch {
    return null
  }
  if (!posts.length) return null

  return (
    <section className="bg-(--sage-light) py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <SectionHeader eyebrow="Блог" title="Статии и вдъхновения" />
          <Button href="/blog" variant="ghost" className="hidden md:inline-flex shrink-0">Всички статии →</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white block rounded-2xl overflow-hidden border border-(--border) hover:border-(--sage) transition-colors">
              <div className="aspect-video bg-(--sage)/20 relative overflow-hidden">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                )}
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-(--text-dark) mb-3 group-hover:text-(--sage) transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-(--text-muted) line-clamp-3">
                  {post.excerpt.replace(/<[^>]+>/g, '')}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="md:hidden mt-8 text-center">
          <Button href="/blog" variant="outline">Всички статии</Button>
        </div>
      </div>
    </section>
  )
}
