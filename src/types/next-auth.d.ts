import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      username?: string;
      personId?: number | null;
      firstName?: string | null;
      lastName?: string | null;
      documentNumber?: string | null;
      accessToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    personId?: number | null;
    firstName?: string | null;
    lastName?: string | null;
    documentNumber?: string | null;
    accessToken?: string;
  }
}
