import { useEffect, useRef, useState } from 'preact/hooks'
import type { HTMLAttributes, ReactNode } from 'preact/compat'

interface CommonPreactComponentProps {
  setChildrenContainer: (ele: HTMLElement | null) => void
}

export type DropzoneProps = {
  onDraggingChange: (dragging: boolean) => void
  onFileChosed: (files: File[]) => void
  children: ReactNode | ((draging: boolean) => ReactNode)
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'> &
CommonPreactComponentProps

export function Dropzone({
  children,
  setChildrenContainer,
  onDraggingChange,
  onFileChosed,
  ...divProps
}: DropzoneProps) {
  const [darging, setDragging] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  console.log(darging, setDragging)
  console.log('-->', onDraggingChange)

  useEffect(() => {
    onDraggingChange(darging)
  }, [onDraggingChange, darging])

  return (
    <div
      ref={(e) => {
        setChildrenContainer(e)
      }}
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
        const files = e.dataTransfer?.files
          ? Array.from(e.dataTransfer.files)
          : []
        onFileChosed(files)
        setDragging(false)
      }}
    >
    </div>
  )
}
