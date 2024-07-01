'use client'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { trpcClientReact } from '@/utils/api'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion'

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
        {/* <Button onClick={() => {
          redirect(`/dashboard/apps/${id}/new`)
        }}
        >
          <Plus />
        </Button> */}
        <Button asChild>
          <Link href={`/dashboard/apps/${id}/setting/storage/new`}>
            <Plus />
          </Link>
        </Button>
      </div>
      <Accordion type="single" collapsible>
        {storages?.map((storage) => {
          return (
            <AccordionItem key={storage.id} value={storage.id.toString()}>
              <AccordionTrigger className={storage.id === currentApp?.storageId ? 'text-blue-600' : ''}>{storage.name}</AccordionTrigger>
              <AccordionContent>
                <div className="text-md space-y-2 text-gray-500">
                  <div className="flex justify-between items-center">
                    <span>region</span>
                    <span>{ storage.configuration.region }</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>bucket</span>
                    <span>{ storage.configuration.bucket }</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>apiEndpoint</span>
                    <span>{ storage.configuration.apiEndpoint }</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Button
                      className="w-full"
                      onClick={() => {
                        mutate({ appId: id, storageId: storage.id })
                      }}
                    >
                      Use
                    </Button>
                  </div>
                </div>
              </AccordionContent>
              {/* <div key={storage.id} className="border p-4 flex justify-between items-center">
                <span>{storage.name}</span>
                <Button
                  disabled={storage.id === currentApp?.storageId}
                  onClick={() => {
                    mutate({ appId: id, storageId: storage.id })
                  }}
                >
                  {storage.id === currentApp?.storageId ? 'Used' : 'Use' }
                </Button>
              </div> */}
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
