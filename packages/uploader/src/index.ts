import type { UppyFile } from '@uppy/core'
import { Uppy } from '@uppy/core'
import type { AwsS3UploadParameters } from '@uppy/aws-s3'
import AWSS3 from '@uppy/aws-s3'

export function createUploader(getUploadParameters: (file: UppyFile) => Promise<AwsS3UploadParameters>) {
  const uppy = new Uppy()
  uppy.use(AWSS3, {
    shouldUseMultipart: false,
    getUploadParameters: getUploadParameters as any,
  })
  return uppy
}
