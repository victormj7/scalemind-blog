import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getPendingEmails, markEmailSent } from '@/lib/db'
import { SEQUENCE } from '@/lib/emailTemplates'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET(req: NextRequest) {
  // Proteção simples — Vercel envia o header Authorization com o CRON_SECRET
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey    = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL ?? 'ScaleMind <onboarding@resend.dev>'

  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY não configurada' }, { status: 500 })
  }

  const resend  = new Resend(apiKey)
  const pending = await getPendingEmails()

  let sent = 0
  let failed = 0

  for (const item of pending) {
    const builder = SEQUENCE[item.day]
    if (!builder) { await markEmailSent(item.id); continue }

    const { subject, html, text } = builder()
    try {
      await resend.emails.send({ from: fromEmail, to: item.email, subject, html, text })
      await markEmailSent(item.id)
      sent++
    } catch (err) {
      console.error('[cron] falha ao enviar', item.email, item.day, err)
      failed++
    }
  }

  console.log(JSON.stringify({ type: 'CRON_EMAIL_SEQUENCE', sent, failed, timestamp: new Date().toISOString() }))
  return NextResponse.json({ ok: true, sent, failed })
}
