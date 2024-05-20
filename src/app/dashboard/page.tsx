'use client'

import type { UploadCallback, UploadSuccessCallback } from '@uppy/core'
import { Uppy } from '@uppy/core'
import AWSS3 from '@uppy/aws-s3'
import { useEffect, useState } from 'react'
import { MoveDown, MoveUp } from 'lucide-react'
import { useUppyState } from './useUppyState'
import { trpcClientReact, trpcPureClient } from '@/utils/api'
import { Button } from '@/components/ui/Button'
import { UploadButton } from '@/components/feature/UploadButton'
import { Dropzone } from '@/components/feature/Dropzone'
import { usePasteFile } from '@/hooks/usePasteFile'
import UploadPreview from '@/components/feature/UploadPreview'
import FileList from '@/components/feature/FileList'
import type { FileOrderByColumn } from '@/server/routes/file'

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

  const utils = trpcClientReact.useUtils()
  const files = useUppyState(uppy, s => Object.values(s.files))
  // const progress = useUppyState(uppy, s => s.totalProgress)
  const [_, setUploadingFileIds] = useState<string[]>([])
  // const uppyFiles = useUppyState(uppy, s => s.files)

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
  }, [uppy])

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
        <UploadButton uppy={uppy} />
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
                <FileList orderBy={orderBy} uppy={uppy} />
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
