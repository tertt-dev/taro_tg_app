import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getJWTFromRequest, verifyJWT } from '@/lib/jwt';

// Define paths that should skip authentication
const PUBLIC_PATHS = [
  '/',
  '/debug',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/.well-known',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  try {
    // Get JWT token from request
    const token = getJWTFromRequest(request);
    if (!token) {
      return NextResponse.redirect(new URL('/api/auth', request.url));
    }

    // Verify JWT token
    const userData = await verifyJWT(token);
    if (!userData) {
      return NextResponse.redirect(new URL('/api/auth', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(new URL('/api/auth', request.url));
  }
}

export const config = {
  matcher: '/api/:path*',
} 