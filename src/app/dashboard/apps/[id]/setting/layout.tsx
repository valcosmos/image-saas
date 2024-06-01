'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import React from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export default function SettingLayout({ params: { id }, children }: { params: { id: string }, children: ReactNode }) {
  const path = usePathname()

  return (
    <div className="flex justify-start container mx-auto">
      <div className="flex flex-col w-60 flex-shrink-0 pt-10 gap-4">
        <Button size="lg" variant="ghost" disabled={path === `/dashboard/apps/${id}/setting/storage`}>
          <Link href={`/dashboard/apps/${id}/setting/storage`}>Storage</Link>
        </Button>
        <Button size="lg" variant="ghost" disabled={path === `/dashboard/apps/${id}/setting/api-key`}>
          <Link href={`/dashboard/apps/${id}/setting/api-key`}>Api Keys</Link>
        </Button>
      </div>
      <div className="flex-grow pl-4">{ children }</div>
    </div>
  )
}
