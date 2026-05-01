import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildWelcomeEmail } from '@/lib/emailTemplates'
import { addSubscriber } from '@/lib/subscribers'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const ts = () => new Date().toISOString()
const log = (obj: object) => console.log(JSON.stringify(obj))

export async function POST(req: NextRequest) {
  log({ type: 'NEWSLETTER_REQUEST_RECEIVED', timestamp: ts() })

  let email: string
  try {
    const body = await req.json()
    email = String(body.email ?? '').trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  log({ type: 'NEWSLETTER_EMAIL_RECEIVED', email, timestamp: ts() })

  if (!email || !isValidEmail(email)) {
    log({ type: 'NEWSLETTER_VALIDATION_FAILED', reason: !email ? 'empty' : 'invalid_format', email, timestamp: ts() })
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }

  const storage = process.env.SUPABASE_URL ? 'supabase' : 'memory'
  log({ type: 'NEWSLETTER_SAVING', email, storage, timestamp: ts() })

  const isNew = await addSubscriber(email)

  if (!isNew) {
    log({ type: 'NEWSLETTER_DUPLICATE', email, timestamp: ts() })
  } else {
    log({ type: 'NEWSLETTER_SAVED', email, storage, timestamp: ts() })
  }

  // Tracking
  fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalemind-blog.vercel.app'}/api/track`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ event: 'waitlist_signup', data: { source: 'newsletter', email } }),
  }).catch(() => {})

  if (isNew) {
    const apiKey    = process.env.RESEND_API_KEY
    const fromEmail = process.env.FROM_EMAIL ?? 'ScaleMind <onboarding@resend.dev>'

    if (!apiKey) {
      log({ type: 'NEWSLETTER_EMAIL_SKIPPED', reason: 'RESEND_API_KEY_NOT_SET', email, timestamp: ts() })
    } else {
      log({ type: 'NEWSLETTER_EMAIL_SENDING', email, timestamp: ts() })
      try {
        const resend = new Resend(apiKey)
        const { subject, html, text } = buildWelcomeEmail()
        const { data } = await resend.emails.send({ from: fromEmail, to: email, subject, html, text })
        log({ type: 'NEWSLETTER_EMAIL_SENT', email, resendId: data?.id, timestamp: ts() })
      } catch (err) {
        log({ type: 'NEWSLETTER_EMAIL_ERROR', email, error: err instanceof Error ? err.message : String(err), timestamp: ts() })
      }
    }
  }

  return NextResponse.json({
    ok:  true,
    new: isNew,
    message: isNew
      ? 'Cadastro realizado! Confira seu e-mail.'
      : 'Você já está cadastrado!',
  })
}
