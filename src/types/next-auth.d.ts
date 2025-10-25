import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
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
    id?: string;
    username?: string;
    personId?: number | null;
    firstName?: string | null;
    lastName?: string | null;
    documentNumber?: string | null;
    accessToken?: string;
  }
}
