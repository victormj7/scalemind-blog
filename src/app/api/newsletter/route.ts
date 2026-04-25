import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildWelcomeEmail } from '@/lib/emailTemplates'
import { addSubscriber } from '@/lib/subscribers'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  let email: string
  try {
    const body = await req.json()
    email = String(body.email ?? '').trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: 'Body inválido.' }, { status: 400 })
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }

  // addSubscriber retorna false se já existia — fonte única de verdade
  const isNew = addSubscriber(email)

  // Tracking
  fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalemind-blog.vercel.app'}/api/track`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ event: 'waitlist_signup', data: { source: 'newsletter', email } }),
  }).catch(() => {})

  console.log(JSON.stringify({
    type:      'NEWSLETTER_SIGNUP',
    email,
    new:       isNew,
    timestamp: new Date().toISOString(),
  }))

  if (isNew) {
    const apiKey    = process.env.RESEND_API_KEY
    const fromEmail = process.env.FROM_EMAIL ?? 'ScaleMind <onboarding@resend.dev>'

    if (apiKey) {
      try {
        const resend = new Resend(apiKey)
        const { subject, html, text } = buildWelcomeEmail()
        await resend.emails.send({ from: fromEmail, to: email, subject, html, text })
        console.log(JSON.stringify({ type: 'EMAIL_SENT', email, timestamp: new Date().toISOString() }))
      } catch (err) {
        console.error('[Resend Error]', err instanceof Error ? err.message : err)
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
