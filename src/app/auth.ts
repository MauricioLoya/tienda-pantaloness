import { AuthRepository } from '@/modules/auth/definitions';
import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface Session {
    user: {
      address: string;
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          !credentials.username ||
          !credentials.password ||
          typeof credentials.password !== 'string' ||
          typeof credentials.username !== 'string'
        ) {
          return null;
        }

        const authRepository = new AuthRepository();
        try {
          const user = authRepository.loginAdmin(credentials.username, credentials.password);
          if (!user) {
            return null;
          }

          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/mx/login',
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/mx/admin`;
    },
  },
});
