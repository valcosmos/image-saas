'use client'
import { Copy, Eye, Plus } from 'lucide-react'
import { useState } from 'react'
import copy from 'copy-to-clipboard'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { trpcClientReact } from '@/utils/api'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { Input } from '@/components/ui/Input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/Accordion'

function KeyString({ id }: { id: number }) {
  const { data: key } = trpcClientReact.apiKeys.requestKey.useQuery(id)

  return (
    <div className="flex justify-end items-center gap-2">
      <span>{key}</span>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => {
          copy(key!.toString())
          toast('secret key copied')
        }}
      >
        <Copy />
      </Button>
    </div>
  )
}

export default function ApiKeysPage({ params: { id } }: { params: { id: string } }) {
  const [newApiKeyName, setNewApiKeyName] = useState('')

  const { data: apiKeys } = trpcClientReact.apiKeys.listApiKeys.useQuery({ appId: id })

  // const { data: apps } = trpcClientReact.apps.listApps.useQuery()

  const utils = trpcClientReact.useUtils()

  const { mutate } = trpcClientReact.apiKeys.createApiKeys.useMutation({
    onSuccess: (data) => {
      utils.apiKeys.listApiKeys.setData({ appId: id }, (prev) => {
        setNewApiKeyName('')
        if (!prev || !data)
          return prev
        return [...prev, data]
      })
    },
  })

  const [showKeyMap, setShowKeyMap] = useState<Record<number, boolean>>({})

  return (
    <div className="pt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl">Api Keys</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <Plus />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-4">
              <Input placeholder="Name" onChange={e => setNewApiKeyName(e.target.value)} />
              <Button
                type="submit"
                onClick={() => {
                  mutate({ appId: id, name: newApiKeyName })
                }}
              >
                Submit
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Accordion type="single" collapsible>
        {apiKeys?.map((apiKey) => {
          return (
            <AccordionItem key={apiKey.id} value={apiKey.id.toString()}>
              <AccordionTrigger>{ apiKey.name }</AccordionTrigger>
              <AccordionContent>
                <div className="flex justify-between text-lg mb-4">
                  <span>Client ID</span>
                  <div className="flex justify-end items-center gap-2">
                    <span>{apiKey.clientId}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        copy(apiKey.clientId)
                        toast('client id copied')
                      }}
                    >
                      <Copy />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between text-lg mb-4">
                  <span>Secret Key</span>
                  {/* <span>{apiKey.key}</span> */}
                  {
                    !showKeyMap[apiKey.id] && (
                      <Button onClick={() => setShowKeyMap(oldMap => ({ ...oldMap, [apiKey.id]: true }))}>
                        <Eye />
                      </Button>
                    )
                  }
                  {
                    showKeyMap[apiKey.id] && (<KeyString id={apiKey.id} />)
                  }
                </div>

              </AccordionContent>
            </AccordionItem>
            // <div key={apiKey.id} className="border p-4 flex justify-between items-center">
            //   <span>{apiKey.name}</span>
            //   <span>{apiKey.key}</span>
            // </div>
          )
        })}
      </Accordion>
    </div>
  )
}
