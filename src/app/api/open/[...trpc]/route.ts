import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import type { NextRequest } from 'next/server'
import { openRouter } from '@/server/open-router'

function handler(request: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/open',
    req: request,
    router: openRouter,
    createContext: async () => ({}),
  })
}

export { handler as GET, handler as POST }
