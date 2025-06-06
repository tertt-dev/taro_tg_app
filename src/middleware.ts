import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export async function middleware(request: NextRequest) {
  // Only apply to /api/auth/protected routes
  if (!request.nextUrl.pathname.startsWith('/api/auth/protected')) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'No access token' },
      { status: 401 }
    );
  }

  try {
    // Verify access token
    const decoded = jwt.verify(accessToken, JWT_SECRET);
    return NextResponse.next();
  } catch (accessError) {
    // Access token is invalid, try refresh token
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token' },
        { status: 401 }
      );
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: number };
      
      // Generate new tokens
      const newAccessToken = jwt.sign(
        { userId: decoded.userId },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      const newRefreshToken = jwt.sign(
        { userId: decoded.userId },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const response = NextResponse.next();

      // Set new tokens
      response.cookies.set('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60, // 1 hour
        path: '/',
      });

      response.cookies.set('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      return response;
    } catch (refreshError) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }
  }
}

export const config = {
  matcher: '/api/auth/protected/:path*',
}; 