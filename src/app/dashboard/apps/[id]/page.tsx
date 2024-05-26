'use client'

import { Uppy } from '@uppy/core'
import AWSS3 from '@uppy/aws-s3'
import { useState } from 'react'
import { MoveDown, MoveUp } from 'lucide-react'
import Link from 'next/link'
import { useUppyState } from '../../useUppyState'
import { trpcPureClient } from '@/utils/api'
import { Button } from '@/components/ui/Button'
import { UploadButton } from '@/components/feature/UploadButton'
import { Dropzone } from '@/components/feature/Dropzone'
import { usePasteFile } from '@/hooks/usePasteFile'
import UploadPreview from '@/components/feature/UploadPreview'
import FileList from '@/components/feature/FileList'
import type { FileOrderByColumn } from '@/server/routes/file'

export default function AppPage({ params: { id: appId } }: { params: { id: string } }) {
  const [uppy] = useState(() => {
    const uppy = new Uppy()
    uppy.use(AWSS3, {
      shouldUseMultipart: false,
      getUploadParameters(file) {
        return trpcPureClient.file.createPresignedUrl.mutate({
          filename: file.data instanceof File ? file.data.name : 'test',
          contentType: file.data.type || '',
          size: file.size,
          appId,
        })
      },
    })
    return uppy
  })

  const files = useUppyState(uppy, s => Object.values(s.files))

  usePasteFile({
    onFilesPaste: (files) => {
      uppy.addFiles(
        files.map(file => ({
          data: file,
        })),
      )
    },
  })

  // const uppyFiles = useUppyState(uppy, s => s.files)

  const [orderBy, setOrderBy] = useState<Exclude<FileOrderByColumn, undefined>>({ field: 'createdAt', order: 'desc' })
  return (
    <div className="mx-auto h-screen">
      <div className="container flex justify-between items-center mb-4 h-[60px]">
        {/* <Button
          onClick={() => {
            uppy.upload()
          }}
        >
          Upload
        </Button> */}
        <Button onClick={() => {
          setOrderBy(current => ({ ...current, order: current?.order === 'asc' ? 'desc' : 'asc' }))
        }}
        >
          Created At
          { orderBy.order === 'desc' ? <MoveUp /> : <MoveDown /> }
        </Button>
        <div className="flex justify-center gap-2">
          <UploadButton uppy={uppy} />
          <Button asChild>
            <Link href="/dashboard/apps/new">New App</Link>
          </Button>
        </div>
      </div>

      <Dropzone uppy={uppy} className="relative h-[calc(100% - 60px)]">
        {
          (draging) => {
            return (
              <>
                {
                  draging && (
                    <div className=" absolute inset-0 bg-secondary/50 z-10 flex justify-center items-center text-3xl">
                      Drop File Here to Upload
                    </div>
                  )
                }
                <FileList appId={appId} orderBy={orderBy} uppy={uppy} />
              </>
            )
          }
        }
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
