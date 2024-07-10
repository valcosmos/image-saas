import process from 'node:process'
import { Stripe } from 'stripe'
import { TRPCError } from '@trpc/server'
import { db } from '../db/db'
import { users } from '../db/schema'
import { protectedProcedure, router } from '../trpc'

export const userRouter = router({
  getPlan: protectedProcedure.query(async ({ ctx }) => {
    const result = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      columns: { plan: true },
    })

    return result
  }),
  upgrade: protectedProcedure.mutation(async () => {
    const key = process.env.STRIPE_SECRET_API_KEY as string
    const stripe = new Stripe(key)
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: process.env.PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:3000/pay/callback/success`,
      cancel_url: `http://localhost:3000/pay/callback/cancel`,
    })

    if (!session.url) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
      })
    }

    return {
      url: session.url,
    }
    // await db.update(users).set({ plan: 'paid' })
  }),
})
