import process from 'node:process'
import { type AuthOptions, getServerSession as nextAuthGetServerSession } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/server/db/db'

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db) as AuthOptions['adapter'],
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,

    }),
    // ...add more providers here
  ],
}

export function getServerSession() {
  return nextAuthGetServerSession(authOptions)
}
