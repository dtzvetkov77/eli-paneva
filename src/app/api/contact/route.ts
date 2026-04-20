import { NextRequest, NextResponse } from 'next/server'

function sanitize(str: string): string {
  return str.replace(/[<>'"]/g, '').trim().slice(0, 1000)
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const name = sanitize(formData.get('name')?.toString() ?? '')
    const email = sanitize(formData.get('email')?.toString() ?? '')
    const phone = sanitize(formData.get('phone')?.toString() ?? '')
    const service = sanitize(formData.get('service')?.toString() ?? '')
    const message = sanitize(formData.get('message')?.toString() ?? '')

    if (!name || !email || !message) {
      return NextResponse.redirect(new URL('/kontakti?status=error', req.url))
    }

    if (!emailRegex.test(email)) {
      return NextResponse.redirect(new URL('/kontakti?status=error', req.url))
    }

    // Log submission — connect to Resend/SendGrid in production
    console.log('[Contact form]', { name, email, phone, service, message: message.slice(0, 200) })

    return NextResponse.redirect(new URL('/kontakti?status=success', req.url))
  } catch {
    return NextResponse.redirect(new URL('/kontakti?status=error', req.url))
  }
}
