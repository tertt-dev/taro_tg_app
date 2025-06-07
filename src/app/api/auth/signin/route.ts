import { NextRequest, NextResponse } from 'next/server';
import { isValid, parse } from '@telegram-apps/init-data-node';
import jwt from 'jsonwebtoken';

const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

if (!BOT_TOKEN) {
  console.error('BOT_TOKEN environment variable is not set');
}

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  console.log('Auth API: Received signin request');
  try {
    const body = await request.json();
    console.log('Auth API: Request body:', body);

    const { initData } = body;
    console.log('Auth API: Extracted initData:', initData);

    if (!initData) {
      console.log('Auth API: No initData provided');
      return NextResponse.json(
        { error: 'No initData provided' },
        { status: 400 }
      );
    }

    // Log BOT_TOKEN status
    console.log('Auth API: BOT_TOKEN present:', !!BOT_TOKEN);

    // Validate initData with bot token
    if (!BOT_TOKEN || !isValid(initData, BOT_TOKEN)) {
      console.log('Auth API: Invalid initData or missing BOT_TOKEN');
      return NextResponse.json(
        { error: 'Invalid initData' },
        { status: 401 }
      );
    }

    // Parse the validated initData
    console.log('Auth API: Parsing initData...');
    const data = parse(initData);
    console.log('Auth API: Parsed data:', data);
    
    if (!data.user?.id) {
      console.log('Auth API: No user data found in parsed initData');
      return NextResponse.json(
        { error: 'No user data found' },
        { status: 400 }
      );
    }

    // Create tokens
    console.log('Auth API: Creating tokens for user:', data.user.id);
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
    console.log('Auth API: Setting cookies...');
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60,
      path: '/',
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    console.log('Auth API: Authentication successful');
    return response;
  } catch (error) {
    console.error('Auth API: Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 