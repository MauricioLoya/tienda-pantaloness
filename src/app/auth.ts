import { AuthRepository } from '@/modules/auth/definitions';
import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      superAdmin: boolean;
      isDeleted: boolean;
    };
  }
  interface JWT {
    superAdmin?: boolean;
    isDeleted?: boolean;
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
          const user = await authRepository.loginAdmin(credentials.username, credentials.password);
          if (!user) {
            return null;
          }
          const userFound = await authRepository.getUserByEmail(user.email);

          const session = {
            id: userFound.id.toString(),
            email: userFound.email,
            name: userFound.name,
            superAdmin: userFound.superAdmin,
            isDeleted: userFound.isDeleted,
          } as DefaultSession['user'];

          return session;
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
    async session({ session, token }) {
      // This is where we need to pass the custom properties from token to session
      if (token && session.user) {
        session.user.superAdmin = token.superAdmin as boolean;
        session.user.isDeleted = token.isDeleted as boolean;
      }
      return session;
    },
    async jwt({ token, user }) {
      // When signing in, pass user properties to the token
      if (user) {
        token.superAdmin = user.superAdmin;
        token.isDeleted = user.isDeleted;
      }
      return token;
    },
  },
});
