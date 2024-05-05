import { initTRPC } from '@trpc/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import type { NextRequest } from 'next/server'
import { testRouter } from '@/utils/trpc'
import { getServerSession } from '@/server/auth'

function handler(request: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: testRouter,
    createContext: async () => {
      const session = await getServerSession()

      return { session }
    },
  })
}

export { handler as GET, handler as POST }
