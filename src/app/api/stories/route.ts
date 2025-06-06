import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with actual database query
  const stories = [
    {
      id: '1',
      user: {
        id: '1',
        username: 'john_doe',
        avatar: '/avatars/john.jpg',
      },
      media: '/stories/sample1.jpg',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    },
    // Add more sample stories as needed
  ];

  return NextResponse.json(stories);
} 