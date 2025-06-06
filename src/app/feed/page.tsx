'use client';

import React, { useEffect } from 'react';
import Header from '@/components/feed/layout/Header';
import StoriesBar from '@/components/feed/stories/StoriesBar';
import Feed from '@/components/feed/feed/Feed';
import StoryModal from '@/components/feed/stories/StoryModal';
import AddStoryCamera from '@/components/feed/stories/AddStoryCamera';
import PostUploadModal from '@/components/feed/upload/PostUploadModal';
import CommentModal from '@/components/feed/CommentModal';
import FloatingButton from '@/components/feed/layout/FloatingButton';
import { useStore } from '@/store/useStore';
import { Navigation } from '@/components/layout/Navigation';

export default function FeedPage() {
  const { 
    fetchPosts, 
    fetchStories, 
    isStoryModalOpen, 
    isAddStoryModalOpen,
    isPostUploadModalOpen,
    isCommentModalOpen
  } = useStore();
  
  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, [fetchPosts, fetchStories]);
  
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* <Header /> */}
      <StoriesBar />
      <Feed />
      
      {/* Modals */}
      {isStoryModalOpen && <StoryModal />}
      {isAddStoryModalOpen && <AddStoryCamera />}
      {isPostUploadModalOpen && <PostUploadModal />}
      {isCommentModalOpen && <CommentModal />}

      <FloatingButton />
      <Navigation />
    </div>
  );
} 