import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import type Uppy from '@uppy/core'
import type { UploadCallback, UploadSuccessCallback } from '@uppy/core'
import type { inferRouterOutputs } from '@trpc/server'
import { Button } from '../ui/Button'
import { ScrollArea } from '../ui/ScrollArea'
import { LocalFileItem, RemoteFileItem } from './FileItem'
import { DeleteFile } from './FileItemAction'
import type { AppRouter } from '@/utils/api'
import { trpcClientReact, trpcPureClient } from '@/utils/api'
import { cn } from '@/lib/utils'
import { useUppyState } from '@/app/dashboard/useUppyState'
import type { FileOrderByColumn } from '@/server/routes/file'

type FileResult = inferRouterOutputs<AppRouter>['file']['listFiles']

export default function FileList({ uppy, orderBy }: { uppy: Uppy, orderBy: FileOrderByColumn }) {
  const queryKey = {
    limit: 10,
    orderBy,
  }
  // const { data: fileList, isPending } = trpcClientReact.file.listFiles.useQuery()
  const { data: infinityQueryData, isPending, fetchNextPage } = trpcClientReact.file.infinityQueryFiles.useInfiniteQuery(
    queryKey,
    {
      getNextPageParam: resp => resp.nextCursor,
    },
  )

  const filesList = infinityQueryData ? infinityQueryData?.pages.reduce((result, page) => [...result, ...page.items], [] as FileResult) : []

  const utils = trpcClientReact.useUtils()
  // const utils = trpcClientReact.useUtils()
  const [uploadingFileIDs, setUploadingFileIds] = useState<string[]>([])
  const uppyFiles = useUppyState(uppy, s => s.files)

  useEffect(() => {
    const handler: UploadSuccessCallback<object> = (file, resp) => {
      if (file) {
        trpcPureClient.file.saveFile.mutate({
          name: file.data instanceof File ? file.data.name : 'test',
          path: resp.uploadURL ?? '',
          type: file.data.type,
        }).then((resp) => {
          utils.file.infinityQueryFiles.setInfiniteData(queryKey, (prev) => {
            if (!prev)
              return prev
            return {
              ...prev,
              pages: prev.pages.map((page, index) => {
                if (index === 0)
                  return { ...page, items: [resp, ...page.items] }
                return page
              }),
            }
          })
        })
      }
    }

    const uploadProgressHandler: UploadCallback = (data) => {
      setUploadingFileIds(currentFile => [...currentFile, ...data.fileIDs])
    }

    const completeHandler = () => {
      setUploadingFileIds([])
    }

    uppy.on('upload', uploadProgressHandler)

    uppy.on('upload-success', handler)

    uppy.on('complete', completeHandler)

    return () => {
      uppy.off('upload-success', handler)
      uppy.off('upload', uploadProgressHandler)
      uppy.off('complete', completeHandler)
    }
  }, [uppy, utils])

  // --------------- intersection

  const bottomRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (bottomRef.current) {
      const observer = new IntersectionObserver(() => {
        fetchNextPage()
      }, { threshold: 0.1 })

      observer.observe(bottomRef.current)
      const element = bottomRef.current

      return () => {
        observer.unobserve(element)
        observer.disconnect()
      }
    }
  }, [])

  const handleFileDelete = (id: string) => {
    utils.file.infinityQueryFiles.setInfiniteData(queryKey, (prev) => {
      if (!prev)
        return prev
      return {
        ...prev,
        pages: prev.pages.map((page, index) => {
          if (index === 0)
            return { ...page, items: page.items.filter(item => item.id !== id) }
          return page
        }),
      }
    })
  }

  return (
    <ScrollArea>
      {isPending && <div>Loading</div>}
      <div className={cn('flex flex-wrap justify-center gap-4 relative container')}>
        {uploadingFileIDs.length > 0 && uploadingFileIDs.map((id) => {
          const file = uppyFiles[id]
          // const isImage = file.data.type.startsWith('image')
          // const url = URL.createObjectURL(file.data)
          return (
            <div
              key={file.id}
              className=" w-56 h-56 flex justify-center items-center border border-red-500"
            >
              <LocalFileItem file={file.data as File} />
            </div>
          )
        }) }

        {filesList?.map((file) => {
          // const isImage = file.contentType.startsWith('image')
          return (
            <div
              key={file.id}
              className="relative w-56 h-80 flex justify-center items-center border"
            >
              <div className="absolute inset-0 bg-background/30 justify-center items-center flex opacity-0 transition-all hover:opacity-100"><DeleteFile onDeleteSuccess={handleFileDelete} fileId={file.id} /></div>
              <RemoteFileItem contentType={file.contentType} url={file.url} name={file.name} />
            </div>
          )
        })}

      </div>
      <div ref={bottomRef} className={cn('justify-center p-8 hidden', FileList.length > 0 && 'flex')}>
        <Button variant="ghost" onClick={() => fetchNextPage()}>Load Next Page</Button>
      </div>

    </ScrollArea>
  )
}
