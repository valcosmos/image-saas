import { createTRPCClient, httpBatchLink } from '@trpc/client'
// 根目录运行==>  npx tsup -d packages/api/src src/utils/open-router-dts.ts --dts-only
import type { OpenRouter } from './open-router-dts'

export const apiClient = createTRPCClient<OpenRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
})

export { OpenRouter }
