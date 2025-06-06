import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Avatar from '@/components/shared/Avatar';
import IconButton from '@/components/shared/IconButton';
import Button from '@/components/shared/Button';
import { formatTimeAgo } from '@/utils/formatters';

export default function CommentModal() {
  const { 
    isCommentModalOpen, 
    closeCommentModal, 
    currentPostId, 
    posts, 
    addNewComment,
    currentUser
  } = useStore();
  
  const [commentText, setCommentText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const currentPost = posts.find(post => post.id === currentPostId);
  
  useEffect(() => {
    if (isCommentModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCommentModalOpen]);
  
  if (!isCommentModalOpen || !currentPost) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (commentText.trim() && currentPostId) {
      addNewComment(currentPostId, commentText);
      setCommentText('');
    }
  };
  
  return (
    <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Comments</h2>
          <IconButton
            icon={<X size={24} />}
            onClick={closeCommentModal}
          />
        </div>
        
        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentPost.comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
          ) : (
            currentPost.comments.map(comment => (
              <div key={comment.id} className="flex space-x-3 mb-4">
                <Avatar 
                  src={comment.user?.avatar || ''} 
                  alt={comment.user?.name || ''} 
                  size="sm" 
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="font-semibold text-sm">{comment.user?.username}</p>
                    <p>{comment.text}</p>
                  </div>
                  <div className="flex items-center mt-1 space-x-3">
                    <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
                    <button className="text-xs font-medium">Like</button>
                    <button className="text-xs font-medium">Reply</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Comment input */}
        <div className="border-t p-3">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <Avatar 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              size="sm" 
            />
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-[#EF4443]"
            />
            <Button
              type="submit"
              disabled={!commentText.trim()}
              variant="primary"
              size="sm"
            >
              Post
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 