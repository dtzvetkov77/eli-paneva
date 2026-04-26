import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Само изображения (jpg/png/webp/gif)' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Максимален размер 10 MB' }, { status: 400 })
  }

  const wpUrl = process.env.WP_API_URL
  const wpUser = process.env.WP_USERNAME
  const wpPass = process.env.WP_APP_PASSWORD

  if (!wpUrl || !wpUser || !wpPass) {
    return NextResponse.json(
      { error: 'WP credentials not configured — add WP_USERNAME and WP_APP_PASSWORD to Vercel env vars' },
      { status: 500 }
    )
  }

  const credentials = Buffer.from(`${wpUser}:${wpPass}`).toString('base64')
  const bytes = await file.arrayBuffer()

  const wpRes = await fetch(`${wpUrl}/media`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.name)}"`,
      'Content-Type': file.type,
    },
    body: bytes,
  })

  if (!wpRes.ok) {
    const err = await wpRes.text()
    console.error('WP media upload error:', err)
    return NextResponse.json({ error: 'Грешка при качване в WordPress' }, { status: 500 })
  }

  const media = await wpRes.json()
  return NextResponse.json({
    url: media.source_url as string,
    name: file.name,
    id: media.id as number,
  })
}
