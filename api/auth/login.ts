import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { get } from '@vercel/kv';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Get the stored password hash from environment
    const storedPasswordHash = process.env.APP_PASSWORD_HASH;
    
    if (!storedPasswordHash) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }
    
    // Hash the provided password and compare
    const providedPasswordHash = crypto
      .createHash('sha256')
      .update(password + process.env.PASSWORD_SALT || 'default-salt')
      .digest('hex');
    
    if (providedPasswordHash !== storedPasswordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    // Generate a secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    
    // Store session in KV
    await put(`session:${sessionToken}`, {
      authenticated: true,
      expiresAt: sessionExpiry,
      createdAt: Date.now()
    }, {
      access: 'public',
      addRandomSuffix: false
    });
    
    // Set session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}