import { NextResponse } from 'next/server';
import { createOrGetUser } from '@/services/userService';

export async function POST(request: Request) {
  try {
    console.log('API route called');
    const userData = await request.json();
    console.log('Received user data:', userData);
    
    const user = await createOrGetUser(userData);
    console.log('User created/retrieved:', user);
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in user API route:', error);
    return NextResponse.json(
      { error: 'Failed to process user data' },
      { status: 500 }
    );
  }
} 