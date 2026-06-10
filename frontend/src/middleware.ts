import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // In a real application, you would verify the JWT here or check for an active session cookie
  // Since our access token is kept in memory and refresh token is HTTP-only,
  // middleware usually checks for the presence of the refresh_token cookie
  const refreshToken = request.cookies.get('refresh_token');
  const path = request.nextUrl.pathname;

  // Paths that do not require authentication
  const publicPaths = ['/login', '/public'];
  if (publicPaths.some(p => path.startsWith(p)) || path === '/') {
    return NextResponse.next();
  }

  if (!refreshToken) {
    // No session token found, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // To truly enforce role-based access in Next.js Edge Middleware, 
  // you'd typically decode the JWT payload or store role in a separate cookie.
  // We will assume the role is checked effectively by the backend, 
  // but we can add frontend route checks based on cookie data later.
  // For now, this just blocks unauthenticated users from accessing protected app directories.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
