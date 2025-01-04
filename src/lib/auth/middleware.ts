import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths that don't require authentication
const publicPaths = new Set(["/", "/auth/signin"]);

export async function authMiddleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const isPublicPath = publicPaths.has(request.nextUrl.pathname);

  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}