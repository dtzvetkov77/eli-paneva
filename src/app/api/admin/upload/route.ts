import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

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

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const uploadsDir = join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadsDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(join(uploadsDir, safeName), buffer)

  return NextResponse.json({ url: `/uploads/${safeName}`, name: safeName })
}
