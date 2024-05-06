import { createTRPCContext, serverCaller } from '@/utils/trpc'

export default async function Home() {
  const context = await createTRPCContext()
  const data = await serverCaller(context).hello()
  return (
    <div>
      Dashboard
      {' '}
      { data.hello}
    </div>
  )
}
