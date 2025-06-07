import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

// Get environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;

// Validate environment variables
function validateEnvironment() {
  const missingVars = [];
  
  console.log('Checking environment variables:');
  console.log('BOT_TOKEN:', BOT_TOKEN);
  
  if (!BOT_TOKEN || BOT_TOKEN.length === 0) {
    missingVars.push('BOT_TOKEN');
  }
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
}

function checkTelegramSignature(initData: string, botToken: string): boolean {
  try {
    console.log('Checking signature for initData:', initData);
    
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    if (!hash) {
      console.log('No hash found in initData');
      return false;
    }
    
    // Data-check-string is a concatenation of all received fields, sorted in alphabetical order, 
    // in the format key=<value> with a line feed character ('\n') used as separator
    // (e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>')
    
    // Remove hash from the check
    urlParams.delete('hash');
    
    // Create the data check string
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    console.log('Data check string:', dataCheckString);
    
    // The secret key is a SHA256 hash of the bot's token
    const secretKey = createHash('sha256')
      .update(botToken)
      .digest();
    
    console.log('Secret key (hex):', secretKey.toString('hex'));
    
    // The signature is a hex-encoded HMAC-SHA-256 signature of the data-check-string 
    // using the secret key
    const signature = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    
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
    const isValid = checkTelegramSignature(initData, BOT_TOKEN!);
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

    // Get session and update it
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    
    session.isLoggedIn = true;
    session.userId = user.id;
    session.username = user.username;
    session.firstName = user.first_name;
    session.lastName = user.last_name;
    
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Ошибка аутентификации. Пожалуйста, попробуйте позже.' },
      { status: 500 }
    );
  }
} 