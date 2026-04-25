import Link from 'next/link'
import Image from 'next/image'
import type { WPPost } from '@/lib/wordpress'
import { translitSlug } from '@/lib/translit'

export default function BlogCard({ post }: { post: WPPost }) {
  const image = post._embedded?.['wp:featuredmedia']?.[0]
  const date = new Date(post.date).toLocaleDateString('bg-BG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return (
    <Link
      href={`/blog/${translitSlug(post.slug)}`}
      className="group bg-white block border border-(--border) hover:border-(--sage) transition-colors rounded-2xl overflow-hidden"
    >
      <div className="aspect-video bg-(--sage-light) relative overflow-hidden">
        {image && (
          <Image
            src={image.source_url}
            alt={image.alt_text || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>
      <div className="p-6">
        <time className="text-xs text-(--gold) uppercase tracking-widest block mb-3">{date}</time>
        <h3
          className="font-serif text-xl text-(--text-dark) mb-3 group-hover:text-(--sage) transition-colors line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <div
          className="text-sm text-(--text-muted) line-clamp-3 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
      </div>
    </Link>
  )
}
