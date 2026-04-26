import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/lib/blog'

export default function BlogCard({ post }: { post: BlogPost }) {
  const date = new Date(post.date).toLocaleDateString('bg-BG', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group bg-white block border border-(--border) hover:border-(--sage) transition-colors rounded-2xl overflow-hidden"
    >
      <div className="aspect-video bg-(--sage-light) relative overflow-hidden">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>
      <div className="p-6">
        <time className="text-xs text-(--gold) uppercase tracking-widest block mb-3">{date}</time>
        <h3 className="font-serif text-xl text-(--text-dark) mb-3 group-hover:text-(--sage) transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-(--text-muted) line-clamp-3 leading-relaxed">
          {post.excerpt.replace(/<[^>]+>/g, '')}
        </p>
      </div>
    </Link>
  )
}
