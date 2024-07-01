import { type NextRequest, NextResponse } from 'next/server'
import type { GetObjectCommandInput } from '@aws-sdk/client-s3'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { TRPCError } from '@trpc/server'
import { db } from '@/server/db/db'

// const bucket = process.env.BUCKET
// const apiEndpoint = process.env.API_END_POINT
// const region = process.env.REGION
// const COS_APP_ID = process.env.COS_APP_ID as string
// const COS_APP_SECRET = process.env.COS_APP_SECRET as string

export async function GET(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  const file = await db.query.files.findFirst({
    where: (files, { eq }) => eq(files.id, id),
    with: {
      app: {
        with: {
          storage: true,
        },
      },
    },
  })

  if (!file?.app.storage)
    throw new TRPCError({ code: 'BAD_REQUEST' })

  const storage = file.app.storage.configuration

  if (!file || !file.contentType.startsWith('image'))
    return new NextResponse('', { status: 400 })

  const params: GetObjectCommandInput = {
    Bucket: storage.bucket,
    Key: decodeURIComponent(file.path),
  }

  const s3Client = new S3Client({
    endpoint: storage.apiEndpoint,
    region: storage.region,
    credentials: {
      accessKeyId: storage.accessKeyId,
      secretAccessKey: storage.secretAccessKey,
    },
  })

  const command = new GetObjectCommand(params)

  const response = await s3Client.send(command)

  const byteArray = await response.Body?.transformToByteArray()

  if (!byteArray) {
    return new NextResponse('', {
      status: 400,
    })
  }
  const image = sharp(byteArray)

  const query = new URL(request.url).searchParams

  const width = Number.parseInt(query.get('width') || '250')
  image.resize({ width })

  const rotate = Number.parseInt(query.get('rotate') || '0')

  image.rotate(rotate)

  const buffer = await image.webp().toBuffer()

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
