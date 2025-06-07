'use server';

import { signJWT, setJWTCookie, removeJWTCookie, getJWTFromCookies, verifyJWT } from '@/lib/jwt';

export async function login(username: string) {
  try {
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
    await setJWTCookie(token);

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Login failed' };
  }
}

export async function logout() {
  try {
    await removeJWTCookie();
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { error: 'Logout failed' };
  }
}

export async function getUser() {
  try {
    const token = await getJWTFromCookies();
    if (!token) {
      return { user: null };
    }

    const userData = await verifyJWT(token);
    return { user: userData };
  } catch (error) {
    console.error('Get user error:', error);
    return { error: 'Failed to get user' };
  }
} 