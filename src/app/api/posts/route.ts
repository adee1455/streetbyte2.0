import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with actual database query
  const posts = [
    {
      id: '1',
      user: {
        id: '1',
        username: 'john_doe',
        avatar: '/avatars/john.jpg',
      },
      content: 'This is a sample post',
      images: ['/posts/sample1.jpg'],
      likes: 42,
      comments: [],
      createdAt: new Date().toISOString(),
    },
    // Add more sample posts as needed
  ];

  return NextResponse.json(posts);
} 