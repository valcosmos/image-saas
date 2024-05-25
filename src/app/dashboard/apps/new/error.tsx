'use client'

import { Button } from '@/components/ui/Button'

export default function CreateAppError({ error, reset }: { error: Error, reset: () => void }) {
  return (
    <div>
      <div className="w-64 mx-auto p-8 flex justify-center items-center flex-col gap-8">
        <span>Create App Failed</span>
        <span>{ error.message }</span>
        <Button onClick={reset}>Reset</Button>
      </div>
    </div>
  )
}
