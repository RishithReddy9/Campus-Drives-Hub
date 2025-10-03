import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  
  
  const { pathname } = req.nextUrl;

  // Always allow Next.js internals and NextAuth API
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // --- Public routes ---
  if (pathname === "/") {
    return NextResponse.next();
  }

  // --- Guest-only page: /login ---
  if (pathname.startsWith("/login")) {
    if (token) {
      // ✅ logged in → redirect to safe page (not back to /login)
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // --- Protected routes: require login ---
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token.exp && typeof token.exp === "number" && Date.now() >= token.exp * 1000) {
    return NextResponse.redirect(new URL("/login", req.url));
  }


  // --- Role-based route protection ---
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api/auth|static).*)"],
};
