import { redirect } from 'next/navigation'
import { getServerSession } from '@/server/auth'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'

export default async function DashboardLayout({ children, nav }: Readonly<{ children: React.ReactNode, nav: React.ReactNode }>) {
  const session = await getServerSession()
  if (!session?.user)
    redirect('/api/auth/signin')
  return (
    <div className="h-screen">
      <nav className="relative h-20 flex justify-end items-center border-b">
        <Button variant="ghost">
          <Avatar>
            <AvatarImage src={session.user.image!} />
            <AvatarFallback>{ session.user?.name?.substring(0, 2) }</AvatarFallback>
          </Avatar>
        </Button>
        <div className="absolute h-full left-1/2 -translate-x-1/2 flex justify-center items-center">
          { nav}
        </div>
      </nav>
      <main className="h-[calc(100%-80px)]">{children}</main>
    </div>
  )
}
