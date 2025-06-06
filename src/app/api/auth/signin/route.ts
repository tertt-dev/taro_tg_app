import { NextResponse } from 'next/server';
import { isValid, parse } from '@telegram-apps/init-data-node';
import jwt from 'jsonwebtoken';

const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN environment variable is not set');
}

export async function POST(request: Request) {
  try {
    const { initData } = await request.json();

    if (!initData) {
      return NextResponse.json(
        { error: 'No initData provided' },
        { status: 400 }
      );
    }

    // Validate initData with bot token
    if (!BOT_TOKEN || !isValid(initData, BOT_TOKEN)) {
      return NextResponse.json(
        { error: 'Invalid initData' },
        { status: 401 }
      );
    }

    // Parse the validated initData
    const data = parse(initData);
    
    if (!data.user?.id) {
      return NextResponse.json(
        { error: 'No user data found' },
        { status: 400 }
      );
    }

    // Create tokens
    const accessToken = jwt.sign(
      { userId: data.user.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: data.user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create the response
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // Set httpOnly cookies
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 