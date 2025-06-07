'use server';

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signJWT, setJWTCookie, removeJWTCookie, verifyJWT } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username } = body;

    // Here you would validate the username and password
    // For now, we'll just set a mock user
    const userData = {
      id: 1,
      username,
      first_name: 'Test',
      last_name: 'User'
    };

    // Create JWT token
    const token = await signJWT(userData);
    
    // Set the token in cookies
    setJWTCookie(token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1] || 
                 request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ isLoggedIn: false });
    }

    const userData = await verifyJWT(token);
    return NextResponse.json({ 
      isLoggedIn: !!userData,
      user: userData 
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ isLoggedIn: false });
  }
}

export async function DELETE() {
  try {
    removeJWTCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
} 