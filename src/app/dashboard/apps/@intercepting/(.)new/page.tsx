import React from 'react'
import CreateApp from '../../new/page'
import BackableDialog from './BackableDialog'
import { DialogContent } from '@/components/ui/Dialog'

export default function InterceptingCreateApp() {
  return (
    <BackableDialog>
      <DialogContent>
        <CreateApp />
      </DialogContent>
    </BackableDialog>
  )
}
