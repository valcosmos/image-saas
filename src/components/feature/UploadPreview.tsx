import React, { useState } from 'react'
import Image from 'next/image'
import type Uppy from '@uppy/core'
import { DialogTitle } from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import { Button } from '../ui/Button'
import { useUppyState } from '@/app/dashboard/useUppyState'

export default function UploadPreview({ uppy }: { uppy: Uppy }) {
  // const [open, setOpen] = useState(false)
  // const open = useUppyState(uppy, s => Object.keys(s.files).length > 0)
  const files = useUppyState(uppy, s => Object.values(s.files))
  const open = files.length > 0
  const [index, setIndex] = useState(0)
  const file = files[index]
  if (!file)
    return null
  const isImage = file.data.type.startsWith('image')

  const clear = () => {
    files.forEach(file => uppy.removeFile(file.id))
    setIndex(0)
  }

  return (
    <Dialog open={open} onOpenChange={flag => !flag && clear()}>
      <DialogContent onPointerDownOutside={e => e.preventDefault()}>
        <DialogTitle>Upload Preview</DialogTitle>
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => {
              if (index === 0)
                setIndex(files.length - 1)
              else
                setIndex(index - 1)
            }}
          >
            <ChevronLeft />
          </Button>
          <div
            key={file.id}
            className="w-56 h-56 flex justify-center items-center"
          >
            {isImage
              ? (
                <img
                  src={URL.createObjectURL(file.data)}
                  alt={file.name}
                />
                )
              : (
                <Image
                  src="/unknown-file-types.png"
                  alt="unknow file type"
                  width={100}
                  height={100}
                >
                </Image>
                )}
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              if (index === files.length - 1)
                setIndex(0)
              else
                setIndex(index + 1)
            }}
          >
            <ChevronRight />
          </Button>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              uppy.removeFile(file.id)
              if (index === files.length - 1)
                setIndex(files.length - 2)
            }}
            variant="destructive"
          >
            Delete This
          </Button>
          <Button onClick={() => {
            uppy.upload().then(() => {
              clear()
            })
          }}
          >
            Upload All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
