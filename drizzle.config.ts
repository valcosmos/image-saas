import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/db/schema.ts',
  // driver: 'aws-data-api',
  dialect: 'postgresql',
  dbCredentials: {
    ssl: false,
    host: '0.0.0.0',
    port: 5432,
    user: 'root',
    password: '123456',
    database: 'postgres',
  },
  verbose: true,
  strict: true,
})
