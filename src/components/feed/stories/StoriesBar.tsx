import React, { useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import Avatar from '../shared/Avatar';
import { useStore } from '@/store/useStore';

const StoriesBar: React.FC = () => {
  const { stories, fetchStories, openStoryModal, openAddStoryModal, currentUser } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchStories();
  }, [fetchStories]);
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      const currentScroll = scrollRef.current.scrollLeft;
      
      scrollRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="relative bg-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <button 
            className="absolute left-2 z-10 bg-white/80 rounded-full p-1 shadow-md"
            onClick={() => handleScroll('left')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div 
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide py-2 px-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* Your Story */}
            <div className="flex flex-col items-center space-y-1 min-w-[72px]">
              <div 
                className="relative cursor-pointer"
                onClick={openAddStoryModal}
              >
                <Avatar 
                  src={currentUser.avatar} 
                  alt="Your Story" 
                  size="lg" 
                />
                <div className="absolute bottom-0 right-0 bg-[#EF4443] rounded-full p-1 border-2 border-white">
                  <Plus size={14} className="text-white" />
                </div>
              </div>
              <span className="text-xs">Your Story</span>
            </div>
            
            {/* Other Stories */}
            {stories.map((story) => (
              <div 
                key={story.id} 
                className="flex flex-col items-center space-y-1 min-w-[72px]"
                onClick={() => openStoryModal(story.userId)}
              >
                <Avatar 
                  src={story.user?.avatar || ''} 
                  alt={story.user?.name || ''} 
                  size="lg" 
                  hasStory={true}
                  seen={story.seen}
                />
                <span className="text-xs truncate w-16 text-center">
                  {story.user?.username || ''}
                </span>
              </div>
            ))}
          </div>
          
          <button 
            className="absolute right-2 z-10 bg-white/80 rounded-full p-1 shadow-md"
            onClick={() => handleScroll('right')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoriesBar; 