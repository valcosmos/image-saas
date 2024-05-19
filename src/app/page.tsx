import UserInfo, { SessionProvider } from './UserInfo'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

export default function Home() {
  // const { data, isLoading } = trpcClientReact.hello.useQuery()

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
