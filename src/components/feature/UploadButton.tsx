import type Uppy from '@uppy/core'
import { PlusCircle } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '../ui/Button'

export function UploadButton({ uppy }: { uppy: Uppy }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  return (
    <>
      <Button variant="ghost" onClick={() => { inputRef.current && inputRef.current.click() }}>
        <PlusCircle />
      </Button>
      <input
        ref={inputRef}
        type="file"
        className="fixed left-[-1000000px]"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach((file) => {
              uppy.addFile({
                data: file,
              })
            })
          }
        }}
        multiple
      />
    </>

  )
}
