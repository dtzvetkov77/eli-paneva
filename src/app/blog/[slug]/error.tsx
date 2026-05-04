'use client'
import Link from 'next/link'

export default function BlogPostError({ reset }: { reset: () => void }) {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="max-w-lg mx-auto px-6 text-center py-24">
        <p className="text-xs uppercase tracking-[0.25em] text-(--gold) font-medium mb-6">Грешка</p>
        <h1 className="font-serif text-4xl text-(--text-dark) font-normal mb-6">Статията не може да се зареди</h1>
        <p className="text-(--text-muted) leading-relaxed mb-10">Опитайте отново или се върнете към блога.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={reset}
            className="bg-(--sage) text-white text-sm px-6 py-3 hover:bg-(--text-dark) transition-colors"
          >
            Опитай отново
          </button>
          <Link href="/blog" className="border border-(--border) text-(--text-muted) text-sm px-6 py-3 hover:border-(--sage) hover:text-(--sage) transition-colors">
            Към блога
          </Link>
        </div>
      </div>
    </div>
  )
}
