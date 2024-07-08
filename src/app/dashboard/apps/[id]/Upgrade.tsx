import React from 'react'
import Plan from './Plan'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { trpcClientReact } from '@/utils/api'

export default function Upgrade({ open, onOpenChange }: { open: boolean, onOpenChange: (f: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade</DialogTitle>
          <DialogDescription>
            You are now a free user and cannot upload more files, please upgrade
          </DialogDescription>
        </DialogHeader>
        <Plan />
      </DialogContent>
    </Dialog>
  )
}
