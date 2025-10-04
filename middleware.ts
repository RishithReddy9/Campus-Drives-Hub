import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret,
    secureCookie: process.env.NODE_ENV === "production",
  });
  const { pathname } = req.nextUrl;

  // Allow public & Next.js internal routes
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Guest-only page: /login
  if (pathname.startsWith("/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Token expired
  if (token.exp && typeof token.exp === "number" && Date.now() >= token.exp * 1000) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin-only protection
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/drives/:path*",
    "/resources/:path*",
    "/calendar/:path*",
    "/admin/:path*",
  ],
};
