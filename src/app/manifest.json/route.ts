import { NextResponse } from 'next/server';
import manifest from '../../manifest.json';

export async function GET() {
  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  });
} 