import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const demoUsers = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@universidad.edu",
    legajo: "001245",
    password: "seguro123",
  },
  {
    id: "2",
    name: "Juan Pérez",
    email: "juan.perez@universidad.edu",
    legajo: "001578",
    password: "titulo2024",
  },
];

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciales institucionales",
      credentials: {
        email: { label: "Correo institucional", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const matchedUser = demoUsers.find(
          (user) => user.email === credentials.email.trim().toLowerCase()
        );

        if (!matchedUser) {
          return null;
        }

        const isValidPassword = credentials.password === matchedUser.password;

        if (!isValidPassword) {
          return null;
        }

        return {
          id: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          legajo: matchedUser.legajo,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.legajo = (user as { legajo?: string }).legajo;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.legajo = typeof token.legajo === "string" ? token.legajo : undefined;
      }
      return session;
    },
  },
};
