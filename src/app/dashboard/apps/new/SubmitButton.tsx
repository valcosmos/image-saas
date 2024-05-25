'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/Button'

export default function SubmitButton() {
  const status = useFormStatus()
  return (
    <Button type="submit" disabled={status.pending}>Submit</Button>
  )
}
