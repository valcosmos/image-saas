import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

import { apps, files, storageConfiguration, users } from './schema'

export const insertUserSchema = createInsertSchema(users, {
  email: schema => schema.email.email(),
})

export const updateUserSchema = insertUserSchema.pick({ email: true })

export const queryUserSchema = createSelectSchema(users)

export const fileSchema = createSelectSchema(files)

export const filesCanOrderByColumns = fileSchema.pick({ createdAt: true, deletedAt: true })

export const createAppSchema = createInsertSchema(apps, {
  name: schema => schema.name.min(3),
})

export const createStorageSchema = createInsertSchema(storageConfiguration)
