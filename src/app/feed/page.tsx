"use client";
import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { Stories } from '@/components/feed/Stories';
import { FeedPosts } from '@/components/feed/FeedPosts';
import { FeedToggle } from '@/components/feed/FeedToggle';
import { CreatePostButton } from '@/components/feed/CreatePostButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLocationStore } from '@/store/locationStore';

export default function FeedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [feedType, setFeedType] = useState<'global' | 'local'>('global');
  const { city } = useLocationStore();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <Stories />
        <FeedToggle activeFeed={feedType} onToggle={setFeedType} />
        <FeedPosts feedType={feedType} city={city} />
        <CreatePostButton />
      </div>
      <Navigation />
    </div>
  );
}