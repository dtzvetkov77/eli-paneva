import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
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
    <html lang="bg" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
