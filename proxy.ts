import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    "/((?!api/auth|login|signup|_next/static|_next/image|favicon.ico|icon|apple-icon|icons|manifest.webmanifest|sw.js).*)",
  ],
};
