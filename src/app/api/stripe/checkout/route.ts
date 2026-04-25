import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scalemind-blog.vercel.app'

export async function POST(req: NextRequest) {
  const priceId = process.env.STRIPE_PRICE_ID

  if (!priceId) {
    return NextResponse.json(
      { error: 'STRIPE_PRICE_ID não configurado.' },
      { status: 500 }
    )
  }

  let email: string | undefined
  try {
    const body = await req.json()
    email = body.email?.trim().toLowerCase()
  } catch {
    email = undefined
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode:                'subscription',
      payment_method_types: ['card'],
      line_items: [
        { price: priceId, quantity: 1 },
      ],
      // Pré-preenche o e-mail se o usuário já informou
      ...(email ? { customer_email: email } : {}),
      success_url: `${SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${SITE_URL}/upgrade`,
      metadata: {
        source: 'scalemind_gerador',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
