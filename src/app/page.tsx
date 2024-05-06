import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import UserInfo, { SessionProvider } from './UserInfo'
import { Input } from '@/components/Input'
import { Textarea } from '@/components/Textarea'
import { Button } from '@/components/Button'

import { getServerSession } from '@/server/auth'
import { trpcClient, trpcClientReact } from '@/utils/api'

export default function Home() {
  const { data, isLoading } = trpcClientReact.hello.useQuery()
  return (
    <div className="h-screen flex justify-center items-center">
      <form action="" className="w-full max-w-xl flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Create App</h1>
        <Input name="name" placeholder="App Name" />
        <Textarea name="description" placeholder="Description" />
        <Button type="submit">Submit</Button>

      </form>
      <SessionProvider>
        <UserInfo />
      </SessionProvider>
    </div>
  )
}
