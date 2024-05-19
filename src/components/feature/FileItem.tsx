import Image from 'next/image'
import { useMemo } from 'react'

export default function FileItem({ url, name, isImage }: { url: string, name: string, isImage: boolean }) {
  // const isImage = contentType.startsWith('image')

  return isImage
    ? (
      <img src={url} alt={name} />
      )
    : (
      <Image
        src="/unknown-file-types.png"
        alt="unknow file type"
        width={100}
        height={100}
      />
      )
}

export function LocalFileItem({ file }: { file: File }) {
  const isImage = file.type.startsWith('image')

  const url = useMemo(() => {
    if (isImage)
      return URL.createObjectURL(file)
    return ''
  }, [isImage, file])

  return <FileItem isImage={isImage} url={url} name={file.name} />
}

export function RemoteFileItem({ contentType, name, url }: { contentType: string, name: string, url: string }) {
  const isImage = contentType.startsWith('image')

  return <FileItem isImage={isImage} url={url} name={name} />
}
