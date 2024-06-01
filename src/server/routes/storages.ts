import { z } from 'zod'
import { db } from '../db/db'
import { protectedProcedure, router } from '../trpc'
import { storageConfiguration } from '../db/schema'

export const storagesRouter = router({
  listStorages: protectedProcedure.query(async ({ ctx }) => {
    return db.query.storageConfiguration.findMany({
      where: (storages, { eq, and, isNull }) => and(eq(storages.userId, ctx.session.user.id), isNull(storages.deletedAt)),
    })
  }),
  createStorage: protectedProcedure.input(z.object({
    name: z.string().min(3).max(50),
    bucket: z.string(),
    accessKeyId: z.string(),
    region: z.string(),
    secretAccessKey: z.string(),
    apiEndpoint: z.string().optional(),
  })).mutation(async ({ ctx, input }) => {
    const { name, ...configuration } = input

    const result = await db
      .insert(storageConfiguration)
      .values({
        name: input.name,
        configuration,
        userId: ctx.session.user.id,
      })
      .returning()

    return result[0]
  }),

})
