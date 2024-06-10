import type {
  UploadCompleteCallback,
  UploadSuccessCallback,
  Uppy,
  UppyFile,
} from '@uppy/core'
import { useEffect, useRef } from 'preact/hooks'
import type { DropzoneProps } from '.'
import { Dropzone } from '.'

export function DropzoneWithUploader({
  uploader,
  onFileUploaded,
  ...dropzoneProps
}: {
  uploader: Uppy
  onFileUploaded: (url: string, file: UppyFile) => {}
} & DropzoneProps) {
  console.log('===>', dropzoneProps)

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const successCallback: UploadSuccessCallback<{}> = (file, resp) => {
      onFileUploaded(resp.uploadURL!, file!)
    }
    const completeCallback: UploadCompleteCallback<{}> = () => {
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }

    uploader.on('upload-success', successCallback)
    uploader.on('complete', completeCallback)

    return () => {
      uploader.off('upload-success', successCallback)
      uploader.off('complete', completeCallback)
    }
  })

  function onFiles(files: File[]) {
    uploader.addFiles(
      files.map(file => ({
        data: file,
      })),
    )

    uploader.upload()
  }

  return <Dropzone {...dropzoneProps} onFileChosed={onFiles}></Dropzone>
}
