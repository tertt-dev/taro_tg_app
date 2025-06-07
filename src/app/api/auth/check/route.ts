import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
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
      jwt.verify(accessToken, JWT_SECRET);
      return NextResponse.json({ isValid: true });
    } catch {
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

        const response = NextResponse.json({ isValid: true });

        // Set new tokens
        response.cookies.set('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax', // Changed from 'strict' to 'lax' to allow cross-site requests
          maxAge: 60 * 60, // 1 hour
          path: '/',
        });

        response.cookies.set('refresh_token', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax', // Changed from 'strict' to 'lax' to allow cross-site requests
          maxAge: 7 * 24 * 60 * 60, // 7 days
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
  } catch (error) {
    console.error('Protected route error:', error);
    return NextResponse.json(
      { error: 'Authentication check failed' },
      { status: 500 }
    );
  }
} 