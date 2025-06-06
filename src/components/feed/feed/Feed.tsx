import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import PostCard from './PostCard';

export default function Feed() {
  const { posts, fetchPosts } = useStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="max-w-2xl mx-auto py-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
} 