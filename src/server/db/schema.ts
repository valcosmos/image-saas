import { relations } from 'drizzle-orm'
import {
  date,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type { AdapterAccount } from 'next-auth/adapters'

export const users = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  createAt: date('create_at').defaultNow(),
})

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').notNull().primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  vt => ({
    compoundKey: primaryKey({
      columns: [vt.identifier, vt.token],
    }),
  }),
)

export const files = pgTable('files', {
  id: uuid('id').notNull().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  deletedAt: timestamp('deleted_at', { mode: 'date' }),
  path: varchar('path', { length: 1024 }).notNull(),
  url: varchar('url', { length: 1024 }).notNull(),
  userId: text('user_id').notNull(),
  contentType: varchar('content_type', { length: 100 }).notNull(),
})

export const photosRelations = relations(files, ({ one }) => ({
  photos: one(users, { fields: [files.userId], references: [users.id] }),
}))
