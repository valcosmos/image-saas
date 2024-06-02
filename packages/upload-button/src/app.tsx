import { useState } from 'preact/hooks'
import { UploadButton } from '../lib/UploadButton'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <UploadButton />
    </>
  )
}
