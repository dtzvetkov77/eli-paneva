import { getPosts } from '@/lib/blog'
import BlogCard from '@/components/blog/BlogCard'
import SectionHeader from '@/components/ui/SectionHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Блог',
  description: 'Статии за личностно развитие, системни констелации, тревожност, стрес и вътрешна трансформация от Ели Панева.',
  alternates: { canonical: 'https://elipaneva.com/blog' },
}

export default async function BlogPage() {
  const posts = await getPosts(1, 20)
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <SectionHeader
          eyebrow="Блог"
          title="Статии и вдъхновения"
          subtitle="Размисли за вътрешна промяна, отношения и личностно развитие."
        />
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-serif text-2xl text-(--text-dark) mb-4">Очаквайте скоро нови статии</p>
            <p className="text-(--text-muted)">Работим по нашия блог. Върнете се по-късно.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
