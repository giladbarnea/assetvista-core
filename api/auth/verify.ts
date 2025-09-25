import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/kv';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    // Check session in KV
    const session = await get(`session:${sessionToken}`);
    
    if (!session || typeof session !== 'object') {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    const sessionData = session as any;
    
    // Check if session is expired
    if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

// Middleware function to check authentication
export async function verifySession(request: NextRequest): Promise<boolean> {
  try {
    const sessionToken = request.cookies.get('session')?.value;
    
    if (!sessionToken) {
      return false;
    }
    
    const session = await get(`session:${sessionToken}`);
    
    if (!session || typeof session !== 'object') {
      return false;
    }
    
    const sessionData = session as any;
    
    // Check if session is expired
    if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Session verification error:', error);
    return false;
  }
}