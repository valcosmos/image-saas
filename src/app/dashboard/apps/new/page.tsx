// import UserInfo, { SessionProvider } from './UserInfo'
import { redirect } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { createAppSchema } from '@/server/db/validate-schema'

import { getServerSession } from '@/server/auth'
import { serverCaller } from '@/utils/trpc'

export default function Home() {
  // const { data, isLoading } = trpcClientReact.hello.useQuery()
  async function createApp(formData: FormData) {
    'use server'
    const name = formData.get('name')
    const description = formData.get('description')
    const input = createAppSchema.pick({ name: true, description: true }).safeParse({
      name,
      description,
    })
    if (input.success) {
      const session = await getServerSession()
      const newApp = await serverCaller({ session }).apps.createApp(input.data)
      redirect(`/dashboard/apps/${newApp.id}`)
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <form action={createApp} className="w-full max-w-xl flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Create App</h1>
        <Input name="name" placeholder="App Name" />
        <Textarea name="description" placeholder="Description" />
        <Button type="submit">Submit</Button>

      </form>
      {/* <SessionProvider> */}
      {/* <UserInfo /> */}
      {/* </SessionProvider> */}
    </div>
  )
}
