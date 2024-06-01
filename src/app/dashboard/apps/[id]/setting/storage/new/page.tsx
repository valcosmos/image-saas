'use client'

import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { trpcClientReact } from '@/utils/api'
import type { S3StorageConfiguration } from '@/server/db/schema'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'

export default function StorageFormPage({ params: { id } }: { params: { id: string } }) {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<S3StorageConfiguration & { name: string }>()

  const { mutate } = trpcClientReact.storages.createStorage.useMutation()

  const onSubmit: SubmitHandler<S3StorageConfiguration & { name: string }> = (data) => {
    mutate(data)
    router.push(`/dashboard/apps/${id}/setting/storage`)
  }
  return (
    <div className="container pt-10">
      <h1 className="text-3xl mb-6  max-w-md mx-auto">Create Storage</h1>
      <form className="flex flex-col gap-4 max-w-md mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>Name</Label>
          <Input {...register('name', { required: 'Name is required', minLength: { value: 3, message: 'Name must be at least 3 characters long' } })} />
          <span className="text-red-500">{ errors.name?.message }</span>
        </div>
        <div>
          <Label>Bucket</Label>
          <Input {...register('bucket', { required: 'Bucket is required' })} />
          <span className="text-red-500">{ errors.bucket?.message }</span>
        </div>
        <div>
          <Label>AccessKeyId</Label>
          <Input {...register('accessKeyId', { required: 'AccessKeyId is required' })} />
          <span className="text-red-500">{ errors.accessKeyId?.message }</span>
        </div>
        <div>
          <Label>Region</Label>
          <Input {...register('region', { required: 'Region is required' })} type="password" />
          <span className="text-red-500">{ errors.region?.message }</span>
        </div>
        <div>
          <Label>SecretAccessKey</Label>
          <Input {...register('secretAccessKey', { required: 'SecretAccessKey is required' })} />
          <span className="text-red-500">{ errors.secretAccessKey?.message }</span>
        </div>
        <div>
          <Label>apiEndpoint</Label>
          <Input {...register('apiEndpoint')} />
          <span className="text-red-500">{ errors.apiEndpoint?.message }</span>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}
