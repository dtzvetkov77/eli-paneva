'use client'

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="pt-16 min-h-dvh flex items-center justify-center">
      <div className="text-center px-6">
        <p className="font-serif text-2xl text-(--text-dark) mb-3">Грешка при зареждане</p>
        <p className="text-sm text-(--text-muted) mb-2">{error.message}</p>
        {error.digest && <p className="text-xs text-(--text-muted) font-mono mb-6">{error.digest}</p>}
        <button
          onClick={reset}
          className="text-sm text-(--sage) border border-(--sage) px-6 py-2 rounded-full hover:bg-(--sage) hover:text-white transition-all"
        >
          Опитай отново
        </button>
      </div>
    </div>
  )
}
