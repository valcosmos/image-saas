import { apiKeysRouter } from './routes/apiKeys'
import { appsRouter } from './routes/apps'
import { fileRoutes } from './routes/file'
import { storagesRouter } from './routes/storages'
import { userRouter } from './routes/user'
import { router } from './trpc'

export const appRouter = router({
  file: fileRoutes,
  apps: appsRouter,
  storages: storagesRouter,
  apiKeys: apiKeysRouter,
  user: userRouter,
})

export type AppRouter = typeof appRouter
