import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      legajo?: string;
      username?: string;
      nivelControl?: string;
      personaId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    legajo?: string;
    username?: string;
    nivelControl?: string;
    personaId?: string;
  }
}
