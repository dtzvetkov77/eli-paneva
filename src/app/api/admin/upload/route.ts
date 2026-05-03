import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { getSupabaseAdmin } from '@/lib/supabase'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac', 'audio/flac']
const MAX_SIZE = 10 * 1024 * 1024
const BUCKET = 'product-images'

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = getSupabaseAdmin()
  const { data, error } = await sb.storage.from(BUCKET).list('', { limit: 500, sortBy: { column: 'created_at', order: 'desc' } })
  if (error || !data) return NextResponse.json([])
  return NextResponse.json(data.map(file => ({
    url: sb.storage.from(BUCKET).getPublicUrl(file.name).data.publicUrl,
    name: file.name,
    pathname: file.name,
  })))
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Неподдържан формат (разрешени: jpg/png/webp/gif/avif/mp3/wav/ogg/aac/flac)' }, { status: 400 })
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'Максимален размер 10 MB' }, { status: 400 })

  const sb = getSupabaseAdmin()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const pathname = `${Date.now()}-${safeName}`
  const buffer = await file.arrayBuffer()

  const { error } = await sb.storage.from(BUCKET).upload(pathname, buffer, {
    contentType: file.type,
    upsert: false,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = sb.storage.from(BUCKET).getPublicUrl(pathname)
  return NextResponse.json({ url: publicUrl, name: file.name, pathname })
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { pathname } = await req.json()
  if (!pathname) return NextResponse.json({ error: 'No pathname' }, { status: 400 })

  const sb = getSupabaseAdmin()
  const { error } = await sb.storage.from(BUCKET).remove([pathname])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
