'use client'

import type { UploadSuccessCallback } from '@uppy/core'
import { Uppy, UppyFile } from '@uppy/core'
import AWSS3 from '@uppy/aws-s3'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useUppyState } from './useUppyState'
import { trpcClient, trpcClientReact, trpcPureClient } from '@/utils/api'
import { Button } from '@/components/ui/Button'
import { UploadButton } from '@/components/feature/UploadButton'
import { Dropzone } from '@/components/feature/Dropzone'
import { cn } from '@/lib/utils'
import { usePasteFile } from '@/hooks/usePasteFile'
import UploadPreview from '@/components/feature/UploadPreview'

export default function Home() {
  const [uppy] = useState(() => {
    const uppy = new Uppy()
    uppy.use(AWSS3, {
      shouldUseMultipart: false,
      getUploadParameters(file) {
        return trpcPureClient.file.createPresignedUrl.mutate({
          filename:
                        file.data instanceof File ? file.data.name : 'test',
          contentType: file.data.type || '',
          size: file.size,
        })
      },
    })
    return uppy
  })

  const files = useUppyState(uppy, s => Object.values(s.files))
  // const progress = useUppyState(uppy, s => s.totalProgress)

  useEffect(() => {
    const handler: UploadSuccessCallback<{}> = (file, resp) => {
      if (file) {
        trpcPureClient.file.saveFile.mutate({
          name: file.data instanceof File ? file.data.name : 'test',
          path: resp.uploadURL ?? '',
          type: file.data.type,
        })
      }
    }
    uppy.on('upload-success', handler)

    return () => {
      uppy.off('upload-success', handler)
    }
  }, [uppy])

  const { data: fileList, isPending }
        = trpcClientReact.file.listFiles.useQuery()

  usePasteFile({
    onFilesPaste: (files) => {
      uppy.addFiles(
        files.map(file => ({
          data: file,
        })),
      )
    },
  })

  return (
    <div className="container mx-auto p-2">
      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => {
            uppy.upload()
          }}
        >
          Upload
        </Button>
        <UploadButton uppy={uppy} />
      </div>
      {isPending && <div>Loading</div>}
      <Dropzone uppy={uppy}>
        {(draging) => {
          return (
            <div
              className={cn(
                'flex flex-wrap gap-4 relative',
                draging && ' border border-dashed',
              )}
            >
              {draging && (
                <div className=" absolute inset-0 bg-secondary/30 flex justify-center items-center text-3xl">
                  Drop File Here to Upload
                </div>
              )}
              {fileList?.map((file) => {
                const isImage
                                    = file.contentType.startsWith('image')

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
          )
        }}
      </Dropzone>

      {files.map((file) => {
        const url = URL.createObjectURL(file.data)
        return <img src={url} key={file.id}></img>
      })}
      {/* <div>{progress}</div> */}
      <UploadPreview uppy={uppy}></UploadPreview>
    </div>
  )
}
