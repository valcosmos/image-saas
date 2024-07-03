import { TRPCError, initTRPC } from '@trpc/server'
import { headers } from 'next/headers'
import type { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
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

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, ctx.session!.user.id),
      columns: {
        plan: true,
      },
    })

    const plan = user?.plan

    return next({
      ctx: {
        session: ctx.session!,
        plan,
      },
    })
  })

export const withAppProcedure = withLoggerProcedure.use(async ({ next }) => {
  // const request = ctx
  const header = headers()
  const apiKey = header.get('api-key')
  const signedToken = header.get('signed-token')

  // if (!apiKey && !signedToken)

  if (apiKey) {
    const apiKeyAndAppUser = await db.query.apiKeys.findFirst({
      where: (apiKeys, { eq, and, isNull }) => and(eq(apiKeys.key, apiKey), isNull(apiKeys.deletedAt)),
      with: {
        app: {
          with: { user: true, storage: true },
        },
      },
    })
    if (!apiKeyAndAppUser)
      throw new TRPCError({ code: 'FORBIDDEN' })
    return next({ ctx: { app: apiKeyAndAppUser.app, user: apiKeyAndAppUser.app.user } })
  }
  if (signedToken) {
    const payload = jwt.decode(signedToken)
    if (!(payload as JwtPayload)?.clientId) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'clientId not found' })
    }

    const apiKeyAndAppUser = await db.query.apiKeys.findFirst({
      where: (apiKeys, { eq, and, isNull }) => and(eq(apiKeys.clientId, (payload as JwtPayload).clientId), isNull(apiKeys.deletedAt)),
      with: {
        app: {
          with: { user: true, storage: true },
        },
      },
    })
    if (!apiKeyAndAppUser)
      throw new TRPCError({ code: 'FORBIDDEN' })

    try {
      jwt.verify(signedToken, apiKeyAndAppUser.key)
    }
    catch (error) {
      throw new TRPCError({ code: 'BAD_REQUEST' })
    }
    return next({ ctx: { app: apiKeyAndAppUser.app, user: apiKeyAndAppUser.app.user } })
  }

  throw new TRPCError({ code: 'FORBIDDEN' })
})

export { router, createCallerFactory }
