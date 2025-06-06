import React from 'react';
import { useStore } from '@/store/useStore';
import Avatar from '../shared/Avatar';
import { Plus } from 'lucide-react';

export default function StoriesBar() {
  const { stories, openAddStoryModal } = useStore();

  const handleAddStory = () => {
    openAddStoryModal();
  };

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-4 overflow-x-auto pb-2 px-4">
          {/* Add Story Button */}
          <div className="flex flex-col items-center space-y-1">
            <button
              onClick={handleAddStory}
              className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-6 h-6 text-gray-400" />
            </button>
            <span className="text-xs text-gray-500">Add Story</span>
          </div>

          {/* Story Avatars */}
          {stories.map((story) => (
            <div key={story.id} className="flex flex-col items-center space-y-1">
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-full p-[2px] ${
                    story.seen
                      ? 'bg-gray-200'
                      : 'bg-gradient-to-tr from-yellow-400 to-pink-500'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white p-[2px]">
                    <Avatar
                      src={story.user?.avatar || ''}
                      alt={story.user?.name || ''}
                      size="lg"
                    />
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 truncate max-w-[64px]">
                {story.user?.username || ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 