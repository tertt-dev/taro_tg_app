import { NextResponse } from 'next/server';
import { createHash, createHmac } from 'crypto';
import jwt from 'jsonwebtoken';

// Get environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

// Validate environment variables
function validateEnvironment() {
  const missingVars = [];
  
  console.log('Checking environment variables:');
  console.log('BOT_TOKEN length:', BOT_TOKEN?.length);
  console.log('JWT_SECRET length:', JWT_SECRET?.length);
  
  if (!BOT_TOKEN || BOT_TOKEN.length === 0) {
    missingVars.push('BOT_TOKEN');
  }
  
  if (!JWT_SECRET || JWT_SECRET.length === 0) {
    missingVars.push('JWT_SECRET');
  }
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
}

function checkSignature(initData: string, botToken: string): boolean {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) {
      console.log('No hash found in initData');
      return false;
    }

    // Remove hash from data before checking signature
    urlParams.delete('hash');

    // Sort parameters alphabetically
    const dataCheckArr = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`);

    const dataCheckString = dataCheckArr.join('\n');

    // Calculate secret key
    const secretKey = createHash('sha256')
      .update(botToken)
      .digest();

    // Calculate data signature
    const hmac = createHmac('sha256', secretKey);
    hmac.update(dataCheckString);
    const signature = hmac.digest('hex');

    console.log('Validation details:', {
      dataCheckString,
      expectedHash: hash,
      calculatedSignature: signature,
      match: signature === hash
    });

    return signature === hash;
  } catch (error) {
    console.error('Error checking signature:', error);
    return false;
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
  allows_write_to_pm?: boolean;
}

export async function POST(request: Request) {
  try {
    // Validate environment first
    if (!validateEnvironment()) {
      return NextResponse.json(
        { error: 'Ошибка конфигурации сервера. Пожалуйста, обратитесь в поддержку.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    let initData = body.initData as string;

    if (!initData) {
      console.log('No initData provided');
      return NextResponse.json(
        { error: 'Не предоставлены данные инициализации' },
        { status: 400 }
      );
    }

    // Extract initData from URL hash if present
    if (initData.includes('#')) {
      const hashPart = initData.split('#')[1];
      const hashParams = new URLSearchParams(hashPart);
      const tgWebAppData = hashParams.get('tgWebAppData');
      if (tgWebAppData) {
        initData = tgWebAppData;
      }
    }

    console.log('Processing initData:', initData);

    // Verify signature
    const isValid = checkSignature(initData, BOT_TOKEN!);
    if (!isValid) {
      console.log('Invalid signature');
      return NextResponse.json(
        { error: 'Ошибка проверки подписи. Пожалуйста, попробуйте снова.' },
        { status: 401 }
      );
    }

    // Parse user data
    const urlParams = new URLSearchParams(initData);
    const userStr = urlParams.get('user');
    if (!userStr) {
      console.log('No user data in initData');
      return NextResponse.json(
        { error: 'Данные пользователя не найдены' },
        { status: 400 }
      );
    }

    let user: TelegramUser;
    try {
      const decodedStr = decodeURIComponent(userStr);
      user = JSON.parse(decodedStr);
    } catch (error) {
      console.error('Failed to parse user data:', error);
      return NextResponse.json(
        { error: 'Неверный формат данных пользователя' },
        { status: 400 }
      );
    }

    // Validate required user fields
    if (!user.id || !user.first_name) {
      console.log('Missing required user fields:', user);
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля пользователя' },
        { status: 400 }
      );
    }

    // Create JWT token
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

    // Set JWT token in cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Ошибка аутентификации. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
} 