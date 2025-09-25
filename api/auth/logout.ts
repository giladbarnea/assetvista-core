import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/kv';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value;
    
    if (sessionToken) {
      // Remove session from KV
      await del(`session:${sessionToken}`);
    }
    
    // Clear session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}