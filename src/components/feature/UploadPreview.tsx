import React, { useState } from 'react'
import type Uppy from '@uppy/core'
import { Dialog, DialogContent } from '../ui/Dialog'
import { useUppyState } from '@/app/dashboard/useUppyState'

export default function UploadPreview({ uppy }: { uppy: Uppy }) {
  // const [open, setOpen] = useState(false)
  const open = useUppyState(uppy, s => Object.keys(s.files).length > 0)

  return (
    <Dialog open={open}>
      <DialogContent>
        Text
      </DialogContent>
    </Dialog>
  )
}
