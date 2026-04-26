import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

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

    const apiKey = process.env.RESEND_API_KEY
    if (apiKey) {
      const resend = new Resend(apiKey)
      const from = process.env.RESEND_FROM ?? 'onboarding@resend.dev'
      const to = process.env.CONTACT_EMAIL ?? 'elipaneva2023@gmail.com'

      await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `Ново запитване от ${name}${service ? ` — ${service}` : ''}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#1C1C1A;border-bottom:2px solid #6B8F71;padding-bottom:12px">
              Ново запитване от сайта
            </h2>
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:8px 0;color:#6B6B63;width:120px"><strong>Име</strong></td>
                <td style="padding:8px 0;color:#1C1C1A">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#6B6B63"><strong>Имейл</strong></td>
                <td style="padding:8px 0"><a href="mailto:${email}" style="color:#6B8F71">${email}</a></td>
              </tr>
              ${phone ? `<tr>
                <td style="padding:8px 0;color:#6B6B63"><strong>Телефон</strong></td>
                <td style="padding:8px 0;color:#1C1C1A">${phone}</td>
              </tr>` : ''}
              ${service ? `<tr>
                <td style="padding:8px 0;color:#6B6B63"><strong>Услуга</strong></td>
                <td style="padding:8px 0;color:#1C1C1A">${service}</td>
              </tr>` : ''}
            </table>
            <div style="margin-top:20px;padding:16px;background:#F5F5F3;border-left:3px solid #6B8F71">
              <p style="margin:0;color:#1C1C1A;white-space:pre-wrap">${message}</p>
            </div>
            <p style="margin-top:24px;color:#9B9B93;font-size:12px">
              Изпратено от elipaneva.com
            </p>
          </div>
        `,
      })
    } else {
      console.log('[Contact form — no RESEND_API_KEY]', { name, email, phone, service, message: message.slice(0, 200) })
    }

    return NextResponse.redirect(new URL('/kontakti?status=success', req.url))
  } catch (err) {
    console.error('[Contact form error]', err)
    return NextResponse.redirect(new URL('/kontakti?status=error', req.url))
  }
}
