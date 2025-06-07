import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export async function middleware(request: NextRequest) {
  // Skip authentication for auth-related routes
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'No access token provided' },
      { status: 401 }
    );
  }

  try {
    // Verify access token
    jwt.verify(accessToken, JWT_SECRET) as { userId: string };
    
    // Token is valid, continue
    return NextResponse.next();
  } catch {
    // Access token is invalid, try refresh token
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
    }

    try {
      // Verify refresh token
      const decodedRefresh = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
      
      // Generate new access token
      const newAccessToken = jwt.sign(
        { userId: decodedRefresh.userId },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Create response with new access token
      const response = NextResponse.next();
      
      response.cookies.set('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60, // 1 hour
        path: '/',
      });

      return response;
    } catch {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }
  }
} 