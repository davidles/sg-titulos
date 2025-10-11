import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { DEMO_USERS } from "./mocks/demoUsers";

const NEXT_AUTH_SECRET = process.env.NEXTAUTH_SECRET ?? "development-secret";

export const authOptions: NextAuthOptions = {
  secret: NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales institucionales",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const matchedUser = DEMO_USERS.find(
          (user) => user.username === credentials.username.trim().toLowerCase()
        );

        if (!matchedUser) {
          return null;
        }

        if (matchedUser.accountStatus !== "ACTIVE") {
          return null;
        }

        const isValidPassword = credentials.password === matchedUser.password;

        if (!isValidPassword) {
          return null;
        }

        return {
          id: matchedUser.userId,
          name: matchedUser.fullName,
          username: matchedUser.username,
          legajo: matchedUser.recordNumber,
          nivelControl: matchedUser.controlLevelId,
          personaId: matchedUser.personId,
        } as {
          id: string;
          name: string;
          username: string;
          legajo: string;
          nivelControl: string;
          personaId: string;
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as {
          legajo?: string;
          username?: string;
          nivelControl?: string;
          personaId?: string;
        };
        token.legajo = typedUser.legajo;
        token.username = typedUser.username;
        token.nivelControl = typedUser.nivelControl;
        token.personaId = typedUser.personaId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.legajo = typeof token.legajo === "string" ? token.legajo : undefined;
        session.user.username = typeof token.username === "string" ? token.username : undefined;
        session.user.nivelControl = typeof token.nivelControl === "string" ? token.nivelControl : undefined;
        session.user.personaId = typeof token.personaId === "string" ? token.personaId : undefined;
      }
      return session;
    },
  },
};
