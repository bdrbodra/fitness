import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "TRAINER";
      trainerId: string | null;
      lang: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "USER" | "TRAINER";
    trainerId?: string | null;
    lang?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "USER" | "TRAINER";
    trainerId?: string | null;
    lang?: string;
  }
}
