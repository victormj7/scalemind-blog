import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { buildWelcomeEmail } from '@/lib/emailTemplates'

// Store em memória com deduplicação — mesma lógica da waitlist
const subscribers = new Set<string>()

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

  const alreadySubscribed = subscribers.has(email)
  if (!alreadySubscribed) {
    subscribers.add(email)
  }

  // Tracking
  fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalemind-blog.vercel.app'}/api/track`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ event: 'waitlist_signup', data: { source: 'newsletter', email } }),
  }).catch(() => {})

  // Log estruturado
  console.log(JSON.stringify({
    type:      'NEWSLETTER_SIGNUP',
    email,
    new:       !alreadySubscribed,
    timestamp: new Date().toISOString(),
    total:     subscribers.size,
  }))

  // Enviar email de boas-vindas via Resend
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL ?? 'ScaleMind <onboarding@resend.dev>'

  if (apiKey && !alreadySubscribed) {
    try {
      const resend = new Resend(apiKey)
      const { subject, html, text } = buildWelcomeEmail()

      await resend.emails.send({
        from:    fromEmail,
        to:      email,
        subject,
        html,
        text,
      })

      console.log(JSON.stringify({
        type:      'EMAIL_SENT',
        email,
        timestamp: new Date().toISOString(),
      }))
    } catch (err) {
      // Não falha o cadastro se o email não for enviado
      console.error('[Resend Error]', err instanceof Error ? err.message : err)
    }
  }

  return NextResponse.json({
    ok:      true,
    new:     !alreadySubscribed,
    message: alreadySubscribed
      ? 'Você já está cadastrado!'
      : 'Cadastro realizado! Confira seu e-mail.',
  })
}
