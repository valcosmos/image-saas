import { appsRouter } from './routes/apps'
import { fileRoutes } from './routes/file'
import { router } from './trpc'

export const appRouter = router({
  file: fileRoutes,
  apps: appsRouter,
})

export type AppRouter = typeof appRouter
