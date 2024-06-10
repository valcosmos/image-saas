import type Uppy from '@uppy/core'
import { useEffect } from 'react'
import type { UploadCompleteCallback, UploadSuccessCallback, UppyFile } from '@uppy/core'
import { useRef } from 'preact/hooks'
import { UploadButton, type UploadButtonProps } from '.'

export function UploadButtonWithUploader({ uploader, onFileUploaded, ...uploadButtonProps }: { uploader: Uppy, onFileUploaded: (url: string, file: UppyFile) => void } & UploadButtonProps) {
  function onFiles(files: File[]) {
    uploader.addFiles(files.map(file => ({ data: file })))
    uploader.upload()
  }

  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const successCallback: UploadSuccessCallback<any> = (file, resp) => {
      onFileUploaded(resp.uploadURL!, file!)
    }

    const completeCallback: UploadCompleteCallback<any> = () => {
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

  return (
    <UploadButton inputRef={inputRef} {...uploadButtonProps} onFileChosen={onFiles} />
  )
}
