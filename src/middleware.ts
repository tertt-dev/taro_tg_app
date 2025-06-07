import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

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

  // Skip auth check for the auth endpoint itself
  if (pathname === '/api/auth') {
    return NextResponse.next();
  }

  // Check if the request is for an API route
  if (pathname.startsWith('/api/')) {
    try {
      const session = await getIronSession<SessionData>(request.cookies, sessionOptions);

      if (!session.isLoggedIn) {
        return NextResponse.json(
          { error: 'Требуется авторизация' },
          { status: 401 }
        );
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Session error:', error);
      return NextResponse.json(
        { error: 'Ошибка сессии' },
        { status: 500 }
      );
    }
  }

  // For protected routes, check authentication
  const initData = request.nextUrl.searchParams.get('initData');
  if (!initData) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  console.log('Middleware: Tokens present:', {
    accessToken: !!accessToken,
    refreshToken: !!refreshToken,
    path: pathname
  });

  if (!accessToken) {
    console.log('Middleware: No access token provided for path:', pathname);
    // Instead of returning error JSON, redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // Verify access token
    console.log('Middleware: Verifying access token...');
    const decoded = jwt.verify(accessToken, JWT_SECRET) as { userId: string };
    console.log('Middleware: Access token valid for user:', decoded.userId);
    
    // Token is valid, continue
    return NextResponse.next();
  } catch {
    // Access token is invalid, try refresh token
    console.log('Middleware: Access token invalid, trying refresh token');
    if (!refreshToken) {
      console.log('Middleware: No refresh token available');
      // Instead of returning error JSON, redirect to home page
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Verify refresh token
      console.log('Middleware: Verifying refresh token...');
      const decodedRefresh = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
      console.log('Middleware: Refresh token valid for user:', decodedRefresh.userId);
      
      // Generate new access token
      console.log('Middleware: Generating new access token...');
      const newAccessToken = jwt.sign(
        { userId: decodedRefresh.userId },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Create response with new access token
      console.log('Middleware: Setting new access token cookie');
      const response = NextResponse.next();
      
      response.cookies.set('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60,
        path: '/',
      });

      return response;
    } catch {
      console.log('Middleware: Refresh token invalid');
      // Instead of returning error JSON, redirect to home page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}

export const config = {
  matcher: '/api/:path*',
} 