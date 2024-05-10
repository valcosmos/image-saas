import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/db/schema.ts',
  // driver: 'pg',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'root',
    password: '123456',
    database: 'postgres',
  },
  verbose: true,
  strict: true,
})
