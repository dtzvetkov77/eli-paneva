import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { put } from '@vercel/blob'

const TOKEN = process.env.BLOB_READ_WRITE_TOKEN!

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!TOKEN) return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not set in environment' }, { status: 500 })
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    const ext = file.name.split('.').pop() ?? 'jpg'
    const name = `blog-images/${Date.now()}.${ext}`
    const blob = await put(name, file, {
      access: 'public', contentType: file.type || 'image/jpeg', addRandomSuffix: false, token: TOKEN,
    })
    return NextResponse.json({ url: blob.url })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
