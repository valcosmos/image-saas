import process from 'node:process'
import z from 'zod'
import type {
  PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuid } from 'uuid'
import { desc } from 'drizzle-orm'
import { files } from '../db/schema'
import { db } from '../db/db'
import { protectedProcedure, router } from '../trpc'

const bucket = process.env.BUCKET
const apiEndpoint = process.env.API_END_POINT
const region = process.env.REGION

export const fileRoutes = router({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const date = new Date()

      const isoString = date.toISOString()

      const dateString = isoString.split('T')[0]

      const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: `${dateString}/${input.filename.replaceAll(' ', '_')}`,
        ContentType: input.contentType,
        ContentLength: input.size,
      }

      const s3Client = new S3Client({
        endpoint: apiEndpoint,
        region,
        credentials: {
          accessKeyId: process.env.COS_APP_ID as string,
          secretAccessKey: process.env.COS_APP_SECRET as string,
        },
      })

      const command = new PutObjectCommand(params)
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: 60,
      })

      return {
        url,
        method: 'PUT' as const,
      }
    }),
  saveFile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        path: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { session } = ctx

      const url = new URL(input.path)

      const photo = await db
        .insert(files)
        .values({
          ...input,
          id: uuid(),
          path: url.pathname,
          url: url.toString(),
          userId: session.user.id,
          contentType: input.type,
        })
        .returning()

      return photo[0]
    }),

  listFiles: protectedProcedure.query(async () => {
    const result = await db.query.files.findMany({
      orderBy: [desc(files.createdAt)],
    })

    return result
  }),
})
