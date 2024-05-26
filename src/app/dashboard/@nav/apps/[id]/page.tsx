'use client'

import React from 'react'
import Link from 'next/link'
import { trpcClientReact } from '@/utils/api'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu'
import { Button } from '@/components/ui/Button'

export default function AppDashboardNav({ params: { id } }: { params: { id: string } }) {
  const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery()

  const currentApp = apps?.filter(app => app.id === id)[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" asChild>
          <span>{ isPending ? 'loading...' : currentApp ? currentApp.name : '...' }</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {
          apps?.map((app) => {
            return (
              <DropdownMenuItem key={app.id} disabled={app.id === id}>
                <Link href={`/dashboard/apps/${app.id}`}>
                  {app.name}
                  -
                  {app.id }
                </Link>
              </DropdownMenuItem>
            )
          })
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
