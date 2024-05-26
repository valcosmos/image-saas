import { redirect } from 'next/navigation'
import { getServerSession } from '@/server/auth'
import { Button } from '@/components/ui/Button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'

export default async function DashboardLayout({ children, nav }: Readonly<{ children: React.ReactNode, nav: React.ReactNode }>) {
  const session = await getServerSession()
  if (!session?.user)
    redirect('/api/auth/signin')
  return (
    <div className="h-screen">
      <nav className="relative h-20 border-b">
        <div className="container flex justify-end items-center h-full">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={session.user.image!} />
                <AvatarFallback>{ session.user?.name?.substring(0, 2) }</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{ session.user.name }</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute h-full top-0 left-1/2 -translate-x-1/2 flex justify-center items-center">
          { nav}
        </div>
      </nav>
      <main className="h-[calc(100%-80px)]">{children}</main>
    </div>
  )
}
