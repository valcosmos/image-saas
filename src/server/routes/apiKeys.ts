import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import { db } from '../db/db'
import { protectedProcedure, router } from '../trpc'
import { apiKeys } from '../db/schema'

export const apiKeysRouter = router({
  listApiKeys: protectedProcedure.input(z.object({ appId: z.string() })).query(async ({ input }) => {
    return db.query.apiKeys.findMany({
      where: (apiKeys, { eq, and, isNull }) => and(eq(apiKeys.appId, input.appId), isNull(apiKeys.deletedAt)),
    })
  }),
  createApiKeys: protectedProcedure.input(z.object({
    name: z.string().min(3).max(50),
    appId: z.string(),
  })).mutation(async ({ input }) => {
    const result = await db.insert(apiKeys).values({ name: input.name, appId: input.appId, key: uuid(), clientId: uuid() }).returning()
    return result[0]
  }),
})
