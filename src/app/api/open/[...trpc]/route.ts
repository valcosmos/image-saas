import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import type { NextRequest } from 'next/server'
import { openRouter } from '@/server/open-router'

async function handler(request: NextRequest) {
  const res = await fetchRequestHandler({
    endpoint: '/api/open',
    req: request,
    router: openRouter,
    createContext: async () => ({}),
  })

  res.headers.append('Access-Control-Allow-Origin', '*')
  res.headers.append('Access-Control-Allow-Methods', '*')
  res.headers.append('Access-Control-Allow-Headers', 'api-key')

  return res
}

export function OPTIONS() {
  const res = new Response('', {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      // 'Access-Control-Allow-Headers': 'api-key',
      'Access-Control-Allow-Headers': '*',
    },
  })
  return res
}

export { handler as GET, handler as POST }
