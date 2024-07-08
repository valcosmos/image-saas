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
    await db.update(users).set({ plan: 'paid' })
  }),
})
