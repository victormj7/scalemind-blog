import { Resend } from 'resend'
import { buildNewPostEmail } from '@/lib/emailTemplates'
import { getSubscribers } from '@/lib/subscribers'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalemind-blog.vercel.app'

export async function sendNewPostEmail(post: {
  title: string
  summary: string
  slug: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from   = process.env.FROM_EMAIL ?? 'ScaleMind <onboarding@resend.dev>'

  if (!apiKey) return

  const recipients = getSubscribers()
  if (recipients.length === 0) return

  const link = `${SITE_URL}/blog/${post.slug}`
  const { subject, html, text } = buildNewPostEmail({ title: post.title, summary: post.summary, link })

  const resend = new Resend(apiKey)

  // Envia em lotes de 50 (limite do Resend por chamada)
  const BATCH = 50
  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH)
    await resend.emails.send({ from, to: batch, subject, html, text })
  }
}
