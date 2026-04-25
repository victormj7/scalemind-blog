import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { addPremiumUser } from '@/lib/premiumStore'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
})

// Necessário para ler o body raw do webhook
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  const sig     = req.headers.get('stripe-signature')
  const secret  = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !secret) {
    return NextResponse.json({ error: 'Configuração inválida.' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const body = await req.arrayBuffer()
    event = stripe.webhooks.constructEvent(Buffer.from(body), sig, secret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro'
    console.error('[Stripe Webhook] Assinatura inválida:', message)
    return NextResponse.json({ error: `Webhook inválido: ${message}` }, { status: 400 })
  }

  // Pagamento confirmado
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email   = session.customer_email ?? session.customer_details?.email

    if (email) {
      addPremiumUser(email)
      console.log(JSON.stringify({
        type:      'PREMIUM_ACTIVATED',
        email,
        sessionId: session.id,
        timestamp: new Date().toISOString(),
      }))
    }
  }

  // Assinatura cancelada ou pagamento falhou
  if (event.type === 'customer.subscription.deleted') {
    // Futuramente: remover do Supabase
    console.log(JSON.stringify({
      type:      'SUBSCRIPTION_CANCELLED',
      timestamp: new Date().toISOString(),
    }))
  }

  return NextResponse.json({ received: true })
}
