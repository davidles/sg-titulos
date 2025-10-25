import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { loginWithCredentials } from "./api";

const NEXT_AUTH_SECRET = process.env.NEXTAUTH_SECRET ?? "development-secret";

export const authOptions: NextAuthOptions = {
  secret: NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
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

        try {
          const { user, token } = await loginWithCredentials(
            credentials.username,
            credentials.password
          );

          const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;

          return {
            id: String(user.id),
            name: displayName ?? undefined,
            username: user.username,
            personId: user.personId,
            firstName: user.firstName,
            lastName: user.lastName,
            documentNumber: user.documentNumber,
            accessToken: token,
          } satisfies {
            id: string;
            name?: string;
            username: string | null;
            personId: number | null;
            firstName: string | null;
            lastName: string | null;
            documentNumber: string | null;
            accessToken: string;
          };
        } catch (error) {
          console.error("Error during credentials authorization", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as {
          id: string;
          username: string | null;
          personId: number | null;
          firstName: string | null;
          lastName: string | null;
          documentNumber: string | null;
          accessToken: string;
        };

        token.id = typedUser.id ?? token.id;
        token.username = typedUser.username ?? undefined;
        token.personId = typedUser.personId ?? null;
        token.firstName = typedUser.firstName ?? null;
        token.lastName = typedUser.lastName ?? null;
        token.documentNumber = typedUser.documentNumber ?? null;
        token.accessToken = typedUser.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === "string" ? token.id : undefined;
        session.user.username = typeof token.username === "string" ? token.username : undefined;
        session.user.personId = typeof token.personId === "number" ? token.personId : null;
        session.user.firstName = typeof token.firstName === "string" || token.firstName === null
          ? (token.firstName as string | null)
          : null;
        session.user.lastName = typeof token.lastName === "string" || token.lastName === null
          ? (token.lastName as string | null)
          : null;
        session.user.documentNumber =
          typeof token.documentNumber === "string" || token.documentNumber === null
            ? (token.documentNumber as string | null)
            : null;
        session.user.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      }

      return session;
    },
  },
};
