"use client";
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Post } from './Post';
import { useSession } from 'next-auth/react';

interface FeedPostsProps {
  feedType: 'global' | 'local';
  city: string | null;
}

export const FeedPosts: React.FC<FeedPostsProps> = ({ feedType, city }) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const { data: session } = useSession();
  const { ref, inView } = useInView();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts?type=${feedType}&city=${city}&page=${page}`);
        const data = await response.json();
        setPosts(prev => [...prev, ...data]);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [feedType, city, page]);

  useEffect(() => {
    if (inView) {
      setPage(prev => prev + 1);
    }
  }, [inView]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <Post key={post.id} post={post} />
      ))}
      
      {/* Loading trigger */}
      <div ref={ref} className="h-10">
        {loading && posts.length > 0 && (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};