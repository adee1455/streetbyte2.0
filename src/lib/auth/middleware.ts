import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public paths that don't require authentication
const publicPaths = new Set([
  // Public pages
  "/",
  "/home",
  "/auth/signin",
  "/vendorPage",
  "/install",
  "/videos",
  
  // Public API routes
  "/api/auth",
  "/api/cards",
  "/api/check-vendors",
  "/api/vendorPage",
  "/api/vendors",
  "/api/vendor-images",
  "/api/menu-images",
  
  // Static and system paths
  "/_next",
  "/favicon.ico",
  "/images",
  "/static"
]);

export async function authMiddleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    const isAuthenticated = !!token;
    const path = request.nextUrl.pathname;
    
    // Check if the path is public
    const isPublicPath = Array.from(publicPaths).some(publicPath => 
      path === publicPath || path.startsWith(publicPath + '/')
    );

    // Allow access to public paths
    if (isPublicPath) {
      return NextResponse.next();
    }

    // Redirect to sign in if not authenticated
    if (!isAuthenticated) {
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    // In case of error, allow the request to proceed
    return NextResponse.next();
  }
}