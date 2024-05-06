import { TRPCError, initTRPC } from '@trpc/server'
import { createCallerFactory } from '@trpc/server/unstable-core-do-not-import'
import { getServerSession } from '@/server/auth'

export async function createTRPCContext() {
  const session = await getServerSession()
  if (!session?.user) {
    // 未登录
    throw new TRPCError({
      code: 'FORBIDDEN',
    })
  }

  return { session }
}

const t = initTRPC.context<typeof createTRPCContext>().create()
const { router, procedure } = t

const middleware = t.middleware(async ({ ctx, next }) => {
  const start = Date.now()

  const result = await next()

  console.log('---> Api time:', Date.now() - start)

  return result
})

const loggedProcedure = procedure.use(middleware)

export const testRouter = router({
  hello: loggedProcedure.query(async ({ ctx }) => {
    console.log('==>', ctx.session)
    return {
      hello: 'world',
    }
  }),
})

export type TestRouter = typeof testRouter

export const serverCaller = createCallerFactory()(testRouter)
