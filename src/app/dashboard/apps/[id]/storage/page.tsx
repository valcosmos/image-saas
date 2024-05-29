'use client'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { trpcClientReact } from '@/utils/api'

export default function StoragePage({ params: { id } }: { params: { id: string } }) {
  const { data: storages } = trpcClientReact.storages.listStorages.useQuery()
  const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery()
  const currentApp = apps?.filter(app => app.id === id)[0]
  return (
    <div className="container pt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Storage</h1>
        <Button>
          <Plus />
        </Button>
      </div>

      {storages?.map((storage) => {
        return (
          <div key={storage.id} className="border p-4 flex justify-between items-center">
            <span>{storage.name}</span>
            <Button disabled={storage.id === currentApp?.storageId}>
              {storage.id === currentApp?.storageId ? 'Used' : 'Use' }
            </Button>
          </div>
        )
      }) }
    </div>
  )
}
