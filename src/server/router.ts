import { apiKeysRouter } from './routes/apiKeys'
import { appsRouter } from './routes/apps'
import { fileRoutes } from './routes/file'
import { storagesRouter } from './routes/storages'
import { router } from './trpc'

export const appRouter = router({
  file: fileRoutes,
  apps: appsRouter,
  storages: storagesRouter,
  apiKeys: apiKeysRouter,
})

export type AppRouter = typeof appRouter
