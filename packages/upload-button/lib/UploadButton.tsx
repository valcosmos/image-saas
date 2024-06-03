import { useRef } from 'preact/hooks'
import type { HTMLAttributes } from 'preact/compat'

interface CommonPreactComponentProps {
  setChildrenContainer: (ele: HTMLElement | null) => void
}

export function UploadButton({ onClick, setChildrenContainer, onFileChosen, children, ...props }: HTMLAttributes<HTMLButtonElement> & CommonPreactComponentProps & { onFileChosen: (file: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = (e: MouseEvent) => {
    if (inputRef.current)
      inputRef.current.click()

    if (onClick)
      onClick(e as any)
  }

  return (
    <>
      <button {...props} onClick={handleClick} ref={e => setChildrenContainer(e)}>{ children }</button>
      <input
        ref={inputRef}
        tabIndex={-1}
        type="file"
        onChange={(e) => {
          const filesFormEvent = (e.target as HTMLInputElement).files
          if (filesFormEvent) {
            onFileChosen(Array.from(filesFormEvent))
          }
          // return filesFormEvent ? Array.from(filesFormEvent) : []
        }}
        style={{ opacity: 0, position: 'fixed', left: -10000000 }}
      />
    </>
  )
}
