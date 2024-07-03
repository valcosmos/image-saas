import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'

export default function Upgrade({ open, onOpenChange }: { open: boolean, onOpenChange: (f: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Upgrade</DialogTitle>
      </DialogHeader>
      <DialogContent>xxx</DialogContent>
    </Dialog>
  )
}
