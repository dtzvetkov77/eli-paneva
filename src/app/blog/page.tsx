import { getPosts } from '@/lib/blog'
import Link from 'next/link'
import Image from 'next/image'
import StructuredData from '@/components/ui/StructuredData'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Блог',
  description: 'Статии за личностно развитие, системни констелации, МАК карти, тревожност и вътрешна трансформация от Ели Панева — холистичен консултант в София.',
  alternates: { canonical: 'https://elipaneva.com/blog' },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Начало', item: 'https://elipaneva.com' },
    { '@type': 'ListItem', position: 2, name: 'Блог', item: 'https://elipaneva.com/blog' },
  ],
}

export const revalidate = 60

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="pt-16">
      <StructuredData data={breadcrumbSchema} />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-(--gold) font-medium block mb-4">Блог</span>
          <h1 className="font-serif text-4xl md:text-5xl text-(--text-dark) font-light">Статии и вдъхновения</h1>
        </div>

        {posts.length === 0 ? (
          <p className="text-(--text-muted)">Няма публикувани статии.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="aspect-video bg-(--sage-light) relative overflow-hidden rounded-sm mb-4">
                  {post.coverImage && (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>
                <time className="text-xs text-(--gold) uppercase tracking-widest block mb-2">
                  {new Date(post.date).toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                <h2 className="font-serif text-xl text-(--text-dark) mb-2 group-hover:text-(--sage) transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-(--text-muted) line-clamp-3 leading-relaxed">{post.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
