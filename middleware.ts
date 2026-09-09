import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/auth-page/login',
    '/auth-page/register',
    '/auth-page/forgot-password',
    '/auth-page/reset-password',
    '/auth-page/verify',
  ];

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route)
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check authentication
  if (!token) {
    return NextResponse.redirect(new URL('/auth-page/login', request.url));
  }

  // Verify token
  try {
    const secret = new TextEncoder().encode(
      process.env.NEXTAUTH_SECRET || 'fallback-secret'
    );
    const { payload } = await jwtVerify(token, secret);
    if (!payload) {
      return NextResponse.redirect(new URL('/auth-page/login', request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/auth-page/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     * - api/auth routes (public API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
};