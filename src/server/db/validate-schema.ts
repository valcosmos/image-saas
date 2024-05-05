import { createInsertSchema } from 'drizzle-zod'

import { users } from './schema'

export const insertUserSchema = createInsertSchema(users, {
  email: schema => schema.email.email(),
})
