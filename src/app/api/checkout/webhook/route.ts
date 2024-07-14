import process from 'node:process'
import type { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/server/db/db'
import { orders, users } from '@/server/db/schema'

const key = process.env.STRIPE_SECRET_API_KEY as string
const stripe = new Stripe(key)

export async function POST(request: NextRequest) {
  const payload = await request.json()
  const sig = request.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_ENDPOINT_SECRET!)
  }
  catch {
    // return response.status(400).send(`Webhook Error: ${err.message}`)
    return new Response('', {
      status: 400,
    })
  }

  if (
    event.type === 'checkout.session.completed'
    || event.type === 'checkout.session.async_payment_succeeded'
  ) {
    // fulfillCheckout();
    const sessionId = event.data.object.id

    // TODO: Make this function safe to run multiple times,
    // even concurrently, with the same session ID

    // TODO: Make sure fulfillment hasn't already been
    // peformed for this Checkout Session

    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    })

    // const lineItems = checkoutSession.line_items

    const order = await db.query.orders.findFirst({
      where: (orders, { eq }) => eq(orders.sessionId, sessionId),
    })

    if (!order || order.status !== 'created') {
      return new Response('', {
        status: 400,
      })
    }

    await db.update(orders).set({ status: 'completed' })

    await db.update(users).set({ plan: 'paid' })

    // Check the Checkout Session's payment_status property
    // to determine if fulfillment should be peformed
    if (checkoutSession.payment_status !== 'unpaid') {
      // TODO: Perform fulfillment of the line items

      // TODO: Record/save fulfillment status for this
      // Checkout Session
    }
  }

  return new Response('', {
    status: 200,
  })
}
