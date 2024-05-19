import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import type Uppy from '@uppy/core'
import type { UploadCallback, UploadSuccessCallback } from '@uppy/core'
import { trpcClientReact, trpcPureClient } from '@/utils/api'
import { cn } from '@/lib/utils'
import { useUppyState } from '@/app/dashboard/useUppyState'

export default function FileList({ uppy }: { uppy: Uppy }) {
  const { data: fileList, isPending } = trpcClientReact.file.listFiles.useQuery()
  const utils = trpcClientReact.useUtils()
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
          utils.file.listFiles.setData(void 0, (prev) => {
            if (!prev)
              return prev
            return [resp, ...prev]
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

  return (
    <>
      {isPending && <div>Loading</div>}
      <div
        className={cn(
          'flex flex-wrap gap-4 relative',
        )}
      >

        {uploadingFileIDs.length > 0 && uploadingFileIDs.map((id) => {
          const file = uppyFiles[id]
          const isImage = file.data.type.startsWith('image')
          const url = URL.createObjectURL(file.data)
          return (
            <div
              key={file.id}
              className=" w-56 h-56 flex justify-center items-center border border-red-500"
            >
              {isImage
                ? (
                  <img
                    src={url}
                    alt={file.name}
                  />
                  )
                : (
                  <Image
                    src="/unknown-file-types.png"
                    alt="unknow file type"
                    width={100}
                    height={100}
                  >
                  </Image>
                  )}
            </div>
          )
        }) }

        {fileList?.map((file) => {
          const isImage = file.contentType.startsWith('image')
          return (
            <div
              key={file.id}
              className=" w-56 h-56 flex justify-center items-center border"
            >
              {isImage
                ? (
                  <img
                    src={file.url}
                    alt={file.name}
                  />
                  )
                : (
                  <Image
                    src="/unknown-file-types.png"
                    alt="unknow file type"
                    width={100}
                    height={100}
                  >
                  </Image>
                  )}
            </div>
          )
        })}
      </div>
    </>
  )
}
