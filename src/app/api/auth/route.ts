import { NextResponse } from 'next/server';
import { createHash, createHmac } from 'crypto';
import jwt from 'jsonwebtoken';

const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set');
}

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

function checkSignature(initData: string, botToken: string): boolean {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  if (!hash) {
    console.log('No hash found in initData');
    return false;
  }

  // Remove hash from data before checking signature
  urlParams.delete('hash');
  
  // Sort parameters alphabetically
  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  // Calculate secret key
  const secretKey = createHash('sha256')
    .update(botToken)
    .digest();

  // Calculate data signature
  const signature = createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  console.log('Checking signature:');
  console.log('Data check string:', dataCheckString);
  console.log('Expected hash:', hash);
  console.log('Calculated signature:', signature);
  console.log('Match:', signature === hash);

  return signature === hash;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export async function POST(request: Request) {
  try {
    console.log('Processing authentication request...');
    const body = await request.json();
    const initData = body.initData as string;

    if (!initData) {
      console.log('No initData provided');
      return NextResponse.json(
        { error: 'No initData provided' },
        { status: 400 }
      );
    }

    console.log('Received initData:', initData);

    // Verify signature
    const isValid = checkSignature(initData, BOT_TOKEN);
    if (!isValid) {
      console.log('Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse user data
    const urlParams = new URLSearchParams(initData);
    const userStr = urlParams.get('user');
    if (!userStr) {
      console.log('No user data in initData');
      return NextResponse.json(
        { error: 'No user data in initData' },
        { status: 400 }
      );
    }

    console.log('User data string:', userStr);

    let user: TelegramUser;
    try {
      // Since we checked userStr is not null above, we can safely use it here
      const decodedStr = decodeURIComponent(userStr!);
      console.log('Decoded user string:', decodedStr);
      user = JSON.parse(decodedStr);
      console.log('Parsed user object:', user);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return NextResponse.json(
        { error: 'Invalid user data format' },
        { status: 400 }
      );
    }

    // Validate required user fields
    if (!user.id || !user.first_name) {
      console.log('Missing required user fields:', user);
      return NextResponse.json(
        { error: 'Missing required user fields' },
        { status: 400 }
      );
    }

    // Create JWT token with non-null assertion for JWT_SECRET since we checked it above
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username || '',
        firstName: user.first_name,
        lastName: user.last_name || ''
      },
      JWT_SECRET!,
      { expiresIn: '24h' }
    );

    console.log('Generated JWT token');

    // Set JWT token in cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    console.log('Authentication successful');
    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 