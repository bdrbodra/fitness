import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe subset of the auth config, shared between the full config
 * (auth.ts, which pulls in Prisma + bcrypt and only runs in Node) and
 * middleware.ts (which runs on the Edge runtime and can't use either).
 */
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isPublicPath =
        request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup";
      if (isPublicPath) return true;
      return isLoggedIn;
    },
  },
};
