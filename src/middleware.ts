import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Define paths that should skip authentication
const PUBLIC_PATHS = [
  '/api/auth/signin',
  '/api/auth/check',
  '/debug',
  '/_next',
  '/favicon.ico'
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log('Middleware: Processing request for', path);

  // Check if the path should skip authentication
  const isPublicPath = PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));
  if (isPublicPath) {
    console.log('Middleware: Skipping auth for public path:', path);
    return NextResponse.next();
  }

  // Skip static files
  if (path.includes('.')) {
    console.log('Middleware: Skipping auth for static file:', path);
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  console.log('Middleware: Tokens present:', {
    accessToken: !!accessToken,
    refreshToken: !!refreshToken,
    path
  });

  if (!accessToken) {
    console.log('Middleware: No access token provided for path:', path);
    return NextResponse.json(
      { error: 'No access token provided' },
      { status: 401 }
    );
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
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
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
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }
  }
} 