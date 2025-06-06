import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import Avatar from '../shared/Avatar';
import IconButton from '../shared/IconButton';
import { Post } from '@/types/feed';
import { useStore } from '@/store/useStore';
import { formatTimeAgo, formatNumber, parseContent } from '@/utils/formatters';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const { toggleLikePost, toggleSavePost, openCommentModal } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const handleLike = () => {
    toggleLikePost(post.id);
  };
  
  const handleSave = () => {
    toggleSavePost(post.id);
  };
  
  const handleComment = () => {
    openCommentModal(post.id);
  };
  
  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert('Share functionality would open here');
  };
  
  const nextImage = () => {
    if (currentImageIndex < post.mediaUrls.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  return (
    <div className="bg-white  rounded-md mb-4 overflow-hidden">
      {/* Post header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <Avatar 
            src={post.user?.avatar || ''} 
            alt={post.user?.name || ''} 
            size="md" 
          />
          <div>
            <p className="font-semibold">{post.user?.username}</p>
            <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
          </div>
        </div>
        <IconButton
          icon={<MoreHorizontal size={20} />}
          variant="ghost"
          size="sm"
        />
      </div>
      
      {/* Post media */}
      <div className="relative">
        <img 
          src={post.mediaUrls[currentImageIndex]} 
          alt="Post" 
          className="w-full object-cover"
          style={{ maxHeight: '500px' }}
          onDoubleClick={handleLike}
        />
        
        {/* Image navigation dots */}
        {post.mediaUrls.length > 1 && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-2">
            {post.mediaUrls.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-[#EF4443]' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Image navigation arrows */}
        {post.mediaUrls.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1"
                onClick={prevImage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {currentImageIndex < post.mediaUrls.length - 1 && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1"
                onClick={nextImage}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-4">
        <IconButton
            icon={<Heart size={24} />}
            onClick={handleLike}
            active={post.liked}
          />
          <IconButton
            icon={<MessageCircle size={24} />}
            onClick={handleComment}
          />
          <IconButton
            icon={<Share2 size={24} />}
            onClick={handleShare}
          />
        </div>
        <IconButton
          icon={<Bookmark size={24} fill={post.saved ? '#000000' : 'none'} />}
          onClick={handleSave}
          active={post.saved}
        />
      </div>
      
      {/* Likes count */}
      <div className="px-4 pb-1">
        <p className="font-semibold">{formatNumber(post.likes)} likes</p>
      </div>
      
      {/* Post content */}
      <div className="px-4 pb-2">
        <p>
          <span className="font-semibold mr-2">{post.user?.username}</span>
          {parseContent(post.content)}
        </p>
      </div>
      
      {/* Comments preview */}
      {post.comments.length > 0 && (
        <div className="px-4 pb-3">
          <button 
            className="text-gray-500 text-sm"
            onClick={handleComment}
          >
            View all {post.comments.length} comments
          </button>
          
          {post.comments.slice(0, 2).map(comment => (
            <div key={comment.id} className="mt-1">
              <p className="text-sm">
                <span className="font-semibold mr-2">{comment.user?.username}</span>
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 