'use client'

import { SessionProvider as NextAuthProvider, useSession } from 'next-auth/react'

export default function UserInfo() {
  const session = useSession()
  return (
    <div>{ session.data?.user?.name }</div>
  )
}

export function SessionProvider(props: any) {
  return <NextAuthProvider {...props}></NextAuthProvider>
}
