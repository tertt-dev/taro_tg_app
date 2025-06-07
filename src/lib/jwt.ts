import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface UserData {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
}

// Create a JWT token
export async function signJWT(payload: UserData) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const alg = 'HS256';

  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);

  return jwt;
}

// Verify a JWT token
export async function verifyJWT(token: string): Promise<UserData | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as UserData;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Get JWT from cookies in server components
export async function getJWTFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token');
  return token?.value;
}

// Get JWT from request headers or cookies in middleware/API routes
export function getJWTFromRequest(req: NextRequest) {
  // First try to get the token from the Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  // If no Authorization header, try cookies
  const token = req.cookies.get('auth-token');
  return token?.value;
}

// Set JWT in cookies
export async function setJWTCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

// Remove JWT from cookies
export async function removeJWTCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
} 