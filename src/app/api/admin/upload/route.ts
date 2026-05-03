import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { getSupabaseAdmin } from '@/lib/supabase'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac', 'audio/flac']
const ALLOWED_TYPES = [...IMAGE_TYPES, ...AUDIO_TYPES]

const IMAGE_BUCKET = 'product-images'
const AUDIO_BUCKET = 'product-audio'
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_AUDIO_SIZE = 100 * 1024 * 1024

async function ensureAudioBucket(sb: ReturnType<typeof getSupabaseAdmin>) {
  // Try create — ignore error if already exists
  await sb.storage.createBucket(AUDIO_BUCKET, {
    public: true,
    allowedMimeTypes: AUDIO_TYPES,
    fileSizeLimit: MAX_AUDIO_SIZE,
  })
  // Always enforce public + allowed MIME types (in case bucket was created manually as private)
  await sb.storage.updateBucket(AUDIO_BUCKET, {
    public: true,
    allowedMimeTypes: AUDIO_TYPES,
    fileSizeLimit: MAX_AUDIO_SIZE,
  })
}

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sb = getSupabaseAdmin()
  const { data, error } = await sb.storage.from(IMAGE_BUCKET).list('', { limit: 500, sortBy: { column: 'created_at', order: 'desc' } })
  if (error || !data) return NextResponse.json([])
  return NextResponse.json(data.map(file => ({
    url: sb.storage.from(IMAGE_BUCKET).getPublicUrl(file.name).data.publicUrl,
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

  const isAudio = AUDIO_TYPES.includes(file.type)
  const maxSize = isAudio ? MAX_AUDIO_SIZE : MAX_IMAGE_SIZE
  if (file.size > maxSize) return NextResponse.json({ error: `Максимален размер ${isAudio ? '100' : '10'} MB` }, { status: 400 })

  const sb = getSupabaseAdmin()

  if (isAudio) await ensureAudioBucket(sb)

  const bucket = isAudio ? AUDIO_BUCKET : IMAGE_BUCKET
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const pathname = `${Date.now()}-${safeName}`
  const buffer = await file.arrayBuffer()

  const { error } = await sb.storage.from(bucket).upload(pathname, buffer, {
    contentType: file.type,
    upsert: false,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = sb.storage.from(bucket).getPublicUrl(pathname)
  return NextResponse.json({ url: publicUrl, name: file.name, pathname: `${bucket}/${pathname}` })
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { pathname } = await req.json()
  if (!pathname) return NextResponse.json({ error: 'No pathname' }, { status: 400 })

  const sb = getSupabaseAdmin()

  // pathname format: "bucket/filename" or legacy "filename" (images bucket)
  let bucket = IMAGE_BUCKET
  let filename = pathname
  if (pathname.startsWith(`${AUDIO_BUCKET}/`)) {
    bucket = AUDIO_BUCKET
    filename = pathname.slice(AUDIO_BUCKET.length + 1)
  } else if (pathname.startsWith(`${IMAGE_BUCKET}/`)) {
    filename = pathname.slice(IMAGE_BUCKET.length + 1)
  }

  const { error } = await sb.storage.from(bucket).remove([filename])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
