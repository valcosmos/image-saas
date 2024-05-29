import { db } from '../db/db'
import { protectedProcedure, router } from '../trpc'

export const storagesRouter = router({
  listStorages: protectedProcedure.query(async ({ ctx }) => {
    return db.query.storageConfiguration.findMany({
      where: (storages, { eq, and, isNull }) => and(eq(storages.userId, ctx.session.user.id), isNull(storages.deletedAt)),
    })
  }),
})
