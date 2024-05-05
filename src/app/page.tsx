import { Input } from '@/components/Input'
import { Textarea } from '@/components/Textarea'
import { Button } from '@/components/Button'
import { db } from '@/server/db/db'

export default async function Home() {
  const users = await db.query.Users.findMany()

  return (
    <div className="h-screen flex justify-center items-center">
      <form action="" className="w-full max-w-xl flex flex-col gap-4">
        <h1 className="text-center text-2xl font-bold">Create App</h1>
        <Input name="name" placeholder="App Name" />
        <Textarea name="description" placeholder="Description" />
        <Button type="submit">Submit</Button>
        { users.map(item => <div key={item.id}>{item.name}</div>) }
      </form>
    </div>
  )
}
