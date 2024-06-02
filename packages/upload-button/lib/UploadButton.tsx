import { useRef } from 'preact/hooks'
import type { HTMLAttributes } from 'preact/compat'

export function UploadButton({ onClick, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleClick = (e: MouseEvent) => {
    if (inputRef.current)
      inputRef.current.click()

    if (onClick)
      onClick(e as any)
  }

  return (
    <>
      <button {...props} onClick={handleClick}>Click me</button>
      <input ref={inputRef} tabIndex={-1} type="file" style={{ opacity: 0, position: 'fixed', left: -10000000 }} />
    </>
  )
}
