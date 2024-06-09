import type Uppy from '@uppy/core'
import type { HTMLAttributes, ReactNode } from 'preact/compat'
import { useRef, useState } from 'preact/hooks'
import { useEffect } from 'react'

interface CommonPreactComponentProps {
  setChildrenContainer: (ele: HTMLElement | null) => void
}

export type DropzoneProp = {
  // uploader: Uppy
  children: ReactNode | ((draging: boolean) => ReactNode)
  onFileClosed: (file: File[]) => void
  onDraggingChange: (dragging: boolean) => void
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'> & CommonPreactComponentProps

export function Dropzone({ children, onFileClosed, onDraggingChange, setChildrenContainer, ...divProps }: DropzoneProp) {
  const [darging, setDragging] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    onDraggingChange(darging)
  }, [onDraggingChange, darging])

  return (
    <div
      ref={e => setChildrenContainer(e)}
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
        const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : []
        onFileClosed(files)

        setDragging(false)
      }}
    >
      {typeof children === 'function' ? children(darging) : children}
    </div>
  )
}
