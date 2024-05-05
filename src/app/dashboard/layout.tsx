import { redirect } from 'next/navigation'
import { getServerSession } from '@/server/auth'

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession()
  if (!session?.user)
    redirect('/api/auth/signin')
  return children
}
