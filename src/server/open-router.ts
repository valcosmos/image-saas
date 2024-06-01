import { fileOpenRoutes } from './routes/file-open'
import { router } from './trpc'

export const openRouter = router({
  file: fileOpenRoutes,
})

export type OpenRouter = typeof openRouter
