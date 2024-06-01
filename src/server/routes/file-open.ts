import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm'
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
import { TRPCError } from '@trpc/server'
import { files } from '../db/schema'
import { db } from '../db/db'
import { router, withAppProcedure } from '../trpc'
import { filesCanOrderByColumns } from '../db/validate-schema'

// const bucket = process.env.BUCKET
// const apiEndpoint = process.env.API_END_POINT
// const region = process.env.REGION

const fileOrderByColumnSchema = z.object({ field: filesCanOrderByColumns.keyof(), order: z.enum(['desc', 'asc']) }).optional()

export type FileOrderByColumn = z.infer<typeof fileOrderByColumnSchema>

export const fileOpenRoutes = router({
  createPresignedUrl: withAppProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        size: z.number(),
        appId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const date = new Date()

      const isoString = date.toISOString()

      const dateString = isoString.split('T')[0]

      // const app = await db.query.apps.findFirst({
      //   where: (apps, { eq }) => eq(apps.id, input.appId),
      //   with: {
      //     storage: true,
      //   },
      // })
      const { app } = ctx

      if (!app || !app.storage) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        })
      }

      if (app.userId !== ctx.user.id)
        throw new TRPCError({ code: 'FORBIDDEN' })

      const storage = app.storage

      const params: PutObjectCommandInput = {
        Bucket: storage.configuration.bucket,
        Key: `${dateString}/${input.filename.replaceAll(' ', '_')}`,
        ContentType: input.contentType,
        ContentLength: input.size,
      }

      const s3Client = new S3Client({
        endpoint: storage.configuration.apiEndpoint,
        // endpoint: apiEndpoint,
        region: storage.configuration.region,
        credentials: {
          accessKeyId: storage.configuration.accessKeyId,
          secretAccessKey: storage.configuration.secretAccessKey,
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
  saveFile: withAppProcedure
    .input(
      z.object({
        name: z.string(),
        path: z.string(),
        type: z.string(),
        appId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx

      const url = new URL(input.path)

      const photo = await db
        .insert(files)
        .values({
          ...input,
          id: uuid(),
          path: url.pathname,
          url: url.toString(),
          userId: user?.id,
          contentType: input.type,
        })
        .returning()

      return photo[0]
    }),

  listFiles: withAppProcedure.input(z.object({ appId: z.string() })).query(async ({ ctx, input }) => {
    const result = await db.query.files.findMany({
      orderBy: [desc(files.createdAt)],
      where: (files, { eq }) => and(eq(files.userId, ctx.user.id), eq(files.appId, input.appId)),
    })

    return result
  }),
  infinityQueryFiles: withAppProcedure.input(z.object({
    cursor: z.object({ id: z.string(), createdAt: z.string() }).optional(),
    limit: z.number().default(10),
    orderBy: fileOrderByColumnSchema,
    appId: z.string(),
  })).query(async ({ input, ctx }) => {
    const { cursor, limit, orderBy = { field: 'createdAt', order: 'desc' } } = input
    // const result = await db.query.files.findMany({})

    const deleteFilter = isNull(files.deletedAt)
    const userFilter = eq(files.userId, ctx.user?.id)
    const appFilter = eq(files.appId, input.appId)

    const statement = db
      .select()
      .from(files)
      .limit(limit)
      // .where(cursor ? lt(files.createdAt, new Date(cursor)) : undefined)
      .where(cursor ? and(sql`("files"."created_at", "files"."id")<(${new Date(cursor.createdAt).toISOString()}, ${cursor.id})`, deleteFilter, userFilter, appFilter) : and(deleteFilter, userFilter, appFilter))
      // .orderBy(desc(files.createdAt))

    statement.orderBy(orderBy.order === 'desc' ? desc(files[orderBy.field]) : asc(files[orderBy.field]))
    const result = await statement
    return {
      items: result,
      // nextCursor: result.length > 0 ? result[result.length - 1].createdAt : null,
      nextCursor: result.length > 0
        ? { createdAt: result[result.length - 1].createdAt!, id: result[result.length - 1].id }
        : null,
    }
  }),

  deleteFile: withAppProcedure.input(z.string()).mutation(async ({ input }) => {
    return db.update(files).set({ deletedAt: new Date() }).where(eq(files.id, input))
  }),

})
