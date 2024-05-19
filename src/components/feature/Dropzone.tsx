import type Uppy from '@uppy/core'
import type { HTMLAttributes, ReactNode } from 'react'
import { useRef, useState } from 'react'

export function Dropzone({ uppy, children, ...divProps }: { uppy: Uppy, children: ReactNode | ((draging: boolean) => ReactNode) } & Omit<HTMLAttributes<HTMLDivElement>, 'children'>) {
  const [darging, setDragging] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (
    <div
      {...divProps}
      onDragEnter={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        timerRef.current = setTimeout(() => {
          setDragging(false)
        }, 50)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
      }}
      onDrop={(e) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        Array.from(files).forEach((file) => {
          uppy.addFile({
            data: file,
          })
        })
        setDragging(false)
      }}
    >
      {typeof children === 'function' ? children(darging) : children}
    </div>
  )
}
