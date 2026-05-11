import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { headers } from 'next/headers'
import { CartProvider } from '@/components/cart/CartContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import CookieBanner from '@/components/ui/CookieBanner'

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://elipaneva.com'),
  title: {
    default: 'Ели Панева | Холистичен консултант и трансформационен коуч — София',
    template: '%s | Ели Панева',
  },
  description: 'Холистичен консултант и трансформационен коуч в София. Системни констелации, PSYCH-K®, МАК карти, лични консултации и освобождаване на ограничаващи убеждения. Запази час онлайн.',
  keywords: [
    'холистичен консултант София',
    'системни констелации София',
    'PSYCH-K България',
    'МАК карти',
    'трансформационен коуч',
    'семейни констелации',
    'енергийна психология',
    'ограничаващи убеждения',
    'Ели Панева',
    'личностно развитие',
  ],
  authors: [{ name: 'Ели Панева' }],
  creator: 'Ели Панева',
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    url: 'https://elipaneva.com',
    siteName: 'Ели Панева',
    images: [{ url: '/eli-photo.webp', width: 1200, height: 630, alt: 'Ели Панева — Холистичен консултант и трансформационен коуч' }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://elipaneva.com' },
  other: {
    'geo.region': 'BG-22',
    'geo.placename': 'София',
    'geo.position': '42.6977;23.3219',
    ICBM: '42.6977, 23.3219',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''
  const isAdmin = pathname.startsWith('/admin')

  return (
    <html lang="bg" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          {isAdmin ? (
            children
          ) : (
            <>
              <Navbar />
              <CartDrawer />
              <main>{children}</main>
              <Footer />
              <CookieBanner />
            </>
          )}
        </CartProvider>
      </body>
    </html>
  )
}
