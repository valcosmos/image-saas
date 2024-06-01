import { TRPCError, initTRPC } from '@trpc/server'
import { headers } from 'next/headers'
import { db } from './db/db'
import { getServerSession } from '@/server/auth'

const t = initTRPC.context().create()

const { router, procedure, createCallerFactory } = t

export const withLoggerProcedure = procedure.use(async ({ next }) => {
  // const start = Date.now()
  const result = await next()
  return result
})

export const withSessionMiddleware = t.middleware(async ({ next }) => {
  const session = await getServerSession()

  return next({
    ctx: {
      session,
    },
  })
})

export const protectedProcedure = withLoggerProcedure
  .use(withSessionMiddleware)
  .use(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'FORBIDDEN',
      })
    }

    return next({
      ctx: {
        session: ctx.session!,
      },
    })
  })

export const withAppProcedure = withLoggerProcedure.use(async ({ next }) => {
  // const request = ctx
  const header = headers()
  const apiKey = header.get('api-key')

  if (!apiKey)
    throw new TRPCError({ code: 'FORBIDDEN' })
  const apiKeyAndAppUser = await db.query.apiKeys.findFirst({
    where: (apiKeys, { eq, and, isNotNull }) => and(eq(apiKeys.key, apiKey), isNotNull(apiKeys.deletedAt)),
    with: {
      app: {
        with: { user: true, storage: true },
      },
    },
  })
  if (!apiKeyAndAppUser)
    throw new TRPCError({ code: 'FORBIDDEN' })
  return next({ ctx: { app: apiKeyAndAppUser.app, user: apiKeyAndAppUser.app.user } })
})

export { router, createCallerFactory }
