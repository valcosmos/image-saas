import process from 'node:process'
import { drizzle } from 'drizzle-orm/neon-http'
// import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

function createDB() {
  const neonDBUrl = process.env.NEON_DB_URL
  console.log('----->', neonDBUrl)
  if (neonDBUrl) {
    const client = neon(neonDBUrl)

    return drizzle(client, { schema })
  }

  // for query purposes
  const queryClient = postgres('postgres://root:123456@0.0.0.0:5432/postgres')
  return drizzle(queryClient, { schema, logger: false })
}

export const db = createDB()
