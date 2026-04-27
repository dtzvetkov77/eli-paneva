import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://elipaneva.com https://*.wp.com https://*.googleapis.com https://*.gstatic.com https://*.google.com https://*.public.blob.vercel.storage https://*.supabase.co",
      "frame-src https://www.google.com https://maps.google.com https://www.google.com/maps/",
      "connect-src 'self' https://elipaneva.com https://*.googleapis.com",
    ].join('; '),
  },
]

const config: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'elipaneva.com' },
      { protocol: 'https', hostname: '*.elipaneva.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel.storage' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}

export default config
