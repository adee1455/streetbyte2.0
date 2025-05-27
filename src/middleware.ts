import { authMiddleware } from './lib/auth/middleware';

export default authMiddleware;

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 