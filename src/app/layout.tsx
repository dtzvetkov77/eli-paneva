import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart/CartContext'
import SiteChrome from '@/components/layout/SiteChrome'

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
    default: 'Ели Панева | Холистичен консултант и трансформационен коуч',
    template: '%s | Ели Панева',
  },
  description: 'Холистичен консултант, трансформационен коуч и автор. Системни констелации, PSYCH-K®, енергийна психология и МАК карти в София.',
  keywords: ['холистичен консултант', 'системни констелации', 'PSYCH-K', 'МАК карти', 'трансформационен коуч', 'енергийна психология'],
  authors: [{ name: 'Ели Панева' }],
  creator: 'Ели Панева',
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    url: 'https://elipaneva.com',
    siteName: 'Ели Панева',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://elipaneva.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          <SiteChrome>{children}</SiteChrome>
        </CartProvider>
      </body>
    </html>
  )
}
