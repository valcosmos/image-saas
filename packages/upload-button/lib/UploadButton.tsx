import type { MutableRef } from 'preact/hooks'
import { useRef } from 'preact/hooks'
import type { HTMLAttributes } from 'preact/compat'
import type { Ref } from 'preact'

interface CommonPreactComponentProps {
  setChildrenContainer: (ele: HTMLElement | null) => void
}

export type UploadButtonProps = HTMLAttributes<HTMLButtonElement> & CommonPreactComponentProps & {
  onFileChosen: (file: File[]) => void
  inputRef?: MutableRef<HTMLInputElement | null>

}

export function UploadButton({ onClick, setChildrenContainer, onFileChosen, children, inputRef: inputRefFromProps, ...props }: UploadButtonProps) {
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
        ref={(e) => {
          inputRef.current = e
          if (inputRefFromProps?.current) {
            inputRefFromProps.current = e
          }
        }}
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
