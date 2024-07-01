import type { MouseEvent, MouseEventHandler } from 'react'
import React from 'react'
import { Copy, Trash2 } from 'lucide-react'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'
import { Button } from '../ui/Button'
import { trpcClientReact } from '@/utils/api'

export function DeleteFile({ fileId, onDeleteSuccess }: { fileId: string, onDeleteSuccess: (fileId: string) => void }) {
  const { mutate: deleteFile, isPending } = trpcClientReact.file.deleteFile.useMutation({
    onSuccess() { onDeleteSuccess(fileId) },
  })

  const handleRemoveFile = () => {
    deleteFile(fileId)
    toast('Delete succeed')
  }

  return (
    <Button variant="ghost" onClick={handleRemoveFile} disabled={isPending}>
      <Trash2 />
    </Button>
  )
}

export function CopyUrl({ onClick }: { url: string, onClick: (e: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      // onClick={() => {
      //   copy(url)
      //   toast('Url Copied')
      // }}
    >
      <Copy />
    </Button>
  )
}
