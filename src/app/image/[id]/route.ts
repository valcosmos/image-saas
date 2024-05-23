import process from 'node:process'
import { type NextRequest, NextResponse } from 'next/server'
import type { GetObjectCommandInput } from '@aws-sdk/client-s3'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import sharp from 'sharp'
import { db } from '@/server/db/db'

const bucket = process.env.BUCKET
const apiEndpoint = process.env.API_END_POINT
const region = process.env.REGION
const COS_APP_ID = process.env.COS_APP_ID as string
const COS_APP_SECRET = process.env.COS_APP_SECRET as string

export async function GET(request: NextRequest, { params: { id } }: { params: { id: string } }) {
  const file = await db.query.files.findFirst({
    where: (files, { eq }) => eq(files.id, id),
  })

  if (!file || !file.contentType.startsWith('image'))
    return new NextResponse('', { status: 400 })

  const params: GetObjectCommandInput = {
    Bucket: bucket,
    Key: file.path,
  }

  console.log('--->bucket', bucket)
  console.log('--->apiEndpoint', apiEndpoint)
  console.log('--->region', region)
  console.log('--->COS_APP_ID', COS_APP_ID)
  console.log('--->COS_APP_SECRET', COS_APP_SECRET)

  const s3Client = new S3Client({
    endpoint: apiEndpoint,
    region,
    credentials: {
      accessKeyId: COS_APP_ID,
      secretAccessKey: COS_APP_SECRET,
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

  image.resize({ width: 250, height: 250 })
  const buffer = await image.webp().toBuffer()

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
