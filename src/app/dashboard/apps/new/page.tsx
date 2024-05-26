// import UserInfo, { SessionProvider } from './UserInfo'
import { redirect } from 'next/navigation'
import SubmitButton from './SubmitButton'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { createAppSchema } from '@/server/db/validate-schema'

import { getServerSession } from '@/server/auth'
import { serverCaller } from '@/utils/trpc'

export default function CreateApp() {
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
    else {
      throw input.error
    }
  }

  return (
    <div className="flex h-full justify-center items-center">
      <form action={createApp} className="w-full max-w-xl flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Create App</h1>
        <Input name="name" placeholder="App Name" />
        <Textarea name="description" placeholder="Description" />
        <SubmitButton />

      </form>
      {/* <SessionProvider> */}
      {/* <UserInfo /> */}
      {/* </SessionProvider> */}
    </div>
  )
}
