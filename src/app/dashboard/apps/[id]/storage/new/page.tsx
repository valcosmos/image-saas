'use client'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { trpcClientReact } from '@/utils/api'
import type { S3StorageConfiguration } from '@/server/db/schema'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

export default function StoragePage({ params: { id } }: { params: { id: string } }) {
  const { register } = useForm<S3StorageConfiguration & { name: string }>()
  return (
    <div className="container pt-10">
      <h1 className="text-3xl mb-6  max-w-md mx-auto">Create Storage</h1>
      <form className="flex flex-col gap-4 max-w-md mx-auto">
        <div>
          <Label>Name</Label>
          <Input {...register('name', { required: 'Name is required' })} />
        </div>
        <div>
          <Label>Bucket</Label>
          <Input {...register('bucket', { required: 'Bucket is required' })} />
        </div>
        <div>
          <Label>AccessKeyId</Label>
          <Input {...register('accessKeyId', { required: 'AccessKeyId is required' })} />
        </div>
        <div>
          <Label>Region</Label>
          <Input {...register('region', { required: 'Region is required' })} type="password" />
        </div>
        <div>
          <Label>SecretAccessKey</Label>
          <Input {...register('secretAccessKey', { required: 'SecretAccessKey is required' })} />
        </div>
        <div>
          <Label>apiEndpoint</Label>
          <Input {...register('apiEndpoint')} />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}
