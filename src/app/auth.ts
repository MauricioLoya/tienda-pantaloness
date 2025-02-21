import { AuthRepository } from '@/modules/auth/definitions'
import NextAuth, { DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      address: string
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user']
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (
          !credentials.username ||
          !credentials.password ||
          typeof credentials.password !== 'string' ||
          typeof credentials.username !== 'string'
        ) {
          return null
        }

        const authRepository = new AuthRepository()
        try {
          const user = authRepository.loginAdmin(
            credentials.username,
            credentials.password
          )
          if (!user) {
            return null
          }

          return user
        } catch (error) {
          console.error(error)
          return null
        }
      }
    })
  ]
})
