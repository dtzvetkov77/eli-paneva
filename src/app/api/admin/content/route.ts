import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/admin-auth'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { revalidatePath } from 'next/cache'

const CONTENT_FILE = join(process.cwd(), 'src', 'data', 'site-content.json')

export async function GET() {
  try {
    const raw = await readFile(CONTENT_FILE, 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json({})
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  // Validate it's a plain object
  if (typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  await writeFile(CONTENT_FILE, JSON.stringify(body, null, 2), 'utf-8')

  // Revalidate all pages that use this content
  revalidatePath('/', 'layout')

  return NextResponse.json({ ok: true })
}
