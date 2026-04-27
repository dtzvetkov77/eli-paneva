import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { put, list, del } from '@vercel/blob'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_SIZE = 10 * 1024 * 1024

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return NextResponse.json([])
  try {
    const { blobs } = await list({ prefix: 'images/', token })
    return NextResponse.json(blobs.map(b => ({ url: b.url, name: b.pathname.split('/').pop() ?? b.pathname, pathname: b.pathname })))
  } catch { return NextResponse.json([]) }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not set' }, { status: 500 })
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: 'Само изображения (jpg/png/webp/gif)' }, { status: 400 })
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'Максимален размер 10 MB' }, { status: 400 })
  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const pathname = `images/${Date.now()}-${safeName}`
    const blob = await put(pathname, file, { access: 'public', contentType: file.type, addRandomSuffix: false, token })
    return NextResponse.json({ url: blob.url, name: file.name, pathname })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not set' }, { status: 500 })
  const { url } = await req.json()
  try {
    await del(url, { token })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
