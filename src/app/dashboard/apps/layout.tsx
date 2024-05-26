import type { ReactNode } from 'react'

export default function AppLayout({ children, intercepting }: { children: ReactNode, intercepting: ReactNode }) {
  return (
    <>
      {children}
      {intercepting}
    </>
  )
}
