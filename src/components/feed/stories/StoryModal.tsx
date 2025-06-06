import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import IconButton from '@/components/shared/IconButton';
import Avatar from '@/components/shared/Avatar';
import { formatTimeAgo } from '@/utils/formatters';

const StoryModal: React.FC = () => {
  const { 
    stories, 
    currentStoryIndex, 
    isStoryModalOpen, 
    closeStoryModal, 
    nextStory, 
    prevStory,
    markStorySeen
  } = useStore();
  
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const storyDuration = 5000; // 5 seconds per story
  
  const currentStory = stories[currentStoryIndex];
  
  useEffect(() => {
    if (isStoryModalOpen && currentStory) {
      // Only mark story as seen if it hasn't been seen before
      if (!currentStory.seen) {
        markStorySeen(currentStory.id);
      }
      
      // Reset progress
      setProgress(0);
      
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Start progress timer
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = (elapsed / storyDuration) * 100;
        
        if (newProgress >= 100) {
          clearInterval(timerRef.current!);
          nextStory();
        } else {
          setProgress(newProgress);
        }
      }, 100);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStoryModalOpen, currentStoryIndex, currentStory, markStorySeen, nextStory]);
  
  if (!isStoryModalOpen || !currentStory) return null;
  
  const handleTapLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    prevStory();
  };
  
  const handleTapRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    nextStory();
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="relative w-full h-full max-w-md mx-auto">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex space-x-1 p-2">
          <div className="h-1 bg-gray-500/30 rounded-full w-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Close button */}
        <IconButton
          icon={<X size={24} />}
          onClick={closeStoryModal}
          className="absolute top-4 right-4 z-10 text-white"
          variant="ghost"
          size="md"
        />
        
        {/* User info */}
        <div className="absolute top-8 left-4 z-10 flex items-center space-x-3">
          <Avatar 
            src={currentStory.user?.avatar || ''} 
            alt={currentStory.user?.name || ''} 
            size="md" 
          />
          <div>
            <p className="text-white font-semibold">{currentStory.user?.username}</p>
            <p className="text-white/70 text-xs">{formatTimeAgo(currentStory.createdAt)}</p>
          </div>
        </div>
        
        {/* Story content */}
        <div className="w-full h-full">
          <img 
            src={currentStory.mediaUrl} 
            alt="Story" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Tap areas for navigation */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 h-full" onClick={handleTapLeft} />
          <div className="w-1/2 h-full" onClick={handleTapRight} />
        </div>
      </div>
    </div>
  );
};

export default StoryModal; 