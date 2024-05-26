'use client'

import type { ReactNode } from 'react'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Dialog } from '@/components/ui/Dialog'

export default function BackableDialog({ children }: { children: ReactNode }) {
  const router = useRouter()
  return (
    <Dialog open onOpenChange={() => { router.back() }}>
      { children }
    </Dialog>
  )
}
