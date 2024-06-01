'use client'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { trpcClientReact } from '@/utils/api'

export default function StoragePage({ params: { id } }: { params: { id: string } }) {
  const { data: storages } = trpcClientReact.storages.listStorages.useQuery()

  const { data: apps } = trpcClientReact.apps.listApps.useQuery()

  const utils = trpcClientReact.useUtils()

  const { mutate } = trpcClientReact.apps.changeStorage.useMutation({
    onSuccess: (data, { appId, storageId }) => {
      utils.apps.listApps.setData(void 0, (prev) => {
        if (!prev)
          return prev
        return prev.map(p => p.id === appId ? ({ ...p, storageId }) : p)
      })
    },
  })

  const currentApp = apps?.filter(app => app.id === id)[0]
  return (
    <div className="container pt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Storage</h1>
        <Button onClick={() => {
          redirect(`/dashboard/apps/${id}/new`)
        }}
        >
          <Plus />
        </Button>
      </div>

      {storages?.map((storage) => {
        return (
          <div key={storage.id} className="border p-4 flex justify-between items-center">
            <span>{storage.name}</span>
            <Button
              disabled={storage.id === currentApp?.storageId}
              onClick={() => {
                mutate({ appId: id, storageId: storage.id })
              }}
            >
              {storage.id === currentApp?.storageId ? 'Used' : 'Use' }
            </Button>
          </div>
        )
      }) }
    </div>
  )
}
