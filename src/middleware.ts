import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export async function middleware(request: NextRequest) {
  console.log('Middleware: Processing request for', request.nextUrl.pathname);
  
  // Skip authentication for auth-related routes and static files
  if (
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    console.log('Middleware: Skipping auth for', request.nextUrl.pathname);
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  console.log('Middleware: Tokens present:', {
    accessToken: !!accessToken,
    refreshToken: !!refreshToken
  });

  if (!accessToken) {
    console.log('Middleware: No access token provided');
    return NextResponse.json(
      { error: 'No access token provided' },
      { status: 401 }
    );
  }

  try {
    // Verify access token
    console.log('Middleware: Verifying access token...');
    jwt.verify(accessToken, JWT_SECRET) as { userId: string };
    
    // Token is valid, continue
    console.log('Middleware: Access token valid, proceeding');
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
        sameSite: 'lax', // Changed from 'strict' to 'lax' to allow cross-site requests
        maxAge: 60 * 60, // 1 hour
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